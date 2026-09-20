'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaArrowLeft, FaHeart, FaUsers, FaGlobeAsia, FaBullseye, FaHandHoldingMedical, FaAward } from 'react-icons/fa'
import styles from './about.module.css'

export default function AboutUs() {
    const team = [
        { name: 'Project Team', role: 'Developers & Designers', desc: 'We visited villages in UP, sat with ASHA workers, watched them work, and built exactly what they asked for' },
        { name: 'ASHA Workers', role: 'Our Real Users', desc: '1 million frontline workers who already visit every home — we just gave them a tool that matches their dedication' },
        { name: 'AWS', role: 'Cloud Partner', desc: 'Bedrock, Lambda, DynamoDB, SNS, S3 — the infrastructure that makes this reliable at scale' },
    ]

    const values = [
        { icon: FaHeart, title: 'People First', desc: 'We did not start with tech. We started with a problem — and the people living it every day' },
        { icon: FaGlobeAsia, title: 'Works Everywhere', desc: 'No internet, low-end phone, 5 different languages — if it does not work in a village, it does not ship' },
        { icon: FaBullseye, title: 'Outcomes Over Features', desc: 'One child treated faster. One outbreak caught early. That is what we measure' },
        { icon: FaHandHoldingMedical, title: 'Backs the Worker', desc: 'ASHA workers already do the hard part. We just make sure they are not doing it alone' },
    ]

    const milestones = [
        { year: '2026', title: 'Hackathon Launch', desc: 'Built, tested, and deployed at AWS Hackathon 2026' },
        { year: 'Year 1', title: '1,000 Villages', desc: 'Partner with 3 districts in UP and Bihar to deploy with real ASHA workers' },
        { year: 'Vision', title: 'National Scale', desc: 'Every ASHA worker in India with a diagnosis tool in their pocket' },
    ]

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Link href="/" className={styles.backBtn}>
                    <FaArrowLeft /> Back to Home
                </Link>
            </div>

            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.badge}>
                        <FaHeart /> Our Story
                    </div>
                    <h1>A 7-Year-Old Had a 102° Fever and a Rash. The ASHA Worker Had No Idea What It Was.</h1>
                    <p>She wrote it on paper, walked to the next house, and hoped someone would follow up. That child waited 3 days to see a doctor. With RuralDiag, the PHC doctor would have been alerted in seconds.</p>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.missionGrid}>
                        <div className={styles.missionText}>
                            <h2>The Problem We Could Not Ignore</h2>
                            <p className={styles.large}>We went to villages in Uttar Pradesh and watched ASHA workers do their rounds. They were incredible — dedicated, trusted, present. But they had nothing. Paper forms. No diagnosis support. No way to flag emergencies.</p>
                            <p>When a pregnant woman showed up with swollen feet and a headache, the ASHA worker had no way to know that was pre-eclampsia. When 15 kids in one village got fever in a week, no one connected the dots until it was an outbreak.</p>
                            <p>RuralDiag fixes that. Symptom input, instant risk scoring, automatic doctor alerts, and district-level outbreak detection — all offline, all in their language, all free.</p>
                        </div>
                        <div className={styles.missionImage}>
                            <div className={styles.imageCard}>
                                <Image src="/logo.svg" alt="RuralDiag" width={200} height={200} />
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNum}>800M+</div>
                                <div className={styles.statLabel}>Rural Indians</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statNum}>1M+</div>
                                <div className={styles.statLabel}>ASHA Workers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.valuesSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHead}>
                        <h2>What We Stand For</h2>
                        <p>The principles that shaped every decision we made</p>
                    </div>
                    <div className={styles.valuesGrid}>
                        {values.map(({ icon: Icon, title, desc }) => (
                            <div key={title} className={styles.valueCard}>
                                <div className={styles.valueIcon}>
                                    <Icon size={28} />
                                </div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHead}>
                        <h2>Who Built This</h2>
                        <p>And why we built it the way we did</p>
                    </div>
                    <div className={styles.teamGrid}>
                        {team.map(({ name, role, desc }) => (
                            <div key={name} className={styles.teamCard}>
                                <div className={styles.teamAvatar}>
                                    <FaUsers size={32} />
                                </div>
                                <h3>{name}</h3>
                                <div className={styles.teamRole}>{role}</div>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.milestoneSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHead}>
                        <h2>Where This Goes</h2>
                        <p>From hackathon to national health infrastructure</p>
                    </div>
                    <div className={styles.timeline}>
                        {milestones.map(({ year, title, desc }) => (
                            <div key={year} className={styles.timelineItem}>
                                <div className={styles.timelineYear}>{year}</div>
                                <div className={styles.timelineCard}>
                                    <h3>{title}</h3>
                                    <p>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <FaAward className={styles.ctaIcon} />
                    <h2>This Is Bigger Than a Hackathon</h2>
                    <p>The infrastructure exists. The workers exist. The need is undeniable. RuralDiag is the missing piece.</p>
                    <div className={styles.ctaBtns}>
                        <Link href="/getstarted" className={styles.ctaPrimary}>
                            Get Started Today
                        </Link>
                        <Link href="/" className={styles.ctaSecondary}>
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
