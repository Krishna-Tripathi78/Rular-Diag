const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const PATIENT_TABLE = process.env.PATIENT_TABLE;
const DIAGNOSIS_TABLE = process.env.DIAGNOSIS_TABLE;

exports.handler = async (event) => {
    try {
        const params = event.queryStringParameters || {};
        const { type = 'overview', village, days = '30' } = params;

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
        const cutoffISO = cutoffDate.toISOString();

        let data;

        switch (type) {
            case 'overview':
                data = await getOverview(cutoffISO);
                break;
            case 'village':
                data = await getVillageStats(village, cutoffISO);
                break;
            case 'trends':
                data = await getTrends(cutoffISO, parseInt(days));
                break;
            case 'conditions':
                data = await getTopConditions(cutoffISO);
                break;
            case 'alerts':
                data = await getCriticalAlerts(cutoffISO);
                break;
            default:
                data = await getOverview(cutoffISO);
        }

        return response(200, { success: true, data, generatedAt: new Date().toISOString() });

    } catch (error) {
        console.error('Analytics error:', error);
        return response(500, { error: error.message });
    }
};

async function getOverview(since) {
    const [patients, diagnoses] = await Promise.all([
        scanTable(PATIENT_TABLE),
        scanTable(DIAGNOSIS_TABLE)
    ]);

    const recentDiagnoses = diagnoses.filter(d => d.timestamp >= since);
    const criticalCases = recentDiagnoses.filter(d =>
        d.diagnosis && (d.diagnosis.urgency === 'critical' || d.diagnosis.severityScore >= 8)
    );

    const conditionCount = {};
    recentDiagnoses.forEach(d => {
        if (d.diagnosis && d.diagnosis.primaryConditions) {
            d.diagnosis.primaryConditions.forEach(c => {
                conditionCount[c] = (conditionCount[c] || 0) + 1;
            });
        }
    });

    const topConditions = Object.entries(conditionCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

    const villageSet = new Set(patients.map(p => p.village).filter(Boolean));

    return {
        totalPatients: patients.length,
        totalDiagnoses: diagnoses.length,
        recentDiagnoses: recentDiagnoses.length,
        criticalCases: criticalCases.length,
        villagesCovered: villageSet.size,
        topConditions,
        alertRate: recentDiagnoses.length > 0
            ? Math.round((criticalCases.length / recentDiagnoses.length) * 100)
            : 0
    };
}

async function getVillageStats(village, since) {
    if (!village) return { error: 'village parameter required' };

    const patients = await queryByVillage(village);
    const diagnoses = await scanTable(DIAGNOSIS_TABLE);

    const patientIds = new Set(patients.map(p => p.patientId));
    const villageDiagnoses = diagnoses.filter(d =>
        patientIds.has(d.patientId) && d.timestamp >= since
    );

    return {
        village,
        totalPatients: patients.length,
        recentDiagnoses: villageDiagnoses.length,
        criticalCases: villageDiagnoses.filter(d =>
            d.diagnosis && d.diagnosis.urgency === 'critical'
        ).length
    };
}

async function getTrends(since, days) {
    const diagnoses = await scanTable(DIAGNOSIS_TABLE);
    const recent = diagnoses.filter(d => d.timestamp >= since);

    // Group by day
    const byDay = {};
    recent.forEach(d => {
        const day = d.timestamp ? d.timestamp.split('T')[0] : 'unknown';
        if (!byDay[day]) byDay[day] = { total: 0, critical: 0 };
        byDay[day].total += 1;
        if (d.diagnosis && d.diagnosis.urgency === 'critical') {
            byDay[day].critical += 1;
        }
    });

    // Build last N days
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        trend.push({ date: key, total: byDay[key]?.total || 0, critical: byDay[key]?.critical || 0 });
    }

    return { trend };
}

async function getTopConditions(since) {
    const diagnoses = await scanTable(DIAGNOSIS_TABLE);
    const recent = diagnoses.filter(d => d.timestamp >= since);

    const conditionCount = {};
    recent.forEach(d => {
        if (d.diagnosis && d.diagnosis.primaryConditions) {
            d.diagnosis.primaryConditions.forEach(c => {
                conditionCount[c] = (conditionCount[c] || 0) + 1;
            });
        }
    });

    return Object.entries(conditionCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, count }));
}

async function getCriticalAlerts(since) {
    const diagnoses = await scanTable(DIAGNOSIS_TABLE);
    return diagnoses
        .filter(d => d.timestamp >= since && d.diagnosis && d.diagnosis.urgency === 'critical')
        .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
        .slice(0, 20)
        .map(d => ({
            diagnosisId: d.diagnosisId,
            patientId: d.patientId,
            village: d.village,
            conditions: d.diagnosis.primaryConditions,
            severity: d.diagnosis.severityScore,
            timestamp: d.timestamp
        }));
}

// DynamoDB helpers
async function scanTable(table) {
    const items = [];
    let lastKey;
    do {
        const params = { TableName: table, Limit: 1000 };
        if (lastKey) params.ExclusiveStartKey = lastKey;
        const result = await dynamodb.scan(params).promise();
        items.push(...(result.Items || []));
        lastKey = result.LastEvaluatedKey;
    } while (lastKey);
    return items;
}

async function queryByVillage(village) {
    const result = await dynamodb.query({
        TableName: PATIENT_TABLE,
        IndexName: 'VillageIndex',
        KeyConditionExpression: 'village = :v',
        ExpressionAttributeValues: { ':v': village }
    }).promise();
    return result.Items || [];
}

function response(statusCode, body) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body)
    };
}
