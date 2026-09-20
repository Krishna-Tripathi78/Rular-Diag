const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Initialize AWS services
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const bedrock = new AWS.BedrockRuntime({ region: process.env.AWS_REGION });

// Environment variables
const PATIENT_TABLE = process.env.PATIENT_TABLE;
const DIAGNOSIS_TABLE = process.env.DIAGNOSIS_TABLE;
const ALERT_TOPIC = process.env.ALERT_TOPIC;

// Medical knowledge base for rule-based diagnosis
const SYMPTOMS_DATABASE = {
    fever: { severity: 3, conditions: ['infection', 'malaria', 'typhoid', 'flu'] },
    cough: { severity: 2, conditions: ['cold', 'bronchitis', 'pneumonia', 'tuberculosis'] },
    'difficulty_breathing': { severity: 8, conditions: ['pneumonia', 'asthma', 'covid'] },
    'chest_pain': { severity: 7, conditions: ['heart_attack', 'pneumonia', 'acid_reflux'] },
    'severe_headache': { severity: 6, conditions: ['migraine', 'hypertension', 'meningitis'] },
    vomiting: { severity: 4, conditions: ['food_poisoning', 'gastroenteritis', 'pregnancy'] },
    diarrhea: { severity: 4, conditions: ['gastroenteritis', 'food_poisoning', 'cholera'] },
    'abdominal_pain': { severity: 5, conditions: ['appendicitis', 'gastritis', 'food_poisoning'] },
    rash: { severity: 2, conditions: ['allergy', 'viral_infection', 'eczema'] },
    fatigue: { severity: 2, conditions: ['anemia', 'diabetes', 'thyroid', 'depression'] }
};

const CONDITION_INFO = {
    malaria: {
        description: 'Mosquito-borne infectious disease',
        urgency: 'high',
        recommendations: ['Immediate medical attention', 'Blood test required', 'Antimalarial medication'],
        prevention: 'Use mosquito nets, eliminate standing water'
    },
    pneumonia: {
        description: 'Infection of lungs causing inflammation',
        urgency: 'high',
        recommendations: ['Urgent hospital visit', 'Chest X-ray', 'Antibiotics if bacterial'],
        prevention: 'Vaccination, good hygiene, avoid smoking'
    },
    tuberculosis: {
        description: 'Bacterial infection primarily affecting lungs',
        urgency: 'high',
        recommendations: ['Sputum test', 'Chest X-ray', 'Contact PHC immediately', 'Isolate patient'],
        prevention: 'BCG vaccination, avoid crowded spaces, good nutrition'
    },
    gastroenteritis: {
        description: 'Inflammation of stomach and intestines',
        urgency: 'medium',
        recommendations: ['Oral rehydration solution', 'BRAT diet', 'Monitor hydration'],
        prevention: 'Clean water, proper sanitation, hand hygiene'
    },
    hypertension: {
        description: 'High blood pressure',
        urgency: 'medium',
        recommendations: ['Regular BP monitoring', 'Low salt diet', 'Regular exercise', 'Medication if needed'],
        prevention: 'Healthy diet, regular exercise, stress management'
    }
};

exports.handler = async (event) => {
    console.log('Diagnosis request received:', JSON.stringify(event, null, 2));

    try {
        // Parse request body
        const body = JSON.parse(event.body || '{}');
        const {
            symptoms = [],
            age,
            gender,
            vitals = {},
            patientId,
            village,
            ashaWorker,
            language = 'en'
        } = body;

        // Validate required fields
        if (!symptoms.length || !patientId) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    error: 'Missing required fields: symptoms and patientId'
                })
            };
        }

        // Generate diagnosis ID
        const diagnosisId = uuidv4();
        const timestamp = new Date().toISOString();

        // Analyze symptoms using rule-based approach (fallback for Bedrock)
        const diagnosis = await analyzeSymptoms(symptoms, age, gender, vitals);

        // Calculate overall severity
        const severityScore = calculateSeverityScore(symptoms, diagnosis);

        // Determine urgency level
        const urgency = determineUrgency(severityScore, diagnosis);

        // Create comprehensive diagnosis result
        const diagnosisResult = {
            diagnosisId,
            patientId,
            timestamp,
            symptoms,
            age,
            gender,
            vitals,
            village,
            ashaWorker,
            diagnosis: {
                primaryConditions: diagnosis.conditions.slice(0, 3),
                allConditions: diagnosis.conditions,
                confidence: diagnosis.confidence,
                severityScore,
                urgency,
                recommendations: diagnosis.recommendations,
                redFlags: diagnosis.redFlags
            },
            language,
            processed: true
        };

        // Save to DynamoDB
        await Promise.all([
            // Save to diagnosis table
            dynamodb.put({
                TableName: DIAGNOSIS_TABLE,
                Item: diagnosisResult
            }).promise(),

            // Update patient record
            dynamodb.update({
                TableName: PATIENT_TABLE,
                Key: { patientId },
                UpdateExpression: 'SET lastDiagnosis = :diagnosis, lastVisit = :timestamp, #status = :status',
                ExpressionAttributeNames: {
                    '#status': 'status'
                },
                ExpressionAttributeValues: {
                    ':diagnosis': diagnosisId,
                    ':timestamp': timestamp,
                    ':status': urgency
                }
            }).promise()
        ]);

        // Send alert if critical
        if (urgency === 'critical' || severityScore >= 8) {
            await sendEmergencyAlert(diagnosisResult);
        }

        // Translate response if needed
        const response = language === 'hi' ?
            await translateToHindi(diagnosisResult) :
            diagnosisResult;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: response
            })
        };

    } catch (error) {
        console.error('Diagnosis error:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};

// Rule-based symptom analysis
async function analyzeSymptoms(symptoms, age, gender, vitals) {
    const analysisResult = {
        conditions: [],
        confidence: 0.7,
        recommendations: [],
        redFlags: []
    };

    // Score each potential condition
    const conditionScores = {};

    symptoms.forEach(symptom => {
        const symptomData = SYMPTOMS_DATABASE[symptom.toLowerCase().replace(/ /g, '_')];
        if (symptomData) {
            symptomData.conditions.forEach(condition => {
                conditionScores[condition] = (conditionScores[condition] || 0) + symptomData.severity;
            });
        }
    });

    // Sort conditions by score
    const sortedConditions = Object.entries(conditionScores)
        .sort(([, a], [, b]) => b - a)
        .map(([condition]) => condition);

    analysisResult.conditions = sortedConditions;

    // Generate recommendations based on top conditions
    const topCondition = sortedConditions[0];
    if (topCondition && CONDITION_INFO[topCondition]) {
        const info = CONDITION_INFO[topCondition];
        analysisResult.recommendations = info.recommendations;

        if (info.urgency === 'high') {
            analysisResult.redFlags.push(`${topCondition} requires immediate medical attention`);
        }
    }

    // Age and gender specific adjustments
    if (age > 60) {
        analysisResult.redFlags.push('Patient is elderly - monitor closely');
        analysisResult.confidence += 0.1;
    }

    // Vital signs analysis
    if (vitals.temperature > 101.5) {
        analysisResult.redFlags.push('High fever detected');
    }

    if (vitals.bloodPressure && vitals.bloodPressure.systolic > 140) {
        analysisResult.redFlags.push('High blood pressure detected');
    }

    // Try Bedrock AI if available (enhancement)
    try {
        const aiAnalysis = await callBedrockAI(symptoms, age, gender, vitals);
        if (aiAnalysis) {
            analysisResult.confidence = Math.min(0.95, analysisResult.confidence + 0.15);
            analysisResult.conditions = [...new Set([...aiAnalysis.conditions, ...analysisResult.conditions])];
        }
    } catch (error) {
        console.log('Bedrock unavailable, using rule-based analysis:', error.message);
    }

    return analysisResult;
}

// AWS Bedrock AI integration (when available)
async function callBedrockAI(symptoms, age, gender, vitals) {
    try {
        const prompt = `As a medical AI assistant for rural healthcare, analyze these patient symptoms:
    
Patient: ${age} year old ${gender}
Symptoms: ${symptoms.join(', ')}
Vitals: ${JSON.stringify(vitals)}

Provide a concise medical analysis in JSON format:
{
  "conditions": ["condition1", "condition2", "condition3"],
  "confidence": 0.85,
  "urgency": "low/medium/high/critical",
  "recommendations": ["recommendation1", "recommendation2"]
}

Focus on common conditions in rural India. Be conservative with urgency.`;

        const params = {
            modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 500,
                temperature: 0.1,
                messages: [{ role: 'user', content: prompt }]
            })
        };

        const response = await bedrock.invokeModel(params).promise();
        const result = JSON.parse(response.body.toString());

        return JSON.parse(result.content[0].text.trim());
    } catch (error) {
        console.log('Bedrock AI not available:', error.message);
        return null;
    }
}

// Calculate severity score (0-10)
function calculateSeverityScore(symptoms, diagnosis) {
    let maxSeverity = 0;

    symptoms.forEach(symptom => {
        const symptomData = SYMPTOMS_DATABASE[symptom.toLowerCase().replace(/ /g, '_')];
        if (symptomData) {
            maxSeverity = Math.max(maxSeverity, symptomData.severity);
        }
    });

    // Adjust based on diagnosis
    if (diagnosis.redFlags.length > 2) {
        maxSeverity += 1;
    }

    return Math.min(10, maxSeverity);
}

// Determine urgency level
function determineUrgency(severityScore, diagnosis) {
    if (severityScore >= 8 || diagnosis.redFlags.length > 2) {
        return 'critical';
    } else if (severityScore >= 6) {
        return 'high';
    } else if (severityScore >= 4) {
        return 'medium';
    } else {
        return 'low';
    }
}

// Send emergency alert via SNS
async function sendEmergencyAlert(diagnosisResult) {
    try {
        const message = {
            alert: 'CRITICAL PATIENT ALERT',
            patientId: diagnosisResult.patientId,
            village: diagnosisResult.village,
            ashaWorker: diagnosisResult.ashaWorker,
            conditions: diagnosisResult.diagnosis.primaryConditions,
            severityScore: diagnosisResult.diagnosis.severityScore,
            timestamp: diagnosisResult.timestamp,
            recommendations: diagnosisResult.diagnosis.recommendations
        };

        await sns.publish({
            TopicArn: ALERT_TOPIC,
            Subject: `🚨 CRITICAL: Patient Alert from ${diagnosisResult.village}`,
            Message: JSON.stringify(message, null, 2)
        }).promise();

        console.log('Emergency alert sent for patient:', diagnosisResult.patientId);
    } catch (error) {
        console.error('Failed to send alert:', error);
    }
}

// Basic Hindi translation for key terms
async function translateToHindi(diagnosisResult) {
    const translations = {
        fever: 'बुखार',
        cough: 'खांसी',
        'difficulty_breathing': 'सांस लेने में कठिनाई',
        'chest_pain': 'छाती में दर्द',
        'severe_headache': 'तेज सिरदर्द',
        vomiting: 'उल्टी',
        diarrhea: 'दस्त',
        'abdominal_pain': 'पेट में दर्द',
        rash: 'दाने',
        fatigue: 'कमजोरी',
        malaria: 'मलेरिया',
        pneumonia: 'निमोनिया',
        tuberculosis: 'तपेदिक',
        gastroenteritis: 'पेट की खराबी',
        hypertension: 'उच्च रक्तचाप'
    };

    // Create a copy to avoid mutation
    const translated = JSON.parse(JSON.stringify(diagnosisResult));

    // Translate primary conditions
    if (translated.diagnosis && translated.diagnosis.primaryConditions) {
        translated.diagnosis.primaryConditionsHindi = translated.diagnosis.primaryConditions.map(
            condition => translations[condition] || condition
        );
    }

    return translated;
}