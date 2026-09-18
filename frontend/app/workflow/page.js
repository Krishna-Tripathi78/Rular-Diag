'use client'

import { motion } from 'framer-motion'
import { Syringe, Bot, Bell, CheckCircle2, ArrowDown, ArrowRight, Clock, Shield, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import styles from './workflow.module.css'

const steps = [
    {
        n: '01', icon: Syringe, color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.2)',
        title: 'Collect Symptoms',
        desc: 'The ASHA worker opens the app and starts a new patient visit. They enter symptoms using voice input in their local language or type them manually. The app asks adaptive follow-up questions based on what was entered.',
        details: [
            'Voice input in Hindi, Telugu, Bengali, Tamil, Marathi',
            'Photo upload for visible skin conditions or wounds',
            'Guided adaptive questionnaire — no medical training needed',
            'Works fully offline with local storage',
        ],
    },
    {
        n: '02', icon: Bot, color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)',
        title: 'AI Analysis via AWS Bedrock',
        desc: 'Symptom data is sent to AWS Lambda which calls Bedrock (Claude). The model analyzes symptoms against medical knowledge, factors in patient age, gender, and history, then returns a ranked list of probable conditions with confidence scores.',
        details: [
            'Claude model via AWS Bedrock API',
            'Differential diagnosis with confidence percentages',
            'Patient history and demographics factored in',
            'Response in under 3 seconds on average',
        ],
    },
    {
        n: '03', icon: Zap, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.2)',
        title: 'Severity Scoring',
        desc: 'Lambda runs a severity scoring algorithm combining symptom weights, patient risk factors (age, pregnancy, pre-existing conditions), and AI confidence. A score from 0–100 is calculated and mapped to Low / Medium / High / Critical.',
        details: [
            'Weighted symptom severity matrix',
            'Age and comorbidity risk multipliers',
            'Pre-eclampsia, sepsis, dengue pattern flags',
            'Score stored in DynamoDB with full audit trail',
        ],
    },
    {
        n: '04', icon: Bell, color: '#fb7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.2)',
        title: 'Alert & Action',
        desc: 'If severity is Critical or High, SNS automatically fires an SMS alert to the nearest PHC doctor with patient details and AI summary. The ASHA worker sees clear next-step guidance on screen.',
        details: [
            'AWS SNS SMS to nearest PHC doctor',
            'Doctor acknowledgement tracked in real-time',
            'ASHA worker sees recommended action steps',
            'Ambulance dispatch integration (roadmap)',
        ],
    },
]

export default function WorkflowPage() {
    const router = useRouter()
    return (
        <div className={styles.root}>
            <Navbar />
            <div className={styles.orb1} /><div className={styles.orb2} />

            <section className={styles.hero}>
                <motion.div className={styles.heroInner} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className={styles.tag}>How It Works</div>
                    <h1 className={styles.title}>From Symptom to <span className={styles.grad}>Action in Minutes</span></h1>
                    <p className={styles.sub}>A simple 4-step workflow that any ASHA worker can follow — no medical degree required.</p>
                </motion.div>
            </section>

            <section className={styles.steps}>
                {steps.map(({ n, icon: Icon, color, bg, border, title, desc, details }, i) => (
                    <motion.div key={n}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <div className={`${styles.step} ${i % 2 !== 0 ? styles.stepReverse : ''}`}>
                            <div className={styles.stepVisual}>
                                <div className={styles.stepNum} style={{ color, borderColor: border }}>{n}</div>
                                <div className={styles.stepIconWrap} style={{ background: bg, color }}>
                                    <Icon size={40} />
                                </div>
                                {i < steps.length - 1 && <div className={styles.connector}><ArrowDown size={20} /></div>}
                            </div>
                            <div className={styles.stepContent} style={{ borderColor: border }}>
                                <h2 className={styles.stepTitle}>{title}</h2>
                                <p className={styles.stepDesc}>{desc}</p>
                                <ul className={styles.stepDetails}>
                                    {details.map(d => (
                                        <li key={d}><CheckCircle2 size={14} style={{ color }} />{d}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Stats bar */}
            <section className={styles.statsBar}>
                {[
                    { icon: Clock, val: '< 3s', label: 'AI Response Time' },
                    { icon: Bell, val: '< 10s', label: 'Doctor Alert Delivery' },
                    { icon: Shield, val: '100%', label: 'Offline Capable' },
                    { icon: CheckCircle2, val: '5+', label: 'Languages Supported' },
                ].map(({ icon: Icon, val, label }, i) => (
                    <motion.div key={label} className={styles.stat}
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                        <div className={styles.statIcon}><Icon size={18} /></div>
                        <div className={styles.statVal}>{val}</div>
                        <div className={styles.statLabel}>{label}</div>
                    </motion.div>
                ))}
            </section>

            <section className={styles.cta}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2>See it in action</h2>
                    <p>Start a patient visit and experience the workflow yourself.</p>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        Get Started <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>
        </div>
    )
}
