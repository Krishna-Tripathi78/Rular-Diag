'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, MapPin, Download } from 'lucide-react'
import { getAnalytics } from '../lib/api'
import styles from './analytics.module.css'

export default function Analytics() {
    const [period, setPeriod] = useState('7d')
    const [overview, setOverview] = useState(null)

    useEffect(() => {
        const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
        getAnalytics('overview', { days }).then(setOverview).catch(() => { })
    }, [period])

    const stats = [
        { label: 'Total Patients', value: overview?.totalPatients ?? 1247, icon: Users, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', trend: '+12%', up: true },
        { label: 'Recent Diagnoses', value: overview?.recentDiagnoses ?? 89, icon: Activity, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', trend: '+5%', up: true },
        { label: 'Critical Cases', value: overview?.criticalCases ?? 12, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', trend: '-3%', up: false },
        { label: 'Villages Covered', value: overview?.villagesCovered ?? 18, icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.12)', trend: '+8%', up: true },
    ]

    const diseases = [
        { name: 'Fever / बुखार', cases: 234, pct: 45, up: true },
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

    const statusStyles = {
        good: { background: 'rgba(34,197,94,0.15)', color: '#22c55e' },
        normal: { background: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
        alert: { background: 'rgba(239,68,68,0.15)', color: '#ef4444' }
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard" className={styles.backBtn}>
                        <ArrowLeft size={16} /> Dashboard
                    </Link>
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
                    {stats.map(({ label, value, icon: Icon, color, bg, trend, up }) => (
                        <div key={label} className={styles.statCard}>
                            <div className={styles.statTop}>
                                <div className={styles.statIcon} style={{ background: bg, color }}><Icon size={22} /></div>
                                <span className={`${styles.trend} ${up ? styles.trendUp : styles.trendDown}`}>
                                    {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {trend}
                                </span>
                            </div>
                            <div className={styles.statValue}>{(value || 0).toLocaleString()}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.grid2}>
                    {/* Disease distribution */}
                    <div className={styles.panel}>
                        <div className={styles.panelHead}><h2>Top Conditions</h2></div>
                        <div className={styles.diseaseList}>
                            {diseases.map(({ name, cases, pct, up }) => (
                                <div key={name} className={styles.diseaseRow}>
                                    <div className={styles.diseaseInfo}>
                                        <span className={styles.diseaseName}>{name}</span>
                                        <span className={styles.diseaseCases}>{cases} cases</span>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                                    </div>
                                    <div className={`${styles.diseaseTrend} ${up ? styles.trendUp : styles.trendDown}`}>
                                        {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        <span>{pct}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Village status */}
                    <div className={styles.panel}>
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
                                        <span className={styles.statusBadge} style={statusStyles[status]}>{status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
