'use client'

import { useRouter } from 'next/navigation'

import { motion } from 'framer-motion'
import {
    Brain, Zap, Smartphone, Globe, BarChart3, Shield,
    ArrowRight, ChevronRight, Activity, Users, Clock, Star,
    CheckCircle2, Stethoscope, HeartPulse, MapPin,
    Server, Database, Bell, HardDrive, LineChart,
    Syringe, Bot, Bolt
} from 'lucide-react'
import styles from './page.module.css'

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] } })
}

export default function Home() {
    const router = useRouter()


    const features = [
        { icon: Brain, label: 'AI-Powered Diagnosis', desc: 'AWS Bedrock analyzes symptoms and returns probable conditions with confidence scores', color: '#8b5cf6', bg: '#f5f3ff' },
        { icon: Zap, label: 'Emergency Alerts', desc: 'Critical cases trigger instant SNS alerts to PHC doctors via SMS', color: '#f59e0b', bg: '#fffbeb' },
        { icon: Smartphone, label: 'Offline Capable', desc: 'Works without internet. Data syncs automatically when connection returns', color: '#3b82f6', bg: '#eff6ff' },
        { icon: Globe, label: 'Multi-Language', desc: 'Hindi, Telugu, Bengali, Tamil, Marathi with voice input support', color: '#22c55e', bg: '#f0fdf4' },
        { icon: BarChart3, label: 'Health Dashboard', desc: 'District-level analytics with outbreak detection via QuickSight', color: '#06b6d4', bg: '#ecfeff' },
        { icon: Shield, label: 'Secure Storage', desc: 'Patient records encrypted in AWS S3 with DynamoDB tracking', color: '#f43f5e', bg: '#fff1f2' },
    ]

    const stats = [
        { value: '800M+', label: 'Rural Indians', icon: Users },
        { value: '1000+', label: 'Visits/Month', icon: Activity },
        { value: '5+', label: 'Languages', icon: Globe },
        { value: '24/7', label: 'AI Support', icon: Clock },
    ]

    const techStack = [
        { icon: Brain,     name: 'AWS Bedrock', desc: 'AI Diagnosis',    color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
        { icon: Zap,       name: 'Lambda',      desc: 'Serverless',      color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
        { icon: Database,  name: 'DynamoDB',    desc: 'Patient Records', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
        { icon: Bell,      name: 'SNS',         desc: 'Alerts',          color: '#f43f5e', bg: 'rgba(244,63,94,0.15)'  },
        { icon: HardDrive, name: 'S3',          desc: 'File Storage',    color: '#22c55e', bg: 'rgba(34,197,94,0.15)'  },
        { icon: LineChart, name: 'QuickSight',  desc: 'Analytics',       color: '#06b6d4', bg: 'rgba(6,182,212,0.15)'  },
    ]

    return (
        <div className={styles.root}>
            {/* ── NAV ── */}
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    <div className={styles.navBrand}>
                        <div className={styles.logoWrap}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div>
                            <span className={styles.brandName}>RuralDiag</span>
                            <span className={styles.brandSub}>AI Healthcare</span>
                        </div>
                    </div>
                    <div className={styles.navLinks}>
                        {[['Features', '/features'], ['Workflow', '/workflow'], ['Impact', '/impact'], ['Technology', '/technology']].map(([l, href]) => (
                            <a key={l} href={href} className={styles.navLink}>{l}</a>
                        ))}
                    </div>
                    <div className={styles.navRight}>
                        <button onClick={() => router.push('/login')} className={styles.navLogin}>Login</button>
                        <button onClick={() => router.push('/getstarted')} className={styles.navCta}>
                            Get Started <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className={styles.hero}>
                <div className={styles.meshBg} />
                <div className={styles.heroOrb1} />
                <div className={styles.heroOrb2} />
                <div className={styles.heroOrb3} />

                <div className={styles.heroInner}>
                    <motion.div className={styles.heroLeft} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className={styles.heroBadge}>
                            <span className={styles.badgeDot} />
                            Powered by AWS Bedrock &amp; Claude AI
                        </motion.div>

                        <motion.h1 variants={fadeUp} className={styles.heroTitle}>
                            Smart Healthcare<br />
                            for <span className={styles.gradientText}>Rural India</span>
                        </motion.h1>

                        <motion.p variants={fadeUp} className={styles.heroDesc}>
                            Empowering ASHA workers with AI diagnostics, offline-first mobile experience,
                            and real-time health intelligence for 800M+ rural Indians.
                        </motion.p>

                        <motion.div variants={fadeUp} className={styles.heroChecks}>
                            {['AWS Bedrock AI', 'Offline-first PWA', 'Multilingual Support'].map(c => (
                                <div key={c} className={styles.heroCheck}>
                                    <CheckCircle2 size={16} className={styles.checkIcon} />
                                    {c}
                                </div>
                            ))}
                        </motion.div>

                        <motion.div variants={fadeUp} className={styles.heroBtns}>
                            <button onClick={() => router.push('/getstarted')} className={styles.btnPrimary}>
                                Start Using RuralDiag <ArrowRight size={18} />
                            </button>
                            <a href="#workflow" className={styles.btnGhost}>
                                See How It Works <ChevronRight size={16} />
                            </a>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className={styles.heroRight}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        <div className={styles.heroCard}>
                            <div className={styles.heroCardGlow} />
                            <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            <div className={styles.floatBadge1}>
                                <HeartPulse size={14} /> Critical Alert Sent
                            </div>
                            <div className={styles.floatBadge2}>
                                <Stethoscope size={14} /> AI Diagnosis Ready
                            </div>
                            <div className={styles.floatBadge3}>
                                <MapPin size={14} /> 4 Villages Covered
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS ── */}
            <section className={styles.statsSection}>
                <div className={styles.statsInner}>
                    {stats.map(({ value, label, icon: Icon }, i) => (
                        <motion.div
                            key={label}
                            className={styles.statItem}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <div className={styles.statIcon}><Icon size={22} /></div>
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section id="features" className={styles.section}>
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTag}>Core Features</div>
                        <h2 className={styles.sectionTitle}>Designed for Real Healthcare Needs</h2>
                        <p className={styles.sectionSub}>Features that make a difference in rural healthcare delivery</p>
                    </motion.div>
                    <div className={styles.featureGrid}>
                        {features.map(({ icon: Icon, label, desc, color, bg }, i) => (
                            <motion.div
                                key={label}
                                className={styles.featureCard}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            >
                                <div className={styles.featureIconBox} style={{ background: bg, color }}>
                                    <Icon size={26} />
                                </div>
                                <h3 className={styles.featureTitle}>{label}</h3>
                                <p className={styles.featureDesc}>{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WORKFLOW ── */}
            <section id="workflow" className={styles.workflowSection}>
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTag}>How It Works</div>
                        <h2 className={styles.sectionTitle}>Simple 3-Step Workflow</h2>
                        <p className={styles.sectionSub}>From symptom collection to diagnosis in minutes</p>
                    </motion.div>
                    <div className={styles.workflowSteps}>
                        {[
                            { n: '01', title: 'Collect Symptoms', desc: 'ASHA worker inputs patient symptoms using voice or text in their preferred language', icon: Syringe },
                            { n: '02', title: 'AI Analysis', desc: 'AWS Bedrock processes symptoms and generates diagnostic suggestions with severity scores', icon: Bot },
                            { n: '03', title: 'Take Action', desc: 'Get recommendations and auto-alert doctors for critical cases via SNS', icon: Bolt },
                        ].map((step, i) => (
                            <motion.div
                                key={step.n}
                                className={styles.workflowStep}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className={styles.stepNum}>{step.n}</div>
                                <div className={styles.stepIconWrap}><step.icon size={36} /></div>
                                <h3 className={styles.stepTitle}>{step.title}</h3>
                                <p className={styles.stepDesc}>{step.desc}</p>
                                {i < 2 && <div className={styles.stepArrow}><ArrowRight size={20} /></div>}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── IMPACT ── */}
            <section id="impact" className={styles.impactSection}>
                <div className={styles.impactOrb} />
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTagLight}>Measurable Impact</div>
                        <h2 className={styles.sectionTitleLight}>Real Results, Real Lives</h2>
                    </motion.div>
                    <div className={styles.impactGrid}>
                        {[
                            { val: '50%', label: 'Faster Emergency Response', sub: 'Critical cases reach doctors in seconds' },
                            { val: 'Early', label: 'Disease Outbreak Detection', sub: 'Patterns spotted before they spread' },
                            { val: 'Better', label: 'Resource Allocation', sub: 'Data-driven decisions across districts' },
                        ].map((item, i) => (
                            <motion.div
                                key={item.label}
                                className={styles.impactCard}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={styles.impactVal}>{item.val}</div>
                                <div className={styles.impactLabel}>{item.label}</div>
                                <div className={styles.impactSub}>{item.sub}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TECH ── */}
            <section id="technology" className={styles.section}>
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTag}>Technology</div>
                        <h2 className={styles.sectionTitle}>Built on AWS Cloud</h2>
                        <p className={styles.sectionSub}>Enterprise-grade infrastructure for reliable healthcare delivery</p>
                    </motion.div>
                    <div className={styles.techGrid}>
                        {techStack.map((t, i) => (
                            <motion.div
                                key={t.name}
                                className={styles.techCard}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -4 }}
                            >
                                <div className={styles.techIconBox} style={{ background: t.bg, color: t.color }}>
                                    <t.icon size={28} />
                                </div>
                                <div className={styles.techName}>{t.name}</div>
                                <div className={styles.techDesc}>{t.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaGlow} />
                <motion.div className={styles.ctaInner} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className={styles.ctaTag}><Star size={14} /> Join ASHA Workers Across India</div>
                    <h2 className={styles.ctaTitle}>Transform Rural Healthcare Today</h2>
                    <p className={styles.ctaSub}>Give frontline workers the AI tools they deserve</p>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        Start Using RuralDiag <ArrowRight size={20} />
                    </button>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                            <span>RuralDiag</span>
                        </div>
                        <p>AI assistant for ASHA workers serving rural India</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Product</h4>
                        <a href="#features">Features</a>
                        <a href="#workflow">How it Works</a>
                        <a href="#technology">Technology</a>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Resources</h4>
                        <a href="#impact">Impact</a>
                        <a href="#">Documentation</a>
                        <a href="#">API Reference</a>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Contact</h4>
                        <p>contact@ruraldiag.org</p>
                        <p>Built with ❤️ for rural India</p>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>© 2024 RuralDiag. Open source under MIT License.</p>
                </div>
            </footer>


        </div>
    )
}
