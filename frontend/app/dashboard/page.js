'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    LayoutDashboard, Users, PlusCircle, BarChart3, Settings,
    LogOut, Bell, Search, TrendingUp, AlertTriangle, CheckCircle, Calendar,
    ChevronRight, Activity, User
} from 'lucide-react'
import styles from './dashboard.module.css'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: Users, label: 'Patients', href: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Dashboard() {
    const router = useRouter()
    const [worker, setWorker] = useState(null)
    const [patients, setPatients] = useState([])

    useEffect(() => {
        const w = localStorage.getItem('worker') || localStorage.getItem('user')
        if (!w) { router.push('/'); return }
        setWorker(JSON.parse(w))
        const p = localStorage.getItem('patients')
        if (p) setPatients(JSON.parse(p))
    }, [router])

    if (!worker) return null

    const high = patients.filter(p => p.severity === 'high').length
    const medium = patients.filter(p => p.severity === 'medium').length

    const statCards = [
        { label: 'Total Patients', value: patients.length, icon: Users, color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)', trend: '+12%' },
        { label: 'Critical Cases', value: high, icon: AlertTriangle, color: '#fb7185', bg: 'rgba(251,113,133,0.12)', trend: high > 0 ? 'Needs attention' : 'All clear' },
        { label: 'Medium Risk', value: medium, icon: Activity, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', trend: 'Monitor' },
        { label: "Today's Date", value: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), icon: Calendar, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)', trend: new Date().toLocaleDateString('en-IN', { weekday: 'long' }) },
    ]

    return (
        <div className={styles.root}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                    <div className={styles.sidebarLogo}>
                        <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div>
                        <div className={styles.sidebarBrandName}>RuralDiag</div>
                        <div className={styles.sidebarBrandSub}>Health Platform</div>
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {navItems.map(({ icon: Icon, label, href, active }) => (
                        <Link key={label} href={href} className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}>
                            <Icon size={18} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.workerCard}>
                        <div className={styles.workerAvatar}>{(worker.workerName || worker.name || 'U')[0].toUpperCase()}</div>
                        <div>
                            <div className={styles.workerName}>{worker.workerName || worker.name}</div>
                            <div className={styles.workerVillage}>{worker.village || 'ASHA Worker'}</div>
                        </div>
                    </div>
                    <button className={styles.logoutBtn} onClick={() => { localStorage.clear(); router.push('/') }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className={styles.main}>
                {/* Topbar */}
                <div className={styles.topbar}>
                    <div>
                        <h1 className={styles.pageTitle}>नमस्ते, {worker.workerName || worker.name} 👋</h1>
                        <p className={styles.pageSubtitle}>{worker.village ? `${worker.village} गांव` : 'Welcome back'} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className={styles.topbarActions}>
                        <button className={styles.iconBtn}><Bell size={18} /></button>
                        <button onClick={() => router.push('/visit')} className={styles.newVisitBtn}>
                            <PlusCircle size={18} /> New Patient
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Stat cards */}
                    <div className={styles.statsGrid}>
                        {statCards.map(({ label, value, icon: Icon, color, bg, trend }, i) => (
                            <motion.div
                                key={label}
                                className={styles.statCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <div className={styles.statCardTop}>
                                    <div className={styles.statIconBox} style={{ background: bg, color }}><Icon size={22} /></div>
                                    <span className={styles.statTrend}>{trend}</span>
                                </div>
                                <div className={styles.statValue}>{value}</div>
                                <div className={styles.statLabel}>{label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick action */}
                    <motion.div className={styles.quickAction} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                        <div className={styles.qaLeft}>
                            <div className={styles.qaIcon}><PlusCircle size={28} /></div>
                            <div>
                                <h3>Start a New Patient Visit</h3>
                                <p>Record symptoms, get AI diagnosis, and save patient data</p>
                            </div>
                        </div>
                        <button onClick={() => router.push('/visit')} className={styles.qaBtn}>
                            Start Visit <ChevronRight size={18} />
                        </button>
                    </motion.div>

                    {/* Recent patients */}
                    <motion.div className={styles.section} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                        <div className={styles.sectionHead}>
                            <h2>Recent Patients</h2>
                            <Link href="/analytics" className={styles.viewAll}>View Analytics <ChevronRight size={14} /></Link>
                        </div>

                        {patients.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}><Users size={40} /></div>
                                <h3>No patients yet</h3>
                                <p>Start by adding your first patient visit</p>
                                <button onClick={() => router.push('/visit')} className={styles.emptyBtn}>
                                    <PlusCircle size={16} /> Add First Patient
                                </button>
                            </div>
                        ) : (
                            <div className={styles.patientList}>
                                {patients.slice(-6).reverse().map((p, i) => (
                                    <motion.div
                                        key={i}
                                        className={styles.patientRow}
                                        initial={{ opacity: 0, x: -12 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + i * 0.06 }}
                                    >
                                        <div className={styles.patientAvatar}>{p.name?.[0]?.toUpperCase() || '?'}</div>
                                        <div className={styles.patientInfo}>
                                            <div className={styles.patientName}>{p.name}</div>
                                            <div className={styles.patientMeta}>{p.age} yrs • {p.gender === 'male' ? 'Male' : 'Female'}</div>
                                        </div>
                                        <div className={styles.patientCondition}>{p.condition || 'General checkup'}</div>
                                        <div className={`${styles.severityBadge} ${styles[p.severity]}`}>
                                            {p.severity === 'low' && <><CheckCircle size={12} /> Low</>}
                                            {p.severity === 'medium' && <><Activity size={12} /> Medium</>}
                                            {p.severity === 'high' && <><AlertTriangle size={12} /> Critical</>}
                                        </div>
                                        <div className={styles.patientDate}>{p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    )
}
