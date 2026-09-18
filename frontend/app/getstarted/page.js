'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, HeartPulse, Stethoscope, MapPin } from 'lucide-react'
import styles from './getstarted.module.css'

export default function GetStarted() {
    const router = useRouter()
    const [workerName, setWorkerName] = useState('')
    const [village, setVillage] = useState('')
    const [language, setLanguage] = useState('hi')

    const handleStart = () => {
        if (!workerName || !village) return
        localStorage.setItem('worker', JSON.stringify({ workerName, village, language }))
        router.push('/dashboard')
    }

    return (
        <div className={styles.root}>
            {/* Background orbs */}
            <div className={styles.orb1} />
            <div className={styles.orb2} />

            <div className={styles.container}>
                {/* Left panel */}
                <motion.div
                    className={styles.left}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <button className={styles.backBtn} onClick={() => router.push('/')}>
                        <ArrowLeft size={16} /> Back
                    </button>

                    <div className={styles.leftContent}>
                        <div className={styles.logoWrap}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h1 className={styles.leftTitle}>RuralDiag</h1>
                        <p className={styles.leftSub}>AI Healthcare for Rural India</p>

                        <div className={styles.highlights}>
                            {[
                                { icon: HeartPulse, text: 'Instant AI diagnosis powered by AWS Bedrock' },
                                { icon: Stethoscope, text: 'Auto-alerts to PHC doctors for critical cases' },
                                { icon: MapPin, text: 'Works offline in remote villages' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className={styles.highlight}>
                                    <div className={styles.highlightIcon}><Icon size={16} /></div>
                                    <span>{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right panel — form */}
                <motion.div
                    className={styles.right}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className={styles.formCard}>
                        <div className={styles.formHeader}>
                            <h2>Welcome, ASHA Worker</h2>
                            <p>आशा कार्यकर्ता प्रवेश — Enter your details to begin</p>
                        </div>

                        <div className={styles.form}>
                            <div className={styles.field}>
                                <label>आपका नाम / Your Name</label>
                                <input
                                    type="text"
                                    value={workerName}
                                    onChange={e => setWorkerName(e.target.value)}
                                    placeholder="उदाहरण: सुनीता देवी"
                                    onKeyDown={e => e.key === 'Enter' && handleStart()}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>गांव का नाम / Village</label>
                                <input
                                    type="text"
                                    value={village}
                                    onChange={e => setVillage(e.target.value)}
                                    placeholder="उदाहरण: रामपुर"
                                    onKeyDown={e => e.key === 'Enter' && handleStart()}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>भाषा चुनें / Select Language</label>
                                <select value={language} onChange={e => setLanguage(e.target.value)}>
                                    <option value="hi">हिंदी (Hindi)</option>
                                    <option value="te">తెలుగు (Telugu)</option>
                                    <option value="bn">বাংলা (Bengali)</option>
                                    <option value="ta">தமிழ் (Tamil)</option>
                                    <option value="mr">मराठी (Marathi)</option>
                                </select>
                            </div>

                            <button
                                onClick={handleStart}
                                className={styles.submitBtn}
                                disabled={!workerName || !village}
                            >
                                प्रवेश करें / Enter Dashboard <ArrowRight size={18} />
                            </button>
                        </div>

                        <p className={styles.altLink}>
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
