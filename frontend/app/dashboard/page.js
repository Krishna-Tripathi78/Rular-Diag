'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
    LayoutDashboard, Users, PlusCircle, BarChart3, Settings,
    LogOut, Bell, AlertTriangle, CheckCircle, Calendar,
    ChevronRight, Activity, User
} from 'lucide-react'
import styles from './dashboard.module.css'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
]

export default function Dashboard() {
    const router = useRouter()
    const [worker, setWorker] = useState(null)
    const [patients, setPatients] = useState([])
    const [pendingSync, setPendingSync] = useState(0)

    useEffect(() => {
        const w = localStorage.getItem('worker') || localStorage.getItem('user')
        if (!w) { router.push('/'); return }
        setWorker(JSON.parse(w))
        const p = localStorage.getItem('patients')
        if (p) setPatients(JSON.parse(p))

        const offline = JSON.parse(localStorage.getItem('ruraldiag_pending') || '[]')
        setPendingSync(offline.length)
    }, [router])

    if (!worker) return null

    const critical = patients.filter(p => p.diagnosis?.urgency === 'critical' || p.severity === 'high').length
    const medium = patients.filter(p => p.diagnosis?.urgency === 'high' || p.severity === 'medium').length

    const statCards = [
        { label: 'Total Patients', value: patients.length, icon: Users, color: '#2dd4bf', bg: 'rgba(20,184,166,0.12)' },
        { label: 'Critical Cases', value: critical, icon: AlertTriangle, color: '#f87171', bg: 'rgba(239,68,68,0.12)' },
        { label: 'Medium Risk', value: medium, icon: Activity, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
        { label: 'Pending Sync', value: pendingSync, icon: Calendar, color: '#60a5fa', bg: 'rgba(59,130,246,0.12)' },
    ]

    return (
        <div className={styles.root}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarBrand}>
                    <div className={styles.sidebarLogo}>
                        <Image src="/logo.svg" alt="RuralDiag" width={32} height={32} />
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
                        <div className={styles.workerAvatar}>
                            {(worker.workerName || worker.name || 'U')[0].toUpperCase()}
                        </div>
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
                        <h1 className={styles.pageTitle}>
                            नमस्ते, {worker.workerName || worker.name} 👋
                        </h1>
                        <p className={styles.pageSubtitle}>
                            {worker.village ? `${worker.village} गांव` : 'Welcome back'} — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className={styles.topbarActions}>
                        {pendingSync > 0 && (
                            <div className={styles.syncBadge}>{pendingSync} offline</div>
                        )}
                        <button className={styles.iconBtn}><Bell size={18} /></button>
                        <button onClick={() => router.push('/visit')} className={styles.newVisitBtn}>
                            <PlusCircle size={18} /> New Patient
                        </button>
                    </div>
                </div>

                <div className={styles.content}>
                    {/* Stats */}
                    <div className={styles.statsGrid}>
                        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
                            <div key={label} className={styles.statCard}>
                                <div className={styles.statCardTop}>
                                    <div className={styles.statIconBox} style={{ background: bg, color }}>
                                        <Icon size={22} />
                                    </div>
                                </div>
                                <div className={styles.statValue}>{value}</div>
                                <div className={styles.statLabel}>{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Quick action */}
                    <div className={styles.quickAction}>
                        <div className={styles.qaLeft}>
                            <div className={styles.qaIcon}><PlusCircle size={28} /></div>
                            <div>
                                <h3>Start a New Patient Visit</h3>
                                <p>Record symptoms, get AI diagnosis, save patient data offline or online</p>
                            </div>
                        </div>
                        <button onClick={() => router.push('/visit')} className={styles.qaBtn}>
                            Start Visit <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Recent patients */}
                    <div className={styles.section}>
                        <div className={styles.sectionHead}>
                            <h2>Recent Patients</h2>
                            <Link href="/analytics" className={styles.viewAll}>
                                View Analytics <ChevronRight size={14} />
                            </Link>
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
                                {patients.slice(-8).reverse().map((p, i) => {
                                    const urgency = p.diagnosis?.urgency || p.severity || 'low'
                                    return (
                                        <div key={i} className={styles.patientRow}>
                                            <div className={styles.patientAvatar}>
                                                {p.name?.[0]?.toUpperCase() || '?'}
                                            </div>
                                            <div className={styles.patientInfo}>
                                                <div className={styles.patientName}>{p.name}</div>
                                                <div className={styles.patientMeta}>
                                                    {p.age} yrs • {p.gender === 'male' ? 'Male' : 'Female'}
                                                    {p.offline && ' • 📶 Offline'}
                                                </div>
                                            </div>
                                            <div className={styles.patientCondition}>
                                                {(p.diagnosis?.primaryConditions?.[0] || p.condition || 'General checkup').slice(0, 30)}
                                            </div>
                                            <div className={`${styles.severityBadge} ${styles[urgency]}`}>
                                                {urgency === 'low' && <><CheckCircle size={12} /> Low</>}
                                                {urgency === 'medium' && <><Activity size={12} /> Medium</>}
                                                {(urgency === 'high' || urgency === 'critical') && <><AlertTriangle size={12} /> {urgency === 'critical' ? 'Critical' : 'High'}</>}
                                            </div>
                                            <div className={styles.patientDate}>
                                                {p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
