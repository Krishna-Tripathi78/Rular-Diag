'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, MapPin, Download } from 'lucide-react'
import styles from './analytics.module.css'

export default function Analytics() {
    const [period, setPeriod] = useState('7d')

    const stats = [
        { label: 'Total Patients', value: 1247, icon: Users, color: '#3b82f6', bg: '#eff6ff', trend: '+12%', up: true },
        { label: 'Active Cases', value: 89, icon: Activity, color: '#f59e0b', bg: '#fffbeb', trend: '+5%', up: true },
        { label: 'Critical Cases', value: 12, icon: AlertTriangle, color: '#f43f5e', bg: '#fff1f2', trend: '-3%', up: false },
        { label: 'Resolved', value: 1146, icon: CheckCircle, color: '#22c55e', bg: '#f0fdf4', trend: '+8%', up: true },
    ]

    const diseases = [
        { name: 'Fever', cases: 234, pct: 45, up: true },
        { name: 'Cold & Cough', cases: 189, pct: 36, up: false },
        { name: 'Gastro Issues', cases: 98, pct: 19, up: true },
        { name: 'Headache', cases: 76, pct: 15, up: false },
        { name: 'Skin Conditions', cases: 54, pct: 10, up: true },
    ]

    const villages = [
        { name: 'Rampur', patients: 456, critical: 5, status: 'alert' },
        { name: 'Sultanpur', patients: 389, critical: 3, status: 'normal' },
        { name: 'Bhagwanpur', patients: 278, critical: 4, status: 'alert' },
        { name: 'Kishanpur', patients: 124, critical: 0, status: 'good' },
    ]

    const statusColor = { good: { bg: '#dcfce7', color: '#15803d' }, normal: { bg: '#fef9c3', color: '#a16207' }, alert: { bg: '#fee2e2', color: '#b91c1c' } }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard" className={styles.backBtn}><ArrowLeft size={16} /> Dashboard</Link>
                    <div>
                        <h1>Health Analytics</h1>
                        <p>District-wide health monitoring and insights</p>
                    </div>
                </div>
                <div className={styles.headerRight}>
                    <div className={styles.periodTabs}>
                        {[['7d', '7 Days'], ['30d', '30 Days'], ['3m', '3 Months']].map(([v, l]) => (
                            <button key={v} onClick={() => setPeriod(v)} className={`${styles.periodTab} ${period === v ? styles.periodActive : ''}`}>{l}</button>
                        ))}
                    </div>
                    <button className={styles.exportBtn}><Download size={16} /> Export</button>
                </div>
            </div>

            <div className={styles.content}>
                {/* Stats */}
                <div className={styles.statsGrid}>
                    {stats.map(({ label, value, icon: Icon, color, bg, trend, up }, i) => (
                        <motion.div key={label} className={styles.statCard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                            <div className={styles.statTop}>
                                <div className={styles.statIcon} style={{ background: bg, color }}><Icon size={22} /></div>
                                <span className={`${styles.trend} ${up ? styles.trendUp : styles.trendDown}`}>
                                    {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
                                </span>
                            </div>
                            <div className={styles.statValue}>{value.toLocaleString()}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </motion.div>
                    ))}
                </div>

                <div className={styles.grid2}>
                    {/* Disease distribution */}
                    <motion.div className={styles.panel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                        <div className={styles.panelHead}><h2>Top Diseases</h2></div>
                        <div className={styles.diseaseList}>
                            {diseases.map(({ name, cases, pct, up }) => (
                                <div key={name} className={styles.diseaseRow}>
                                    <div className={styles.diseaseInfo}>
                                        <span className={styles.diseaseName}>{name}</span>
                                        <span className={styles.diseaseCases}>{cases} cases</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <motion.div
                                            className={styles.progressFill}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ delay: 0.5, duration: 0.8 }}
                                        />
                                    </div>
                                    <div className={`${styles.diseaseTrend} ${up ? styles.trendUp : styles.trendDown}`}>
                                        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        <span>{pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Village status */}
                    <motion.div className={styles.panel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                        <div className={styles.panelHead}><h2>Village Health Status</h2></div>
                        <div className={styles.villageList}>
                            {villages.map(({ name, patients, critical, status }) => (
                                <div key={name} className={styles.villageRow}>
                                    <div className={styles.villageLeft}>
                                        <div className={styles.villageIcon}><MapPin size={16} /></div>
                                        <div>
                                            <div className={styles.villageName}>{name}</div>
                                            <div className={styles.villageMeta}>{patients} patients</div>
                                        </div>
                                    </div>
                                    <div className={styles.villageRight}>
                                        {critical > 0 && <span className={styles.criticalCount}>{critical} critical</span>}
                                        <span className={styles.statusBadge} style={statusColor[status]}>{status}</span>
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
