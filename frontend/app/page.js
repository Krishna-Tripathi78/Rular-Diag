'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Brain, Zap, Smartphone, Globe, BarChart3, Shield,
    ArrowRight, ChevronRight, Activity, Users, Clock, Star,
    CheckCircle2, Stethoscope, HeartPulse, MapPin,
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
        { icon: Brain, label: 'Diagnosis in Seconds', desc: 'ASHA worker types symptoms, gets ranked probable conditions with confidence scores — no medical degree needed', color: '#8b5cf6', bg: '#f5f3ff' },
        { icon: Zap, label: 'Life-Saving Alerts', desc: 'When severity is critical, the nearest PHC doctor gets an SMS before the ASHA worker even leaves the house', color: '#f59e0b', bg: '#fffbeb' },
        { icon: Smartphone, label: 'Zero Internet Needed', desc: 'Built offline-first. Works in the most remote villages. Syncs everything the moment connectivity returns', color: '#3b82f6', bg: '#eff6ff' },
        { icon: Globe, label: 'Speaks Their Language', desc: "Hindi, Telugu, Bengali, Tamil, Marathi — with voice input so even low-literacy workers can use it", color: '#22c55e', bg: '#f0fdf4' },
        { icon: BarChart3, label: 'Outbreak Early Warning', desc: 'District officers see live disease clusters across villages — dengue, measles, typhoid — before they explode', color: '#06b6d4', bg: '#ecfeff' },
        { icon: Shield, label: 'Patient Privacy', desc: "Every record encrypted end-to-end. Compliant with India's health data guidelines from day one", color: '#f43f5e', bg: '#fff1f2' },
    ]

    const stats = [
        { value: '800M+', label: 'Rural Indians', icon: Users },
        { value: '1000+', label: 'Visits/Month', icon: Activity },
        { value: '5+', label: 'Languages', icon: Globe },
        { value: '24/7', label: 'Support', icon: Clock },
    ]

    return (
        <div className={styles.root}>
            <nav className={styles.nav}>
                <div className={styles.navInner}>
                    <div className={styles.navBrand}>
                        <div className={styles.logoWrap}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div>
                            <span className={styles.brandName}>RuralDiag</span>
                            <span className={styles.brandSub}>Rural Healthcare</span>
                        </div>
                    </div>
                    <div className={styles.navLinks}>
                        {[['Features', '/features'], ['Workflow', '/workflow'], ['Impact', '/impact'], ['About Us', '/about']].map(([l, href]) => (
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

            <section className={styles.hero}>
                <div className={styles.meshBg} />
                <div className={styles.heroOrb1} />
                <div className={styles.heroOrb2} />
                <div className={styles.heroOrb3} />
                <div className={styles.heroInner}>
                    <motion.div className={styles.heroLeft} initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
                        <motion.div variants={fadeUp} className={styles.heroBadge}>
                            <span className={styles.badgeDot} />
                            Trusted by ASHA Workers across Rural India
                        </motion.div>
                        <motion.h1 variants={fadeUp} className={styles.heroTitle}>
                            The Doctor in Every<br />
                            <span className={styles.gradientText}>ASHA Worker&apos;s Pocket</span>
                        </motion.h1>
                        <motion.p variants={fadeUp} className={styles.heroDesc}>
                            800 million rural Indians have no access to timely diagnosis.
                            1 million ASHA workers visit their homes every month — armed with nothing but paper.
                            We gave them a phone app that thinks like a doctor.
                        </motion.p>
                        <motion.div variants={fadeUp} className={styles.heroChecks}>
                            {['Works 100% Offline', '5 Indian Languages', 'Auto Doctor Alerts'].map(c => (
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
                                <Stethoscope size={14} /> Diagnosis Ready
                            </div>
                            <div className={styles.floatBadge3}>
                                <MapPin size={14} /> 4 Villages Covered
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

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

            <section id="features" className={styles.section}>
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTag}>Core Features</div>
                        <h2 className={styles.sectionTitle}>Built for the Field, Not a Boardroom</h2>
                        <p className={styles.sectionSub}>Every feature came from talking to real ASHA workers in Uttar Pradesh villages</p>
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

            <section id="workflow" className={styles.workflowSection}>
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTag}>How It Works</div>
                        <h2 className={styles.sectionTitle}>From Symptoms to Action in 2 Minutes</h2>
                        <p className={styles.sectionSub}>From symptom input to action in under 2 minutes</p>
                    </motion.div>
                    <div className={styles.workflowSteps}>
                        {[
                            { n: '01', title: 'Enter Symptoms', desc: 'Voice or text, in Hindi or 4 other languages. Guided questions adapt based on what the patient says', icon: Syringe },
                            { n: '02', title: 'Instant Diagnosis', desc: 'Severity score calculated in real time. Probable conditions ranked with confidence levels and next steps', icon: Bot },
                            { n: '03', title: 'Doctor Alerted', desc: 'High severity? PHC doctor gets an SMS within seconds. Low severity? ASHA worker gets clear follow-up guidance', icon: Bolt },
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

            <section id="impact" className={styles.impactSection}>
                <div className={styles.impactOrb} />
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTagLight}>Why It Matters</div>
                        <h2 className={styles.sectionTitleLight}>The Problem Is Massive. So Is the Opportunity.</h2>
                    </motion.div>
                    <div className={styles.impactGrid}>
                        {[
                            { val: '1M+', label: 'ASHA Workers Ready', sub: 'Trained frontline workers who can use RuralDiag today — no new hiring needed' },
                            { val: '800M', label: 'People Underserved', sub: 'Rural Indians with little or no access to timely medical diagnosis' },
                            { val: '72hrs', label: 'Average Delay Today', sub: 'How long it takes a critical rural patient to reach a specialist — we cut that to minutes' },
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

            <section id="comparison" className={styles.comparisonSection}>
                <div className={styles.sectionInner}>
                    <motion.div className={styles.sectionHead} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.sectionTag}>Why RuralDiag</div>
                        <h2 className={styles.sectionTitle}>How We Compare</h2>
                        <p className={styles.sectionSub}>The only solution built specifically for rural frontline healthcare workers</p>
                    </motion.div>
                    <motion.div className={styles.comparisonTable} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div className={styles.comparisonRow}>
                            <div className={styles.comparisonHeader} style={{ textAlign: 'left', paddingLeft: 28 }}>Feature</div>
                            <div className={styles.comparisonHeader} style={{ color: '#4ade80' }}>RuralDiag</div>
                            <div className={styles.comparisonHeader}>MaatriSahayak</div>
                            <div className={styles.comparisonHeader}>Govt RCH Portal</div>
                            <div className={styles.comparisonHeader}>Practo</div>
                        </div>
                        {[
                            { label: 'Offline Support', vals: ['✅ Full offline', '❌ Urban only', '❌ No', '❌ No'] },
                            { label: 'Smart Diagnosis', vals: ['✅ Yes', '⚠️ Basic triage', '❌ No', '⚠️ Symptom checker'] },
                            { label: 'Rural ASHA Focus', vals: ['✅ Built for ASHA', '❌ Urban EMTs', '⚠️ Data entry only', '❌ Urban patients'] },
                            { label: 'Multilingual (Hindi+)', vals: ['✅ 5 languages', '⚠️ English only', '⚠️ Hindi only', '⚠️ Limited'] },
                            { label: 'Emergency Alerts', vals: ['✅ Auto SMS', '✅ Dispatch', '❌ No', '❌ No'] },
                            { label: 'District Analytics', vals: ['✅ Yes', '❌ No', '⚠️ Basic reports', '❌ No'] },
                            { label: 'Works on Low-end Phones', vals: ['✅ PWA optimized', '❌ No', '⚠️ Web only', '❌ No'] },
                            { label: 'Free for ASHA Workers', vals: ['✅ Free', '❌ Paid', '✅ Govt funded', '❌ Paid'] },
                        ].map(({ label, vals }) => (
                            <div key={label} className={styles.comparisonRow}>
                                <div className={styles.comparisonLabel}>{label}</div>
                                {vals.map((v, i) => (
                                    <div key={i} className={styles.comparisonCell}>
                                        <span className={
                                            v.startsWith('✅') ? styles.iconGreen :
                                            v.startsWith('⚠️') ? styles.iconYellow :
                                            styles.iconRed
                                        }>{v.split(' ')[0]}</span>
                                        <span>{v.split(' ').slice(1).join(' ')}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.ctaGlow} />
                <motion.div className={styles.ctaInner} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <div className={styles.ctaTag}><Star size={14} /> 1 Million ASHA Workers. 800 Million Lives.</div>
                    <h2 className={styles.ctaTitle}>A Child Should Not Die Because the Right Tool Did Not Exist</h2>
                    <p className={styles.ctaSub}>RuralDiag puts the power of diagnosis in the hands of the people already in those villages</p>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        Start Using RuralDiag <ArrowRight size={20} />
                    </button>
                </motion.div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div className={styles.footerBrand}>
                        <div className={styles.footerLogo}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: 32, height: 32, objectFit: 'contain' }} />
                            <span>RuralDiag</span>
                        </div>
                        <p>Diagnosis support for 1M+ ASHA workers across rural India</p>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Product</h4>
                        <a href="#features">Features</a>
                        <a href="#workflow">How it Works</a>
                        <a href="/about">About Us</a>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Resources</h4>
                        <a href="#impact">Impact</a>
                        <a href="#comparison">Compare</a>
                    </div>
                    <div className={styles.footerLinks}>
                        <h4>Contact</h4>
                        <p>contact@ruraldiag.org</p>
                        <p>Built with ❤️ for rural India</p>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>© 2026 RuralDiag. Open source under MIT License.</p>
                </div>
            </footer>
        </div>
    )
}
