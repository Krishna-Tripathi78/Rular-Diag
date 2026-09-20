// RuralDiag API Client
// Connects frontend to AWS API Gateway → Lambda functions

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Generic fetch wrapper with offline support
async function request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    try {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: res.statusText }));
            throw new Error(err.error || `Request failed: ${res.status}`);
        }

        const data = await res.json();
        return data.data || data;

    } catch (error) {
        // Offline fallback — queue for sync
        if (error.message.includes('fetch') || error.message.includes('network')) {
            if (options.offlineKey && options.body) {
                queueOffline(options.offlineKey, JSON.parse(options.body));
            }
            throw new Error('OFFLINE: Data saved locally for sync');
        }
        throw error;
    }
}

// ── Diagnosis ──────────────────────────────────────────────────
export async function submitDiagnosis(payload) {
    return request('/diagnose', {
        method: 'POST',
        body: JSON.stringify(payload),
        offlineKey: 'pending_diagnoses'
    });
}

// ── Severity ───────────────────────────────────────────────────
export async function calculateSeverity(payload) {
    return request('/severity', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

// ── Sync ───────────────────────────────────────────────────────
export async function syncOfflineData(ashaWorker, village) {
    const pending = getPendingQueue();
    if (!pending.patients.length && !pending.diagnoses.length) {
        return { synced: 0, message: 'Nothing to sync' };
    }

    const result = await request('/sync', {
        method: 'POST',
        body: JSON.stringify({ ...pending, ashaWorker, village })
    });

    clearPendingQueue();
    return result;
}

// ── Alerts ─────────────────────────────────────────────────────
export async function sendAlert(payload) {
    return request('/alerts', {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

// ── Analytics ──────────────────────────────────────────────────
export async function getAnalytics(type = 'overview', params = {}) {
    const query = new URLSearchParams({ type, ...params }).toString();
    return request(`/analytics?${query}`, { method: 'GET' });
}

export async function getVillageStats(village, days = 30) {
    return getAnalytics('village', { village, days });
}

export async function getTrends(days = 30) {
    return getAnalytics('trends', { days });
}

export async function getTopConditions(days = 30) {
    return getAnalytics('conditions', { days });
}

export async function getCriticalAlerts(days = 7) {
    return getAnalytics('alerts', { days });
}

// ── Offline Queue ──────────────────────────────────────────────
function queueOffline(key, data) {
    try {
        const existing = JSON.parse(localStorage.getItem('ruraldiag_offline') || '{"patients":[],"diagnoses":[]}');
        if (key === 'pending_diagnoses') {
            existing.diagnoses.push({ ...data, offlineAt: new Date().toISOString() });
        } else if (key === 'pending_patients') {
            existing.patients.push({ ...data, offlineAt: new Date().toISOString() });
        }
        localStorage.setItem('ruraldiag_offline', JSON.stringify(existing));
    } catch (e) {
        console.warn('Could not queue offline data:', e);
    }
}

function getPendingQueue() {
    try {
        return JSON.parse(localStorage.getItem('ruraldiag_offline') || '{"patients":[],"diagnoses":[]}');
    } catch {
        return { patients: [], diagnoses: [] };
    }
}

function clearPendingQueue() {
    localStorage.removeItem('ruraldiag_offline');
}

export function hasPendingSync() {
    const q = getPendingQueue();
    return q.patients.length + q.diagnoses.length;
}
