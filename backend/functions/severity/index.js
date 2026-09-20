const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const DIAGNOSIS_TABLE = process.env.DIAGNOSIS_TABLE;

// Severity scoring matrix
const SEVERITY_MATRIX = {
    // Critical symptoms - require immediate attention
    critical: {
        'difficulty_breathing': 10,
        'severe_chest_pain': 10,
        'unconsciousness': 10,
        'severe_bleeding': 10,
        'seizures': 10,
        'stroke_symptoms': 10,
        'severe_abdominal_pain': 9,
        'high_fever_with_confusion': 9
    },

    // High priority symptoms
    high: {
        'persistent_fever': 7,
        'severe_headache': 7,
        'chest_pain': 7,
        'difficulty_swallowing': 6,
        'persistent_vomiting': 6,
        'severe_dehydration': 8,
        'blood_in_stool': 7,
        'blood_in_urine': 6
    },

    // Medium priority symptoms
    medium: {
        'fever': 4,
        'cough': 3,
        'headache': 3,
        'nausea': 3,
        'diarrhea': 4,
        'fatigue': 2,
        'body_ache': 2,
        'sore_throat': 2
    },

    // Low priority symptoms
    low: {
        'mild_headache': 1,
        'runny_nose': 1,
        'sneezing': 1,
        'mild_cough': 1,
        'minor_cuts': 1
    }
};

// Age-based risk factors
const AGE_RISK = {
    infant: 1.5,    // 0-2 years
    child: 1.2,     // 3-12 years
    teen: 1.0,      // 13-18 years
    adult: 1.0,     // 19-59 years
    elderly: 1.4    // 60+ years
};

// Gender-specific risk factors for certain conditions
const GENDER_RISK = {
    pregnancy_related: {
        female: 1.3,
        male: 0
    },
    heart_disease: {
        male: 1.2,
        female: 1.0
    },
    osteoporosis: {
        female: 1.3,
        male: 1.0
    }
};

// Vital signs normal ranges
const VITAL_RANGES = {
    temperature: { min: 97, max: 99.5, critical_high: 103, critical_low: 95 },
    heartRate: { min: 60, max: 100, critical_high: 120, critical_low: 50 },
    bloodPressure: {
        systolic: { min: 90, max: 120, critical_high: 180, critical_low: 70 },
        diastolic: { min: 60, max: 80, critical_high: 120, critical_low: 40 }
    },
    respiratoryRate: { min: 12, max: 20, critical_high: 30, critical_low: 8 },
    oxygenSaturation: { min: 95, max: 100, critical_low: 90 }
};

exports.handler = async (event) => {
    console.log('Severity calculation request:', JSON.stringify(event, null, 2));

    try {
        const body = JSON.parse(event.body || '{}');
        const {
            symptoms = [],
            age,
            gender,
            vitals = {},
            medicalHistory = [],
            diagnosisId
        } = body;

        // Calculate base severity from symptoms
        const symptomSeverity = calculateSymptomSeverity(symptoms);

        // Apply age-based adjustments
        const ageAdjustedSeverity = applyAgeRiskFactors(symptomSeverity, age);

        // Apply vital signs impact
        const vitalAdjustedSeverity = applyVitalSignsImpact(ageAdjustedSeverity, vitals);

        // Apply medical history factors
        const historyAdjustedSeverity = applyMedicalHistoryFactors(vitalAdjustedSeverity, medicalHistory);

        // Final severity score (0-10)
        const finalSeverity = Math.min(10, Math.max(0, historyAdjustedSeverity));

        // Determine priority level
        const priority = determinePriority(finalSeverity);

        // Calculate time to treatment recommendation
        const timeToTreatment = calculateTimeToTreatment(finalSeverity, symptoms);

        // Generate risk assessment
        const riskAssessment = generateRiskAssessment(symptoms, vitals, age, gender, finalSeverity);

        const severityResult = {
            severityScore: Math.round(finalSeverity * 10) / 10, // Round to 1 decimal
            priority,
            timeToTreatment,
            riskFactors: riskAssessment.factors,
            warnings: riskAssessment.warnings,
            breakdown: {
                baseSymptomScore: Math.round(symptomSeverity * 10) / 10,
                ageAdjustment: Math.round((ageAdjustedSeverity - symptomSeverity) * 10) / 10,
                vitalSignsAdjustment: Math.round((vitalAdjustedSeverity - ageAdjustedSeverity) * 10) / 10,
                medicalHistoryAdjustment: Math.round((historyAdjustedSeverity - vitalAdjustedSeverity) * 10) / 10
            },
            recommendations: generateRecommendations(finalSeverity, symptoms, vitals),
            timestamp: new Date().toISOString()
        };

        // Save to database if diagnosisId provided
        if (diagnosisId) {
            await dynamodb.update({
                TableName: DIAGNOSIS_TABLE,
                Key: { diagnosisId },
                UpdateExpression: 'SET severityAnalysis = :severity',
                ExpressionAttributeValues: {
                    ':severity': severityResult
                }
            }).promise();
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                data: severityResult
            })
        };

    } catch (error) {
        console.error('Severity calculation error:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Failed to calculate severity',
                message: error.message
            })
        };
    }
};

function calculateSymptomSeverity(symptoms) {
    if (!symptoms || symptoms.length === 0) return 0;

    let totalScore = 0;
    let maxScore = 0;

    symptoms.forEach(symptom => {
        const normalizedSymptom = symptom.toLowerCase().replace(/ /g, '_');

        // Check each severity category
        let score = 0;
        Object.keys(SEVERITY_MATRIX).forEach(category => {
            if (SEVERITY_MATRIX[category][normalizedSymptom]) {
                score = SEVERITY_MATRIX[category][normalizedSymptom];
            }
        });

        totalScore += score;
        maxScore = Math.max(maxScore, score);
    });

    // Use combination of max score and average (weighted toward max for safety)
    const averageScore = totalScore / symptoms.length;
    return (maxScore * 0.7) + (averageScore * 0.3);
}

function applyAgeRiskFactors(baseSeverity, age) {
    if (!age) return baseSeverity;

    let riskMultiplier = 1.0;

    if (age <= 2) {
        riskMultiplier = AGE_RISK.infant;
    } else if (age <= 12) {
        riskMultiplier = AGE_RISK.child;
    } else if (age <= 18) {
        riskMultiplier = AGE_RISK.teen;
    } else if (age <= 59) {
        riskMultiplier = AGE_RISK.adult;
    } else {
        riskMultiplier = AGE_RISK.elderly;
    }

    return baseSeverity * riskMultiplier;
}

function applyVitalSignsImpact(baseSeverity, vitals) {
    if (!vitals || Object.keys(vitals).length === 0) {
        return baseSeverity;
    }

    let vitalImpact = 0;

    // Temperature impact
    if (vitals.temperature) {
        if (vitals.temperature >= VITAL_RANGES.temperature.critical_high ||
            vitals.temperature <= VITAL_RANGES.temperature.critical_low) {
            vitalImpact += 2;
        } else if (vitals.temperature > VITAL_RANGES.temperature.max) {
            vitalImpact += 1;
        }
    }

    // Heart rate impact
    if (vitals.heartRate) {
        if (vitals.heartRate >= VITAL_RANGES.heartRate.critical_high ||
            vitals.heartRate <= VITAL_RANGES.heartRate.critical_low) {
            vitalImpact += 2;
        } else if (vitals.heartRate > VITAL_RANGES.heartRate.max ||
            vitals.heartRate < VITAL_RANGES.heartRate.min) {
            vitalImpact += 0.5;
        }
    }

    // Blood pressure impact
    if (vitals.bloodPressure) {
        const systolic = vitals.bloodPressure.systolic;
        const diastolic = vitals.bloodPressure.diastolic;

        if (systolic >= VITAL_RANGES.bloodPressure.systolic.critical_high ||
            systolic <= VITAL_RANGES.bloodPressure.systolic.critical_low ||
            diastolic >= VITAL_RANGES.bloodPressure.diastolic.critical_high ||
            diastolic <= VITAL_RANGES.bloodPressure.diastolic.critical_low) {
            vitalImpact += 2;
        } else if (systolic > VITAL_RANGES.bloodPressure.systolic.max ||
            diastolic > VITAL_RANGES.bloodPressure.diastolic.max) {
            vitalImpact += 1;
        }
    }

    // Oxygen saturation impact
    if (vitals.oxygenSaturation) {
        if (vitals.oxygenSaturation <= VITAL_RANGES.oxygenSaturation.critical_low) {
            vitalImpact += 3;
        } else if (vitals.oxygenSaturation < VITAL_RANGES.oxygenSaturation.min) {
            vitalImpact += 1.5;
        }
    }

    return baseSeverity + vitalImpact;
}

function applyMedicalHistoryFactors(baseSeverity, medicalHistory) {
    if (!medicalHistory || medicalHistory.length === 0) {
        return baseSeverity;
    }

    let historyImpact = 0;

    // High-risk conditions
    const highRiskConditions = [
        'diabetes', 'heart_disease', 'hypertension', 'asthma', 'copd',
        'kidney_disease', 'liver_disease', 'cancer', 'immunocompromised'
    ];

    medicalHistory.forEach(condition => {
        const normalizedCondition = condition.toLowerCase().replace(/ /g, '_');
        if (highRiskConditions.includes(normalizedCondition)) {
            historyImpact += 0.5;
        }
    });

    return baseSeverity + historyImpact;
}

function determinePriority(severityScore) {
    if (severityScore >= 8) return 'CRITICAL';
    if (severityScore >= 6) return 'HIGH';
    if (severityScore >= 4) return 'MEDIUM';
    return 'LOW';
}

function calculateTimeToTreatment(severityScore, symptoms) {
    if (severityScore >= 9) return 'IMMEDIATE (0-15 minutes)';
    if (severityScore >= 7) return 'URGENT (15 minutes - 1 hour)';
    if (severityScore >= 5) return 'SEMI-URGENT (1-4 hours)';
    if (severityScore >= 3) return 'LESS URGENT (4-24 hours)';
    return 'NON-URGENT (24-48 hours)';
}

function generateRiskAssessment(symptoms, vitals, age, gender, severityScore) {
    const factors = [];
    const warnings = [];

    // Age-related factors
    if (age <= 2) {
        factors.push('Infant - requires close monitoring');
    } else if (age >= 60) {
        factors.push('Elderly patient - increased risk');
    }

    // Critical symptoms
    symptoms.forEach(symptom => {
        const normalized = symptom.toLowerCase().replace(/ /g, '_');
        if (SEVERITY_MATRIX.critical[normalized]) {
            warnings.push(`Critical symptom detected: ${symptom}`);
        }
    });

    // Vital signs warnings
    if (vitals.temperature >= 103) {
        warnings.push('Dangerously high fever');
    }
    if (vitals.oxygenSaturation <= 90) {
        warnings.push('Critically low oxygen saturation');
    }

    // Overall severity warnings
    if (severityScore >= 8) {
        warnings.push('Patient requires immediate medical attention');
    }

    return { factors, warnings };
}

function generateRecommendations(severityScore, symptoms, vitals) {
    const recommendations = [];

    if (severityScore >= 8) {
        recommendations.push('Call emergency services immediately');
        recommendations.push('Do not leave patient alone');
        recommendations.push('Monitor vital signs continuously');
    } else if (severityScore >= 6) {
        recommendations.push('Seek medical attention within 1 hour');
        recommendations.push('Monitor patient closely');
        recommendations.push('Prepare for hospital transport if needed');
    } else if (severityScore >= 4) {
        recommendations.push('Schedule medical consultation today');
        recommendations.push('Monitor symptoms for worsening');
        recommendations.push('Ensure patient rest and hydration');
    } else {
        recommendations.push('Home care with symptom monitoring');
        recommendations.push('Schedule routine medical check if symptoms persist');
        recommendations.push('Maintain good hydration and rest');
    }

    return recommendations;
}