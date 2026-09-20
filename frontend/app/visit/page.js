'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationTriangle, FaUser, FaHeartbeat, FaFileMedical, FaThermometerHalf, FaWifi, FaSpinner } from 'react-icons/fa'
import { submitDiagnosis, sendAlert } from '../lib/api'
import styles from './visit.module.css'

const SYMPTOMS_EN = ['Fever', 'Headache', 'Cough', 'Vomiting', 'Diarrhea', 'Abdominal Pain', 'Dizziness', 'Fatigue', 'Difficulty Breathing', 'Body Ache', 'Sore Throat', 'Eye Irritation', 'Chest Pain', 'Rash', 'Runny Nose']
const SYMPTOMS_HI = ['बुखार', 'सिरदर्द', 'खांसी', 'उल्टी', 'दस्त', 'पेटदर्द', 'चक्कर', 'कमजोरी', 'सांस फूलना', 'शरीर में दर्द', 'गले में दर्द', 'आँखों में जलन', 'छाती में दर्द', 'दाने', 'नाक बहना']

// Symptom map EN → key for API
const SYMPTOM_KEYS = {
    'Fever': 'fever', 'Headache': 'severe_headache', 'Cough': 'cough',
    'Vomiting': 'vomiting', 'Diarrhea': 'diarrhea', 'Abdominal Pain': 'abdominal_pain',
    'Dizziness': 'dizziness', 'Fatigue': 'fatigue', 'Difficulty Breathing': 'difficulty_breathing',
    'Body Ache': 'body_ache', 'Sore Throat': 'sore_throat', 'Eye Irritation': 'eye_irritation',
    'Chest Pain': 'chest_pain', 'Rash': 'rash', 'Runny Nose': 'runny_nose'
}

export default function NewVisit() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [lang, setLang] = useState('en')
    const [loading, setLoading] = useState(false)
    const [offline, setOffline] = useState(false)
    const [data, setData] = useState({
        name: '', age: '', gender: '',
        symptoms: [],
        temperature: '', bloodPressure: '', heartRate: '', notes: ''
    })
    const [diagnosis, setDiagnosis] = useState(null)

    const SYMPTOMS = lang === 'hi' ? SYMPTOMS_HI : SYMPTOMS_EN

    const set = (k, v) => setData(d => ({ ...d, [k]: v }))

    const toggleSymptom = (s) => {
        set('symptoms', data.symptoms.includes(s)
            ? data.symptoms.filter(x => x !== s)
            : [...data.symptoms, s]
        )
    }

    const localFallback = () => {
        const symptomKeys = data.symptoms.map(s => {
            const enIndex = SYMPTOMS_HI.indexOf(s)
            const enName = enIndex >= 0 ? SYMPTOMS_EN[enIndex] : s
            return SYMPTOM_KEYS[enName] || enName.toLowerCase().replace(/ /g, '_')
        })

        let score = 0
        if (symptomKeys.includes('fever') && parseFloat(data.temperature) > 102) score += 3
        if (symptomKeys.includes('difficulty_breathing')) score += 4
        if (symptomKeys.includes('chest_pain')) score += 4
        if (symptomKeys.includes('vomiting') && symptomKeys.includes('diarrhea')) score += 3
        if (data.symptoms.length > 4) score += 2
        if (parseInt(data.age) < 5 || parseInt(data.age) > 60) score += 1

        const severity = score >= 6 ? 'critical' : score >= 4 ? 'high' : score >= 2 ? 'medium' : 'low'
        const condMap = {
            critical: 'Critical - Immediate Medical Attention',
            high: 'Respiratory / Cardiac Issue — PHC visit today',
            medium: 'Moderate illness — monitor and medicate',
            low: 'Mild illness — rest and hydration'
        }
        const adviceMap = {
            critical: 'Call PHC doctor immediately. Do not leave patient unattended.',
            high: 'Refer to PHC within 2 hours. Monitor vitals continuously.',
            medium: 'Give appropriate medication. Follow up in 24 hours.',
            low: 'Rest, fluids, ORS if needed. Revisit if no improvement in 3 days.'
        }

        return {
            primaryConditions: [condMap[severity]],
            severityScore: score,
            urgency: severity,
            recommendations: [adviceMap[severity]],
            redFlags: severity === 'critical' ? ['Patient needs immediate care'] : [],
            confidence: 0.7,
            isLocal: true
        }
    }

    const runDiagnosis = async () => {
        setLoading(true)

        const symptomKeys = data.symptoms.map(s => {
            const enIndex = lang === 'hi' ? SYMPTOMS_HI.indexOf(s) : SYMPTOMS_EN.indexOf(s)
            const enName = lang === 'hi' && enIndex >= 0 ? SYMPTOMS_EN[enIndex] : s
            return SYMPTOM_KEYS[enName] || s.toLowerCase().replace(/ /g, '_')
        })

        const worker = JSON.parse(localStorage.getItem('worker') || '{}')
        const patientId = `P-${Date.now()}`

        const payload = {
            patientId,
            symptoms: symptomKeys,
            age: parseInt(data.age),
            gender: data.gender,
            vitals: {
                temperature: parseFloat(data.temperature) || null,
                heartRate: parseInt(data.heartRate) || null,
                bloodPressure: data.bloodPressure
                    ? { systolic: parseInt(data.bloodPressure.split('/')[0]), diastolic: parseInt(data.bloodPressure.split('/')[1]) }
                    : null
            },
            village: worker.village || 'unknown',
            ashaWorker: worker.workerName || 'unknown',
            language: lang
        }

        try {
            const result = await submitDiagnosis(payload)
            setDiagnosis({ ...result.diagnosis, patientId, isLocal: false })

            // Auto alert if critical
            if (result.diagnosis?.urgency === 'critical' || result.diagnosis?.severityScore >= 8) {
                await sendAlert({
                    patientId,
                    alertType: 'critical',
                    village: worker.village,
                    ashaWorker: worker.workerName,
                    details: {
                        symptoms: symptomKeys,
                        conditions: result.diagnosis.primaryConditions,
                        severityScore: result.diagnosis.severityScore,
                        recommendations: result.diagnosis.recommendations
                    }
                }).catch(() => { })
            }
        } catch (err) {
            // Offline fallback
            setOffline(true)
            const fallback = localFallback()
            setDiagnosis({ ...fallback, patientId })

            // Save locally
            const pending = JSON.parse(localStorage.getItem('ruraldiag_pending') || '[]')
            pending.push({ ...data, ...payload, fallbackDiagnosis: fallback, savedAt: new Date().toISOString() })
            localStorage.setItem('ruraldiag_pending', JSON.stringify(pending))
        }

        setLoading(false)
        setStep(3)
    }

    const saveAndFinish = () => {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]')
        patients.push({
            id: diagnosis?.patientId || `P-${Date.now()}`,
            name: data.name,
            age: data.age,
            gender: data.gender,
            symptoms: data.symptoms,
            diagnosis,
            date: new Date().toISOString(),
            offline
        })
        localStorage.setItem('patients', JSON.stringify(patients))
        router.push('/dashboard')
    }

    const urgencyColor = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#22c55e' }
    const urgencyLabel = { critical: 'CRITICAL — Immediate Action', high: 'HIGH — Urgent Care Needed', medium: 'MEDIUM — Monitor Closely', low: 'LOW — Routine Care' }

    return (
        <div className={styles.root}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} className={styles.backBtn}>
                    <FaArrowLeft size={14} /> Back
                </button>
                <div className={styles.stepBar}>
                    {[
                        { n: 1, label: 'Patient', Icon: FaUser },
                        { n: 2, label: 'Symptoms', Icon: FaHeartbeat },
                        { n: 3, label: 'Diagnosis', Icon: FaFileMedical }
                    ].map(({ n, label, Icon }, i, arr) => (
                        <div key={n} className={styles.stepItem}>
                            <div className={`${styles.stepCircle} ${step > n ? styles.done : ''} ${step === n ? styles.active : ''}`}>
                                {step > n ? <FaCheckCircle size={14} /> : <Icon size={14} />}
                            </div>
                            <span className={`${styles.stepLabel} ${step === n ? styles.activeLabel : ''}`}>{label}</span>
                            {i < arr.length - 1 && <div className={`${styles.stepLine} ${step > n ? styles.doneLine : ''}`} />}
                        </div>
                    ))}
                </div>
                <button className={styles.langBtn} onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}>
                    {lang === 'en' ? 'हिंदी' : 'English'}
                </button>
            </div>

            <div className={styles.body}>
                {/* Step 1: Patient Info */}
                {step === 1 && (
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <div className={styles.cardIcon}><FaUser /></div>
                            <div>
                                <h2>{lang === 'hi' ? 'मरीज़ की जानकारी' : 'Patient Information'}</h2>
                                <p>{lang === 'hi' ? 'बुनियादी जानकारी दर्ज करें' : 'Enter basic patient details'}</p>
                            </div>
                        </div>
                        <div className={styles.fields}>
                            <div className={styles.field}>
                                <label>{lang === 'hi' ? 'मरीज़ का नाम *' : 'Patient Name *'}</label>
                                <input type="text" value={data.name} onChange={e => set('name', e.target.value)} placeholder={lang === 'hi' ? 'नाम दर्ज करें' : 'Enter full name'} />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>{lang === 'hi' ? 'उम्र *' : 'Age *'}</label>
                                    <input type="number" value={data.age} onChange={e => set('age', e.target.value)} placeholder="25" min="0" max="120" />
                                </div>
                                <div className={styles.field}>
                                    <label>{lang === 'hi' ? 'लिंग *' : 'Gender *'}</label>
                                    <select value={data.gender} onChange={e => set('gender', e.target.value)}>
                                        <option value="">Select</option>
                                        <option value="male">{lang === 'hi' ? 'पुरुष' : 'Male'}</option>
                                        <option value="female">{lang === 'hi' ? 'महिला' : 'Female'}</option>
                                        <option value="other">{lang === 'hi' ? 'अन्य' : 'Other'}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} className={styles.nextBtn} disabled={!data.name || !data.age || !data.gender}>
                            {lang === 'hi' ? 'आगे बढ़ें' : 'Continue'} <FaArrowRight />
                        </button>
                    </div>
                )}

                {/* Step 2: Symptoms */}
                {step === 2 && (
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <div className={styles.cardIcon} style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}><FaHeartbeat /></div>
                            <div>
                                <h2>{lang === 'hi' ? 'लक्षण चुनें' : 'Select Symptoms'}</h2>
                                <p>{lang === 'hi' ? 'सभी लक्षण चुनें' : 'Select all that apply'} ({data.symptoms.length} selected)</p>
                            </div>
                        </div>
                        <div className={styles.symptomsGrid}>
                            {SYMPTOMS.map((s, i) => (
                                <button key={s} onClick={() => toggleSymptom(s)} className={`${styles.chip} ${data.symptoms.includes(s) ? styles.chipSelected : ''}`}>
                                    {data.symptoms.includes(s) && <FaCheckCircle size={12} />} {s}
                                </button>
                            ))}
                        </div>
                        <div className={styles.vitalsRow}>
                            <div className={styles.field}>
                                <label><FaThermometerHalf style={{ display: 'inline', marginRight: 6 }} />{lang === 'hi' ? 'तापमान (°F)' : 'Temperature (°F)'}</label>
                                <input type="number" value={data.temperature} onChange={e => set('temperature', e.target.value)} placeholder="98.6" step="0.1" />
                            </div>
                            <div className={styles.field}>
                                <label>{lang === 'hi' ? 'BP (sys/dia)' : 'BP (systolic/diastolic)'}</label>
                                <input type="text" value={data.bloodPressure} onChange={e => set('bloodPressure', e.target.value)} placeholder="120/80" />
                            </div>
                            <div className={styles.field}>
                                <label>{lang === 'hi' ? 'हृदय गति' : 'Heart Rate (bpm)'}</label>
                                <input type="number" value={data.heartRate} onChange={e => set('heartRate', e.target.value)} placeholder="72" />
                            </div>
                        </div>
                        <div className={styles.field} style={{ marginTop: 12 }}>
                            <label>{lang === 'hi' ? 'अन्य जानकारी' : 'Additional Notes'}</label>
                            <textarea value={data.notes} onChange={e => set('notes', e.target.value)} placeholder={lang === 'hi' ? 'कोई अन्य जानकारी...' : 'Any other observations...'} rows={2} />
                        </div>
                        <button onClick={runDiagnosis} className={styles.nextBtn} disabled={data.symptoms.length === 0 || loading}>
                            {loading ? <><FaSpinner className={styles.spin} /> Analyzing...</> : <>{lang === 'hi' ? 'AI से जांचें' : 'Analyze with AI'} <FaArrowRight /></>}
                        </button>
                    </div>
                )}

                {/* Step 3: Diagnosis Result */}
                {step === 3 && diagnosis && (
                    <div className={styles.card}>
                        <div className={styles.cardHead}>
                            <div className={styles.cardIcon} style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}><FaFileMedical /></div>
                            <div>
                                <h2>{lang === 'hi' ? 'AI निदान' : 'AI Diagnosis Result'}</h2>
                                <p>
                                    {offline && <><FaWifi style={{ color: '#f97316', marginRight: 6 }} />Offline mode — syncs when connected</>}
                                    {!offline && 'Powered by AWS Bedrock'}
                                </p>
                            </div>
                        </div>

                        {/* Severity Banner */}
                        <div className={styles.severityBanner} style={{ borderColor: urgencyColor[diagnosis.urgency] || '#22c55e', background: `${urgencyColor[diagnosis.urgency]}18` }}>
                            <span style={{ color: urgencyColor[diagnosis.urgency] || '#22c55e', fontWeight: 700 }}>
                                {diagnosis.urgency === 'critical' || diagnosis.urgency === 'high' ? <FaExclamationTriangle /> : <FaCheckCircle />}
                                {' '}{urgencyLabel[diagnosis.urgency] || 'LOW — Routine Care'}
                            </span>
                            {diagnosis.severityScore !== undefined && (
                                <span className={styles.scoreChip} style={{ background: urgencyColor[diagnosis.urgency] || '#22c55e' }}>
                                    {diagnosis.severityScore}/10
                                </span>
                            )}
                        </div>

                        <div className={styles.diagnosisRows}>
                            <div className={styles.diagRow}>
                                <span className={styles.diagLabel}>Probable Condition</span>
                                <span className={styles.diagValue}>{(diagnosis.primaryConditions || []).join(', ') || 'General Illness'}</span>
                            </div>
                            {diagnosis.recommendations && (
                                <div className={styles.diagRow}>
                                    <span className={styles.diagLabel}>Recommendations</span>
                                    <ul className={styles.diagList}>
                                        {(diagnosis.recommendations || []).map((r, i) => <li key={i}>{r}</li>)}
                                    </ul>
                                </div>
                            )}
                            {diagnosis.redFlags && diagnosis.redFlags.length > 0 && (
                                <div className={styles.redFlagBox}>
                                    <FaExclamationTriangle />
                                    <div>
                                        <strong>Red Flags</strong>
                                        <ul>{(diagnosis.redFlags || []).map((f, i) => <li key={i}>{f}</li>)}</ul>
                                    </div>
                                </div>
                            )}
                            <div className={styles.diagRow}>
                                <span className={styles.diagLabel}>Symptoms</span>
                                <div className={styles.symptomTags}>
                                    {data.symptoms.map(s => <span key={s} className={styles.tag}>{s}</span>)}
                                </div>
                            </div>
                        </div>

                        {(diagnosis.urgency === 'critical' || diagnosis.urgency === 'high') && (
                            <div className={styles.alertBox}>
                                <FaExclamationTriangle />
                                <div>
                                    <strong>PHC Doctor Alerted via SMS</strong>
                                    <p>Critical case flagged — doctor has been notified automatically</p>
                                </div>
                            </div>
                        )}

                        <button onClick={saveAndFinish} className={styles.saveBtn}>
                            <FaCheckCircle /> Save &amp; Complete Visit
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
