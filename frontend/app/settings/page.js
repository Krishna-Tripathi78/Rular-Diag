'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, User, Bell, Lock, Globe, Database, Save, Check } from 'lucide-react'
import styles from './settings.module.css'

const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'data', label: 'Data & Privacy', icon: Database },
]

export default function Settings() {
    const [active, setActive] = useState('profile')
    const [saved, setSaved] = useState(false)
    const [settings, setSettings] = useState({
        name: 'Sunita Devi', email: 'sunita@example.com', phone: '+91 98765 43210',
        village: 'Rampur', district: 'Sultanpur', language: 'hi',
        notifications: { email: true, sms: true, critical: true, daily: false },
        privacy: { shareData: true, analytics: true }
    })

    const set = (k, v) => setSettings(s => ({ ...s, [k]: v }))
    const setNot = (k, v) => setSettings(s => ({ ...s, notifications: { ...s.notifications, [k]: v } }))
    const setPriv = (k, v) => setSettings(s => ({ ...s, privacy: { ...s.privacy, [k]: v } }))

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <Link href="/dashboard" className={styles.backBtn}><ArrowLeft size={16} /> Dashboard</Link>
                    <div>
                        <h1>Settings</h1>
                        <p>Manage your account and preferences</p>
                    </div>
                </div>
                <button onClick={handleSave} className={`${styles.saveBtn} ${saved ? styles.saveBtnSaved : ''}`}>
                    {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.sidebar}>
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActive(id)} className={`${styles.tab} ${active === id ? styles.tabActive : ''}`}>
                            <Icon size={17} /> {label}
                        </button>
                    ))}
                </div>

                <div className={styles.panel}>
                    <AnimatePresence mode="wait">
                        <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }}>
                            {active === 'profile' && (
                                <div className={styles.section}>
                                    <h2>Profile Information</h2>
                                    <div className={styles.form}>
                                        <div className={styles.row}>
                                            <div className={styles.field}><label>Full Name</label><input type="text" value={settings.name} onChange={e => set('name', e.target.value)} /></div>
                                            <div className={styles.field}><label>Phone Number</label><input type="tel" value={settings.phone} onChange={e => set('phone', e.target.value)} /></div>
                                        </div>
                                        <div className={styles.field}><label>Email Address</label><input type="email" value={settings.email} onChange={e => set('email', e.target.value)} /></div>
                                        <div className={styles.row}>
                                            <div className={styles.field}><label>Village</label><input type="text" value={settings.village} onChange={e => set('village', e.target.value)} /></div>
                                            <div className={styles.field}><label>District</label><input type="text" value={settings.district} onChange={e => set('district', e.target.value)} /></div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {active === 'notifications' && (
                                <div className={styles.section}>
                                    <h2>Notification Preferences</h2>
                                    <div className={styles.toggleList}>
                                        {[
                                            { k: 'email', label: 'Email Notifications', sub: 'Receive updates via email' },
                                            { k: 'sms', label: 'SMS Alerts', sub: 'Get SMS for important updates' },
                                            { k: 'critical', label: 'Critical Case Alerts', sub: 'Immediate alerts for critical patients' },
                                            { k: 'daily', label: 'Daily Summary', sub: 'Daily report of your activities' },
                                        ].map(({ k, label, sub }) => (
                                            <div key={k} className={styles.toggleItem}>
                                                <div><h4>{label}</h4><p>{sub}</p></div>
                                                <label className={styles.switch}>
                                                    <input type="checkbox" checked={settings.notifications[k]} onChange={e => setNot(k, e.target.checked)} />
                                                    <span className={styles.slider} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {active === 'security' && (
                                <div className={styles.section}>
                                    <h2>Security Settings</h2>
                                    <div className={styles.form}>
                                        <div className={styles.field}><label>Current Password</label><input type="password" placeholder="Enter current password" /></div>
                                        <div className={styles.field}><label>New Password</label><input type="password" placeholder="Enter new password" /></div>
                                        <div className={styles.field}><label>Confirm Password</label><input type="password" placeholder="Confirm new password" /></div>
                                        <button className={styles.changeBtn}>Update Password</button>
                                    </div>
                                </div>
                            )}

                            {active === 'language' && (
                                <div className={styles.section}>
                                    <h2>Language Preferences</h2>
                                    <div className={styles.form}>
                                        <div className={styles.field}>
                                            <label>Interface Language</label>
                                            <select value={settings.language} onChange={e => set('language', e.target.value)}>
                                                <option value="hi">Hindi - हिंदी</option>
                                                <option value="te">Telugu - తెలుగు</option>
                                                <option value="bn">Bengali - বাংলা</option>
                                                <option value="ta">Tamil - தமிழ்</option>
                                                <option value="mr">Marathi - मराठी</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {active === 'data' && (
                                <div className={styles.section}>
                                    <h2>Data & Privacy</h2>
                                    <div className={styles.toggleList}>
                                        {[
                                            { k: 'shareData', label: 'Share Data for Research', sub: 'Help improve healthcare with anonymized data' },
                                            { k: 'analytics', label: 'Usage Analytics', sub: 'Help us improve the app experience' },
                                        ].map(({ k, label, sub }) => (
                                            <div key={k} className={styles.toggleItem}>
                                                <div><h4>{label}</h4><p>{sub}</p></div>
                                                <label className={styles.switch}>
                                                    <input type="checkbox" checked={settings.privacy[k]} onChange={e => setPriv(k, e.target.checked)} />
                                                    <span className={styles.slider} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.dataActions}>
                                        <button className={styles.exportDataBtn}>Export My Data</button>
                                        <button className={styles.deleteAccBtn}>Delete Account</button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
