'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Database, Bell, HardDrive, LineChart, ArrowRight, CheckCircle2, Server, Lock, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import styles from './technology.module.css'

const stack = [
    {
        icon: Brain, color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)',
        name: 'AWS Bedrock', category: 'AI / ML',
        desc: 'The core intelligence layer. Bedrock gives us access to Claude without managing any ML infrastructure. We send structured symptom prompts and receive differential diagnoses with confidence scores.',
        points: ['Claude model for medical reasoning', 'Structured JSON prompt/response', 'No ML infra to manage', 'Scales to millions of requests'],
    },
    {
        icon: Zap, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.2)',
        name: 'AWS Lambda', category: 'Compute',
        desc: 'All backend logic runs serverless. Four Lambda functions handle diagnosis, severity scoring, alert dispatch, and data sync. Zero servers to manage, auto-scales with demand.',
        points: ['diagnosis/ — calls Bedrock', 'severity/ — scoring algorithm', 'alerts/ — SNS dispatch', 'sync/ — DynamoDB writes'],
    },
    {
        icon: Database, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.2)',
        name: 'DynamoDB', category: 'Database',
        desc: 'Patient records, visit history, severity scores, and alert logs all live in DynamoDB. Single-digit millisecond reads, automatic scaling, and built-in TTL for data retention policies.',
        points: ['Patient records table', 'Visit history with full audit trail', 'GSI for village-level queries', 'Point-in-time recovery enabled'],
    },
    {
        icon: Bell, color: '#fb7185', bg: 'rgba(251,113,133,0.12)', border: 'rgba(251,113,133,0.2)',
        name: 'AWS SNS', category: 'Alerts',
        desc: 'When severity crosses the critical threshold, Lambda publishes to an SNS topic. Subscribed PHC doctors receive SMS within seconds. Topic-per-district architecture for targeted routing.',
        points: ['SMS delivery to PHC doctors', 'Topic-per-district routing', 'Delivery status tracking', 'Fallback to email if SMS fails'],
    },
    {
        icon: HardDrive, color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.2)',
        name: 'AWS S3', category: 'Storage',
        desc: 'Patient photos, voice recordings, and exported reports are stored in S3 with server-side AES-256 encryption. Pre-signed URLs give time-limited access without exposing bucket credentials.',
        points: ['AES-256 server-side encryption', 'Pre-signed URL access', 'Lifecycle rules for archival', 'Versioning for audit compliance'],
    },
    {
        icon: LineChart, color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)', border: 'rgba(20,184,166,0.2)',
        name: 'QuickSight', category: 'Analytics',
        desc: 'District officers get a real-time dashboard showing disease trends, village-level heatmaps, ASHA worker performance, and early outbreak warnings — all powered by QuickSight connected to DynamoDB.',
        points: ['Real-time disease surveillance', 'Village heatmap visualizations', 'Outbreak early-warning alerts', 'ASHA performance metrics'],
    },
]

const frontend = [
    { name: 'Next.js / React', desc: 'PWA framework with App Router', color: '#38bdf8' },
    { name: 'Service Workers', desc: 'Offline-first caching strategy', color: '#2dd4bf' },
    { name: 'IndexedDB', desc: 'Local patient data storage', color: '#a78bfa' },
    { name: 'i18next', desc: '5-language translation layer', color: '#fbbf24' },
    { name: 'Framer Motion', desc: 'Smooth UI animations', color: '#fb7185' },
    { name: 'Material-UI', desc: 'Accessible component library', color: '#34d399' },
]

export default function TechnologyPage() {
    const router = useRouter()
    return (
        <div className={styles.root}>
            <Navbar />
            <div className={styles.orb1} /><div className={styles.orb2} />

            <section className={styles.hero}>
                <motion.div className={styles.heroInner} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className={styles.tag}>Technology</div>
                    <h1 className={styles.title}>Built on <span className={styles.grad}>AWS Cloud</span></h1>
                    <p className={styles.sub}>Enterprise-grade infrastructure that scales automatically, costs nothing at idle, and keeps patient data secure.</p>
                </motion.div>
            </section>

            {/* Architecture note */}
            <section className={styles.archNote}>
                <motion.div className={styles.archCard} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className={styles.archFlow}>
                        {['PWA Frontend', '→', 'API Gateway', '→', 'Lambda', '→', 'Bedrock / DynamoDB / SNS / S3'].map((item, i) => (
                            <span key={i} className={item === '→' ? styles.arrow : styles.archNode}>{item}</span>
                        ))}
                    </div>
                    <p className={styles.archDesc}>Fully serverless. No EC2, no containers, no ops overhead. Scales from 1 to 1 million requests automatically.</p>
                </motion.div>
            </section>

            {/* AWS Stack */}
            <section className={styles.stackSection}>
                <div className={styles.stackHead}>
                    <div className={styles.tag}>AWS Services</div>
                    <h2 className={styles.sectionTitle}>The Backend Stack</h2>
                </div>
                <div className={styles.stackGrid}>
                    {stack.map(({ icon: Icon, color, bg, border, name, category, desc, points }, i) => (
                        <motion.div key={name} className={styles.stackCard} style={{ borderColor: border }}
                            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                            <div className={styles.stackCardTop}>
                                <div className={styles.stackIcon} style={{ background: bg, color }}><Icon size={26} /></div>
                                <span className={styles.stackCategory} style={{ color, borderColor: border }}>{category}</span>
                            </div>
                            <h3 className={styles.stackName}>{name}</h3>
                            <p className={styles.stackDesc}>{desc}</p>
                            <ul className={styles.stackPoints}>
                                {points.map(p => <li key={p}><CheckCircle2 size={13} style={{ color }} />{p}</li>)}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Frontend */}
            <section className={styles.frontendSection}>
                <div className={styles.stackHead}>
                    <div className={styles.tag}>Frontend</div>
                    <h2 className={styles.sectionTitle}>The Client Stack</h2>
                </div>
                <div className={styles.frontendGrid}>
                    {frontend.map(({ name, desc, color }, i) => (
                        <motion.div key={name} className={styles.feCard}
                            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                            <div className={styles.feDot} style={{ background: color }} />
                            <div className={styles.feName}>{name}</div>
                            <div className={styles.feDesc}>{desc}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className={styles.cta}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2>Explore the codebase</h2>
                    <p>Open source under MIT. Deploy to your own AWS account in minutes.</p>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        Get Started <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>
        </div>
    )
}
