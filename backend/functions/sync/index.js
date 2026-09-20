const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const PATIENT_TABLE = process.env.PATIENT_TABLE;
const DIAGNOSIS_TABLE = process.env.DIAGNOSIS_TABLE;
const BUCKET = process.env.PATIENT_DATA_BUCKET || process.env.S3_BUCKET;

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body || '{}');
        const { patients = [], diagnoses = [], ashaWorker, village } = body;

        const results = { synced: 0, failed: 0, errors: [] };

        // Sync patients in batch
        const patientChunks = chunkArray(patients, 25);
        for (const chunk of patientChunks) {
            const writeRequests = chunk.map(patient => ({
                PutRequest: {
                    Item: {
                        ...patient,
                        patientId: patient.patientId || uuidv4(),
                        village: village || patient.village,
                        syncedAt: new Date().toISOString(),
                        syncedBy: ashaWorker
                    }
                }
            }));

            try {
                await dynamodb.batchWrite({
                    RequestItems: { [PATIENT_TABLE]: writeRequests }
                }).promise();
                results.synced += chunk.length;
            } catch (err) {
                results.failed += chunk.length;
                results.errors.push(err.message);
            }
        }

        // Sync diagnoses in batch
        const diagChunks = chunkArray(diagnoses, 25);
        for (const chunk of diagChunks) {
            const writeRequests = chunk.map(diag => ({
                PutRequest: {
                    Item: {
                        ...diag,
                        diagnosisId: diag.diagnosisId || uuidv4(),
                        syncedAt: new Date().toISOString()
                    }
                }
            }));

            try {
                await dynamodb.batchWrite({
                    RequestItems: { [DIAGNOSIS_TABLE]: writeRequests }
                }).promise();
                results.synced += chunk.length;
            } catch (err) {
                results.failed += chunk.length;
                results.errors.push(err.message);
            }
        }

        // Save sync log to S3
        if (BUCKET) {
            const logKey = `sync-logs/${village}/${new Date().toISOString().split('T')[0]}.json`;
            await s3.putObject({
                Bucket: BUCKET,
                Key: logKey,
                Body: JSON.stringify({ ashaWorker, village, results, timestamp: new Date().toISOString() }),
                ContentType: 'application/json'
            }).promise().catch(() => { }); // Non-critical
        }

        return response(200, { success: true, results });
    } catch (error) {
        console.error('Sync error:', error);
        return response(500, { error: error.message });
    }
};

function chunkArray(arr, size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

function response(statusCode, body) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(body)
    };
}
