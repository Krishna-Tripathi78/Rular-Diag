'use client'

import { motion } from 'framer-motion'
import { HeartPulse, Baby, Flame, TrendingUp, Users, Clock, MapPin, ArrowRight, Quote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Navbar from '../components/Navbar'
import styles from './impact.module.css'

const metrics = [
    { val: '50%', label: 'Faster Emergency Response', desc: 'Critical cases reach doctors in seconds, not hours', color: '#2dd4bf' },
    { val: '800M+', label: 'Rural Indians Served', desc: 'Population that can benefit from this platform', color: '#a78bfa' },
    { val: '1000+', label: 'Visits Per Month', desc: 'Average patient visits handled per ASHA worker', color: '#fbbf24' },
    { val: 'Early', label: 'Outbreak Detection', desc: 'Disease clusters spotted before they spread', color: '#fb7185' },
]

const scenarios = [
    {
        icon: HeartPulse, color: '#fb7185', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.2)',
        title: 'Child with High Fever & Rash',
        outcome: 'Treated same day — not days later',
        story: 'A 7-year-old presents with 102°F fever and a spreading rash. The ASHA worker inputs symptoms. AI flags possible measles with high confidence, severity marked Critical. The PHC doctor receives an SMS alert within seconds and advises immediate clinic visit. The child gets treatment the same day instead of waiting until the condition becomes life-threatening.',
        tags: ['Measles Detection', 'Critical Alert', 'Same-Day Treatment'],
    },
    {
        icon: Baby, color: '#a78bfa', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.2)',
        title: 'Pregnant Woman — Pre-eclampsia',
        outcome: 'Ambulance dispatched, complications prevented',
        story: 'A 7-month pregnant woman reports severe headache and swollen feet. The system cross-references her previous high BP readings stored in DynamoDB. AI flags potential pre-eclampsia. A Critical alert fires, an ambulance is dispatched, and she is transferred to the district hospital in time to prevent serious complications.',
        tags: ['Pre-eclampsia Flag', 'History Cross-reference', 'Ambulance Dispatch'],
    },
    {
        icon: Flame, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)',
        title: 'Dengue Outbreak Contained',
        outcome: 'Fumigation deployed before epidemic spread',
        story: 'QuickSight analytics show 15 fever cases in one village over 7 days. The pattern-detection algorithm flags a probable dengue cluster. The district officer sees the alert on their dashboard, deploys a fumigation team and sets up a medical camp. The outbreak is contained before spreading to neighboring villages.',
        tags: ['Pattern Detection', 'District Dashboard', 'Outbreak Contained'],
    },
]

export default function ImpactPage() {
    const router = useRouter()
    return (
        <div className={styles.root}>
            <Navbar />
            <div className={styles.orb1} /><div className={styles.orb2} />

            <section className={styles.hero}>
                <motion.div className={styles.heroInner} initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className={styles.tag}>Measurable Impact</div>
                    <h1 className={styles.title}>Real Results, <span className={styles.grad}>Real Lives</span></h1>
                    <p className={styles.sub}>Every number here represents a person in rural India who got better care because an ASHA worker had the right tool.</p>
                </motion.div>
            </section>

            {/* Metrics */}
            <section className={styles.metrics}>
                {metrics.map(({ val, label, desc, color }, i) => (
                    <motion.div key={label} className={styles.metricCard}
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: i * 0.09 }}>
                        <div className={styles.metricVal} style={{ color }}>{val}</div>
                        <div className={styles.metricLabel}>{label}</div>
                        <div className={styles.metricDesc}>{desc}</div>
                    </motion.div>
                ))}
            </section>

            {/* Scenarios */}
            <section className={styles.scenarios}>
                <div className={styles.scenariosHead}>
                    <div className={styles.tag}>Real Scenarios</div>
                    <h2 className={styles.sectionTitle}>How RuralDiag Saves Lives</h2>
                </div>
                {scenarios.map(({ icon: Icon, color, bg, border, title, outcome, story, tags }, i) => (
                    <motion.div key={title} className={styles.scenario} style={{ borderColor: border }}
                        initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <div className={styles.scenarioLeft}>
                            <div className={styles.scenarioIcon} style={{ background: bg, color }}><Icon size={32} /></div>
                            <div className={styles.scenarioNum}>0{i + 1}</div>
                        </div>
                        <div className={styles.scenarioRight}>
                            <div className={styles.scenarioOutcome} style={{ color }}>{outcome}</div>
                            <h3 className={styles.scenarioTitle}>{title}</h3>
                            <p className={styles.scenarioStory}>{story}</p>
                            <div className={styles.scenarioTags}>
                                {tags.map(t => <span key={t} className={styles.scenarioTag} style={{ borderColor: border, color }}>{t}</span>)}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Quote */}
            <section className={styles.quoteSection}>
                <motion.div className={styles.quoteCard} initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                    <Quote size={32} className={styles.quoteIcon} />
                    <p className={styles.quoteText}>"The biggest challenge isn't lack of dedication — it's lack of tools. We visit over a thousand homes a month and write everything on paper. When someone is seriously sick, by the time we reach a hospital it's often too late."</p>
                    <div className={styles.quoteAuthor}>
                        <div className={styles.quoteAvatar}>A</div>
                        <div>
                            <div className={styles.quoteName}>ASHA Worker, Uttar Pradesh</div>
                            <div className={styles.quoteSub}>Field interview, 2024</div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <section className={styles.cta}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2>Be part of the change</h2>
                    <p>Give frontline workers the AI tools they deserve.</p>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        Start Using RuralDiag <ArrowRight size={18} />
                    </button>
                </motion.div>
            </section>
        </div>
    )
}
