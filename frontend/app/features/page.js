'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Smartphone, Globe, BarChart3, Shield, CheckCircle2, ArrowRight, Mic, Camera, Clock, Wifi } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import styles from './features.module.css'

const features = [
    {
        icon: Brain, color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)',
        label: 'AI-Powered Diagnosis',
        desc: 'AWS Bedrock with Claude analyzes patient symptoms against a vast medical knowledge base, returning probable conditions ranked by confidence score.',
        points: ['Differential diagnosis with confidence %', 'Factors in age, gender & history', 'Suggests follow-up questions automatically'],
    },
    {
        icon: Zap, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.2)',
        label: 'Emergency Alerts',
        desc: 'When severity score crosses a critical threshold, SNS fires instant SMS alerts to the nearest PHC doctor — no manual action needed.',
        points: ['Sub-second alert delivery via AWS SNS', 'Nearest PHC auto-selected by location', 'Doctor acknowledgement tracking'],
    },
    {
        icon: Smartphone, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.2)',
        label: 'Offline-First PWA',
        desc: 'Built as a Progressive Web App with service workers. Every feature works without internet — data queues locally and syncs the moment connectivity returns.',
        points: ['IndexedDB local storage', 'Background sync on reconnect', 'Installable on any Android phone'],
    },
    {
        icon: Globe, color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.2)',
        label: 'Multi-Language Support',
        desc: 'Full UI in Hindi, Telugu, Bengali, Tamil, and Marathi. Voice input lets ASHA workers speak symptoms in their native language.',
        points: ['5 regional languages supported', 'Voice-to-text symptom input', 'i18next powered translations'],
    },
    {
        icon: BarChart3, color: '#fb7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.2)',
        label: 'Village Health Tracking',
        desc: 'See all patients across a village on one screen. Spot disease clusters early — multiple fever cases in one area trigger an outbreak warning.',
        points: ['Village-level patient map', 'Outbreak pattern detection', 'Vaccination status tracking'],
    },
    {
        icon: Shield, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.2)',
        label: 'Secure & Compliant',
        desc: 'Patient records encrypted at rest in AWS S3. DynamoDB handles structured data with fine-grained IAM access control per worker.',
        points: ['AES-256 encryption at rest', 'IAM role-based access control', 'Audit trail for every record'],
    },
]

export default function FeaturesPage() {
    const router = useRouter()
    return (
        <div className={styles.root}>
            <Navbar />
            <div className={styles.orb1} /><div className={styles.orb2} />

            {/* Hero */}
            <section className={styles.hero}>
                <motion.div className={styles.heroInner} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className={styles.tag}>Core Features</div>
                    <h1 className={styles.title}>Everything ASHA Workers <br /><span className={styles.grad}>Actually Need</span></h1>
                    <p className={styles.sub}>Six powerful capabilities designed from real field conversations with ASHA workers in Uttar Pradesh.</p>
                </motion.div>
            </section>

            {/* Feature cards */}
            <section className={styles.grid}>
                {features.map(({ icon: Icon, color, bg, border, label, desc, points }, i) => (
                    <motion.div
                        key={label}
                        className={styles.card}
                        style={{ '--border-color': border }}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                    >
                        <div className={styles.iconBox} style={{ background: bg, color }}><Icon size={28} /></div>
                        <h3 className={styles.cardTitle}>{label}</h3>
                        <p className={styles.cardDesc}>{desc}</p>
                        <ul className={styles.points}>
                            {points.map(p => (
                                <li key={p}><CheckCircle2 size={14} style={{ color }} />{p}</li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </section>

            {/* Extra highlights row */}
            <section className={styles.highlights}>
                {[
                    { icon: Mic, label: 'Voice Input', desc: 'Speak symptoms in any supported language' },
                    { icon: Camera, label: 'Photo Upload', desc: 'Capture visible conditions for AI analysis' },
                    { icon: Clock, label: 'Patient History', desc: 'Full visit timeline per patient' },
                    { icon: Wifi, label: 'Auto Sync', desc: 'Seamless data sync when back online' },
                ].map(({ icon: Icon, label, desc }, i) => (
                    <motion.div key={label} className={styles.hlCard}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                        <div className={styles.hlIcon}><Icon size={20} /></div>
                        <div className={styles.hlLabel}>{label}</div>
                        <div className={styles.hlDesc}>{desc}</div>
                    </motion.div>
                ))}
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2>Ready to get started?</h2>
                    <p>Join ASHA workers already using RuralDiag across rural India.</p>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        Start Using RuralDiag <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>
        </div>
    )
}
