'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Calendar, Activity, Users, AlertTriangle, CheckCircle2 } from 'lucide-react'
import styles from './profile.module.css'

export default function Profile() {
    const user = {
        name: 'Sunita Devi', role: 'ASHA Worker', email: 'sunita@example.com',
        phone: '+91 98765 43210', village: 'Rampur', district: 'Sultanpur',
        state: 'Uttar Pradesh', joinDate: 'January 2023',
        stats: { totalPatients: 456, thisMonth: 42, criticalCases: 5, resolved: 412 }
    }

    const statCards = [
        { label: 'Total Patients', value: user.stats.totalPatients, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
        { label: 'This Month', value: user.stats.thisMonth, icon: Calendar, color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Critical Cases', value: user.stats.criticalCases, icon: AlertTriangle, color: '#f43f5e', bg: '#fff1f2' },
        { label: 'Resolved', value: user.stats.resolved, icon: CheckCircle2, color: '#22c55e', bg: '#f0fdf4' },
    ]

    const activity = [
        { icon: '🏥', title: 'New patient visit', desc: 'Added Ramesh Kumar to patient records', time: '2 hours ago' },
        { icon: '⚠️', title: 'Critical case alert', desc: 'Escalated case to PHC doctor', time: '5 hours ago' },
        { icon: '✅', title: 'Follow-up completed', desc: "Marked Sunita's recovery as complete", time: 'Yesterday' },
    ]

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Link href="/dashboard" className={styles.backBtn}><ArrowLeft size={16} /> Dashboard</Link>
            </div>

            <div className={styles.content}>
                {/* Profile card */}
                <motion.div className={styles.profileCard} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={styles.cover} />
                    <div className={styles.profileBody}>
                        <div className={styles.avatarRow}>
                            <div className={styles.avatar}><User size={44} /></div>
                            <Link href="/settings" className={styles.editBtn}><Edit size={15} /> Edit Profile</Link>
                        </div>
                        <h1 className={styles.userName}>{user.name}</h1>
                        <p className={styles.userRole}>{user.role}</p>
                        <div className={styles.infoGrid}>
                            {[
                                { icon: Mail, label: 'Email', value: user.email },
                                { icon: Phone, label: 'Phone', value: user.phone },
                                { icon: MapPin, label: 'Location', value: `${user.village}, ${user.district}` },
                                { icon: Calendar, label: 'Joined', value: user.joinDate },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className={styles.infoItem}>
                                    <div className={styles.infoIcon}><Icon size={16} /></div>
                                    <div>
                                        <span className={styles.infoLabel}>{label}</span>
                                        <span className={styles.infoValue}>{value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Stats */}
                <div className={styles.statsGrid}>
                    {statCards.map(({ label, value, icon: Icon, color, bg }, i) => (
                        <motion.div key={label} className={styles.statCard} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}>
                            <div className={styles.statIcon} style={{ background: bg, color }}><Icon size={22} /></div>
                            <div className={styles.statValue}>{value}</div>
                            <div className={styles.statLabel}>{label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Activity */}
                <motion.div className={styles.activityPanel} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <div className={styles.panelHead}><h2>Recent Activity</h2></div>
                    <div className={styles.activityList}>
                        {activity.map(({ icon, title, desc, time }, i) => (
                            <div key={i} className={styles.activityItem}>
                                <div className={styles.activityIcon}>{icon}</div>
                                <div className={styles.activityContent}>
                                    <h4>{title}</h4>
                                    <p>{desc}</p>
                                    <span className={styles.activityTime}>{time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
