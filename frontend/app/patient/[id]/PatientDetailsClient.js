'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Download, Trash2, Phone, MapPin, Calendar, Thermometer, User, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'
import styles from './patient.module.css'

export default function PatientDetailsClient({ id }) {
    const router = useRouter()
    const patient = {
        id: id || '001', name: 'Sunita Devi', age: 34, gender: 'Female',
        phone: '+91 98765 43210', village: 'Rampur', address: 'Near Primary School, Rampur',
        bloodGroup: 'B+', lastVisit: '2024-01-15', diagnosis: 'Viral Fever', severity: 'medium',
        symptoms: ['Fever', 'Headache', 'Body pain'], temperature: '101.5°F',
        prescription: 'Paracetamol 500mg, Rest, Fluids',
        notes: 'Patient has history of seasonal fever. Monitor for 3 days.',
        history: [
            { date: '2024-01-15', diagnosis: 'Viral Fever', severity: 'medium' },
            { date: '2023-12-10', diagnosis: 'Cold & Cough', severity: 'low' },
            { date: '2023-11-05', diagnosis: 'Headache', severity: 'low' },
        ]
    }

    const severityIcon = { low: CheckCircle2, medium: Activity, high: AlertTriangle }
    const SevIcon = severityIcon[patient.severity]

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <button onClick={() => router.back()} className={styles.backBtn}><ArrowLeft size={16} /> Back</button>
                <div className={styles.headerActions}>
                    <button className={styles.actionBtn} style={{ background: '#eff6ff', color: '#2563eb' }}><Edit size={15} /> Edit</button>
                    <button className={styles.actionBtn} style={{ background: '#f0fdf4', color: '#16a34a' }}><Download size={15} /> Download</button>
                    <button className={styles.actionBtn} style={{ background: '#fff1f2', color: '#e11d48' }}><Trash2 size={15} /> Delete</button>
                </div>
            </div>

            <div className={styles.content}>
                <motion.div className={styles.patientCard} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={styles.patientTop}>
                        <div className={styles.avatar}><User size={36} /></div>
                        <div className={styles.patientInfo}>
                            <h1>{patient.name}</h1>
                            <div className={styles.tags}>
                                <span className={styles.tag}>{patient.age} yrs</span>
                                <span className={styles.tag}>{patient.gender}</span>
                                <span className={styles.tag}>{patient.bloodGroup}</span>
                            </div>
                        </div>
                        <div className={`${styles.severityBadge} ${styles[patient.severity]}`}>
                            <SevIcon size={14} />
                            {patient.severity === 'low' && 'Low Risk'}
                            {patient.severity === 'medium' && 'Medium Risk'}
                            {patient.severity === 'high' && 'High Risk'}
                        </div>
                    </div>
                    <div className={styles.contactRow}>
                        <div className={styles.contactItem}><Phone size={15} /> {patient.phone}</div>
                        <div className={styles.contactItem}><MapPin size={15} /> {patient.address}</div>
                        <div className={styles.contactItem}><Calendar size={15} /> Last visit: {patient.lastVisit}</div>
                    </div>
                </motion.div>

                <div className={styles.grid2}>
                    <motion.div className={styles.panel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className={styles.panelHead}><h2>Current Diagnosis</h2><span className={styles.panelDate}>{patient.lastVisit}</span></div>
                        <div className={styles.panelBody}>
                            <h3 className={styles.diagnosisTitle}>{patient.diagnosis}</h3>
                            <div className={styles.detailGrid}>
                                <div className={styles.detailItem}>
                                    <label>Symptoms</label>
                                    <div className={styles.symptomTags}>
                                        {patient.symptoms.map(s => <span key={s} className={styles.symptomTag}>{s}</span>)}
                                    </div>
                                </div>
                                <div className={styles.detailItem}>
                                    <label><Thermometer size={13} style={{ display: 'inline', marginRight: 4 }} />Temperature</label>
                                    <span className={styles.tempValue}>{patient.temperature}</span>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Prescription</label>
                                    <p>{patient.prescription}</p>
                                </div>
                                <div className={styles.detailItem}>
                                    <label>Notes</label>
                                    <p>{patient.notes}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div className={styles.panel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <div className={styles.panelHead}><h2>Medical History</h2></div>
                        <div className={styles.historyList}>
                            {patient.history.map((r, i) => (
                                <div key={i} className={styles.historyItem}>
                                    <div className={styles.historyDot} />
                                    <div className={styles.historyContent}>
                                        <div className={styles.historyTop}>
                                            <span className={styles.historyDiag}>{r.diagnosis}</span>
                                            <span className={`${styles.historyBadge} ${styles[r.severity]}`}>{r.severity}</span>
                                        </div>
                                        <span className={styles.historyDate}>{r.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
