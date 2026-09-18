'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle, Activity, Thermometer, FileText, User, ChevronRight } from 'lucide-react'
import styles from './visit.module.css'

const SYMPTOMS = ['बुखार', 'सिरदर्द', 'खांसी', 'उल्टी', 'दस्त', 'पेटदर्द', 'चक्कर', 'कमजोरी', 'सांस फूलना', 'शरीर में दर्द', 'गले में दर्द', 'आँखों में जलन']

export default function NewVisit() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [data, setData] = useState({ name: '', age: '', gender: '', symptoms: [], temperature: '', notes: '' })
    const [diagnosis, setDiagnosis] = useState(null)

    const set = (k, v) => setData(d => ({ ...d, [k]: v }))
    const toggleSymptom = s => set('symptoms', data.symptoms.includes(s) ? data.symptoms.filter(x => x !== s) : [...data.symptoms, s])

    const calcSeverity = () => {
        let score = 0
        if (data.symptoms.includes('बुखार') && parseFloat(data.temperature) > 102) score += 3
        if (data.symptoms.includes('सांस फूलना')) score += 3
        if (data.symptoms.includes('चक्कर')) score += 2
        if (data.symptoms.length > 4) score += 2
        if (parseInt(data.age) < 5 || parseInt(data.age) > 60) score += 1
        return score >= 5 ? 'high' : score >= 3 ? 'medium' : 'low'
    }

    const getDiagnosis = () => {
        const s = data.symptoms
        const severity = calcSeverity()
        if (s.includes('बुखार') && s.includes('सिरदर्द'))
            return { condition: 'Viral Infection (Suspected)', advice: 'Rest, stay hydrated. If fever persists beyond 3 days, visit PHC.', severity }
        if (s.includes('दस्त') && s.includes('उल्टी'))
            return { condition: 'Gastroenteritis', advice: 'Give ORS solution, increase fluids. Visit PHC if severe dehydration.', severity }
        if (s.includes('सांस फूलना'))
            return { condition: 'Respiratory Issue (Urgent)', advice: 'Immediate PHC visit recommended. Monitor oxygen levels.', severity }
        return { condition: 'General Symptoms', advice: 'Monitor symptoms. Contact health center if condition worsens.', severity }
    }

    const handleNext = () => {
        if (step === 1) {
            if (!data.name || !data.age || !data.gender) return
            setStep(2)
        } else if (step === 2) {
            if (data.symptoms.length === 0) return
            setDiagnosis(getDiagnosis())
            setStep(3)
        }
    }

    const savePatient = () => {
        const patients = JSON.parse(localStorage.getItem('patients') || '[]')
        patients.push({ ...data, ...diagnosis, date: new Date().toISOString() })
        localStorage.setItem('patients', JSON.stringify(patients))
        router.push('/dashboard')
    }

    const steps = [
        { n: 1, label: 'Patient Info', icon: User },
        { n: 2, label: 'Symptoms', icon: Activity },
        { n: 3, label: 'Diagnosis', icon: FileText },
    ]

    return (
        <div className={styles.root}>
            {/* Header */}
            <div className={styles.header}>
                <button onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} className={styles.backBtn}>
                    <ArrowLeft size={18} /> Back
                </button>
                <div className={styles.stepIndicator}>
                    {steps.map(({ n, label, icon: Icon }, i) => (
                        <div key={n} className={styles.stepItem}>
                            <div className={`${styles.stepCircle} ${step >= n ? styles.stepDone : ''} ${step === n ? styles.stepActive : ''}`}>
                                {step > n ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                            </div>
                            <span className={`${styles.stepLabel} ${step === n ? styles.stepLabelActive : ''}`}>{label}</span>
                            {i < steps.length - 1 && <div className={`${styles.stepLine} ${step > n ? styles.stepLineDone : ''}`} />}
                        </div>
                    ))}
                </div>
                <div style={{ width: 80 }} />
            </div>

            <div className={styles.body}>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" className={styles.card} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <div className={styles.cardHead}>
                                <div className={styles.cardIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}><User size={24} /></div>
                                <div>
                                    <h2>Patient Information</h2>
                                    <p>Enter basic details about the patient</p>
                                </div>
                            </div>
                            <div className={styles.fields}>
                                <div className={styles.field}>
                                    <label>Patient Name *</label>
                                    <input type="text" value={data.name} onChange={e => set('name', e.target.value)} placeholder="मरीज़ का नाम" />
                                </div>
                                <div className={styles.row}>
                                    <div className={styles.field}>
                                        <label>Age *</label>
                                        <input type="number" value={data.age} onChange={e => set('age', e.target.value)} placeholder="उम्र" min="0" max="120" />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Gender *</label>
                                        <select value={data.gender} onChange={e => set('gender', e.target.value)}>
                                            <option value="">Select</option>
                                            <option value="male">Male / पुरुष</option>
                                            <option value="female">Female / महिला</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleNext} className={styles.nextBtn} disabled={!data.name || !data.age || !data.gender}>
                                Continue <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" className={styles.card} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <div className={styles.cardHead}>
                                <div className={styles.cardIcon} style={{ background: '#fef9c3', color: '#a16207' }}><Activity size={24} /></div>
                                <div>
                                    <h2>Symptoms</h2>
                                    <p>Select all symptoms the patient is experiencing</p>
                                </div>
                            </div>
                            <div className={styles.symptomsGrid}>
                                {SYMPTOMS.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleSymptom(s)}
                                        className={`${styles.symptomChip} ${data.symptoms.includes(s) ? styles.symptomSelected : ''}`}
                                    >
                                        {data.symptoms.includes(s) && <CheckCircle2 size={14} />}
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className={styles.fields} style={{ marginTop: 24 }}>
                                <div className={styles.field}>
                                    <label><Thermometer size={14} style={{ display: 'inline', marginRight: 6 }} />Temperature (°F)</label>
                                    <input type="number" value={data.temperature} onChange={e => set('temperature', e.target.value)} placeholder="98.6" step="0.1" />
                                </div>
                                <div className={styles.field}>
                                    <label>Additional Notes</label>
                                    <textarea value={data.notes} onChange={e => set('notes', e.target.value)} placeholder="Any other observations..." rows={3} />
                                </div>
                            </div>
                            <button onClick={handleNext} className={styles.nextBtn} disabled={data.symptoms.length === 0}>
                                Analyze with AI <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && diagnosis && (
                        <motion.div key="step3" className={styles.card} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                            <div className={styles.cardHead}>
                                <div className={styles.cardIcon} style={{ background: '#f0fdf4', color: '#16a34a' }}><FileText size={24} /></div>
                                <div>
                                    <h2>AI Diagnosis Result</h2>
                                    <p>Based on symptoms provided</p>
                                </div>
                            </div>

                            <div className={styles.diagnosisBox}>
                                <div className={`${styles.severityBanner} ${styles[diagnosis.severity]}`}>
                                    {diagnosis.severity === 'low' && <><CheckCircle2 size={20} /> Low Risk — Routine Care</>}
                                    {diagnosis.severity === 'medium' && <><Activity size={20} /> Medium Risk — Monitor Closely</>}
                                    {diagnosis.severity === 'high' && <><AlertTriangle size={20} /> High Risk — Immediate Action Required</>}
                                </div>

                                <div className={styles.diagnosisContent}>
                                    <div className={styles.diagnosisField}>
                                        <span className={styles.diagnosisFieldLabel}>Probable Condition</span>
                                        <span className={styles.diagnosisFieldValue}>{diagnosis.condition}</span>
                                    </div>
                                    <div className={styles.diagnosisField}>
                                        <span className={styles.diagnosisFieldLabel}>Recommended Action</span>
                                        <span className={styles.diagnosisFieldValue}>{diagnosis.advice}</span>
                                    </div>
                                    <div className={styles.diagnosisField}>
                                        <span className={styles.diagnosisFieldLabel}>Symptoms Recorded</span>
                                        <div className={styles.symptomTags}>
                                            {data.symptoms.map(s => <span key={s} className={styles.symptomTag}>{s}</span>)}
                                        </div>
                                    </div>
                                </div>

                                {diagnosis.severity === 'high' && (
                                    <div className={styles.alertBox}>
                                        <AlertTriangle size={20} />
                                        <div>
                                            <strong>PHC Doctor Alert</strong>
                                            <p>This case has been flagged as critical. PHC doctor will be notified via SMS.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button onClick={savePatient} className={styles.saveBtn}>
                                <CheckCircle2 size={18} /> Save & Complete Visit
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
