const AWS = require('aws-sdk');

const sns = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const ALERT_TOPIC = process.env.ALERT_TOPIC;
const PATIENT_TABLE = process.env.PATIENT_TABLE;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { patientId, alertType, diagnosisId, village, ashaWorker, details } = body;

        if (!patientId || !alertType) {
            return response(400, { error: 'patientId and alertType are required' });
        }

        // Fetch patient data
        let patientData = {};
        try {
            const result = await dynamodb.get({
                TableName: PATIENT_TABLE,
                Key: { patientId }
            }).promise();
            patientData = result.Item || {};
        } catch (err) {
            console.warn('Could not fetch patient:', err.message);
        }

        const alertLevel = getAlertLevel(alertType);

        const alertMessage = buildAlertMessage({
            alertType,
            alertLevel,
            patientId,
            patientData,
            diagnosisId,
            village,
            ashaWorker,
            details
        });

        // Publish to SNS
        await sns.publish({
            TopicArn: ALERT_TOPIC,
            Subject: `${alertLevel.emoji} RuralDiag Alert [${alertLevel.label}]: ${village || 'Unknown Village'}`,
            Message: alertMessage,
            MessageAttributes: {
                alertType: { DataType: 'String', StringValue: alertType },
                severity: { DataType: 'String', StringValue: alertLevel.label },
                village: { DataType: 'String', StringValue: village || 'unknown' }
            }
        }).promise();

        return response(200, {
            success: true,
            message: 'Alert sent successfully',
            alertLevel: alertLevel.label
        });

    } catch (error) {
        console.error('Alert error:', error);
        return response(500, { error: error.message });
    }
};

function getAlertLevel(alertType) {
    const levels = {
        critical: { label: 'CRITICAL', emoji: '🚨', priority: 1 },
        emergency: { label: 'EMERGENCY', emoji: '🔴', priority: 1 },
        high: { label: 'HIGH', emoji: '🟠', priority: 2 },
        medium: { label: 'MEDIUM', emoji: '🟡', priority: 3 },
        low: { label: 'LOW', emoji: '🟢', priority: 4 },
        outbreak: { label: 'OUTBREAK WARNING', emoji: '⚠️', priority: 1 }
    };
    return levels[alertType] || levels.medium;
}

function buildAlertMessage({ alertType, alertLevel, patientId, patientData, diagnosisId, village, ashaWorker, details }) {
    const lines = [
        `═══════════════════════════════════`,
        `RURALDIAG ${alertLevel.label} ALERT ${alertLevel.emoji}`,
        `═══════════════════════════════════`,
        ``,
        `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        `Village: ${village || 'Unknown'}`,
        `ASHA Worker: ${ashaWorker || 'Unknown'}`,
        ``,
        `PATIENT INFORMATION`,
        `───────────────────`,
        `Patient ID: ${patientId}`,
        `Name: ${patientData.name || 'Not provided'}`,
        `Age: ${patientData.age || 'Unknown'}`,
        `Gender: ${patientData.gender || 'Unknown'}`,
        ``,
        `DIAGNOSIS DETAILS`,
        `─────────────────`,
        `Diagnosis ID: ${diagnosisId || 'N/A'}`,
        `Alert Type: ${alertType}`,
        ``
    ];

    if (details) {
        lines.push('ADDITIONAL DETAILS');
        lines.push('──────────────────');
        if (details.symptoms) lines.push(`Symptoms: ${details.symptoms.join(', ')}`);
        if (details.conditions) lines.push(`Suspected Conditions: ${details.conditions.join(', ')}`);
        if (details.severityScore) lines.push(`Severity Score: ${details.severityScore}/10`);
        if (details.recommendations) {
            lines.push('');
            lines.push('Recommendations:');
            details.recommendations.forEach(r => lines.push(`  • ${r}`));
        }
        lines.push('');
    }

    lines.push('ACTION REQUIRED');
    lines.push('───────────────');

    if (alertLevel.priority === 1) {
        lines.push('⚡ IMMEDIATE ACTION NEEDED');
        lines.push('→ Contact patient immediately');
        lines.push('→ Dispatch emergency response if needed');
        lines.push('→ Coordinate with nearest PHC/hospital');
    } else if (alertLevel.priority === 2) {
        lines.push('→ Review patient case within 1 hour');
        lines.push('→ Provide guidance to ASHA worker');
        lines.push('→ Prepare for potential hospital referral');
    } else {
        lines.push('→ Review patient case today');
        lines.push('→ Follow up with ASHA worker');
    }

    lines.push('');
    lines.push('───────────────────────────────────');
    lines.push('This is an automated alert from RuralDiag');
    lines.push('AI Healthcare Assistant for Rural India');
    lines.push('───────────────────────────────────');

    return lines.join('\n');
}

function response(statusCode, body) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body)
    };
}
