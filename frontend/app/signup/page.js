'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, MapPin, ArrowRight, Eye, EyeOff, Stethoscope, Wifi, Globe } from 'lucide-react'
import styles from './signup.module.css'

export default function Signup() {
    const router = useRouter()
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', userType: 'asha', village: '', district: '', language: 'hi' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const handleSignup = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) { alert('Passwords do not match'); return }
        if (!form.name || !form.email || !form.password) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        localStorage.setItem('user', JSON.stringify({ name: form.name, email: form.email, userType: form.userType, village: form.village }))
        router.push('/dashboard')
    }

    return (
        <div className={styles.root}>
            <div className={styles.left}>
                <div className={styles.leftOrb} />
                <div className={styles.leftOrb2} />
                <div className={styles.leftContent}>
                    <div className={styles.leftBrand}>
                        <div className={styles.leftLogo}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <span className={styles.leftBrandName}>RuralDiag</span>
                    </div>
                    <h2 className={styles.leftTitle}>Healthcare for Every Village in India</h2>
                    <p className={styles.leftDesc}>Join 1M+ ASHA workers already making faster, smarter decisions in the field.</p>
                    <div className={styles.statsRow}>
                        {[
                            { icon: <Stethoscope size={20} />, val: 'Instant Diagnosis', lbl: 'Symptom analysis in seconds, not hours' },
                            { icon: <Wifi size={20} />, val: 'Works Offline', lbl: 'No internet needed in remote villages' },
                            { icon: <Globe size={20} />, val: '5 Languages', lbl: 'Hindi, Telugu, Bengali, Tamil, Marathi' },
                        ].map(({ icon, val, lbl }) => (
                            <div key={val} className={styles.statBox}>
                                <div className={styles.statIcon}>{icon}</div>
                                <div>
                                    <div className={styles.statVal}>{val}</div>
                                    <div className={styles.statLbl}>{lbl}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.right}>
                <motion.div className={styles.card} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <div className={styles.cardHeader}>
                        <h1>Create Account</h1>
                        <p>Fill in your details to get started</p>
                    </div>

                    <form onSubmit={handleSignup} className={styles.form}>
                        <div className={styles.field}>
                            <label>I am a *</label>
                            <select value={form.userType} onChange={e => set('userType', e.target.value)}>
                                <option value="asha">ASHA Worker</option>
                                <option value="doctor">PHC Doctor</option>
                                <option value="admin">District Admin</option>
                            </select>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Full Name *</label>
                                <div className={styles.inputWrap}>
                                    <User size={15} className={styles.inputIcon} />
                                    <input type="text" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Phone</label>
                                <div className={styles.inputWrap}>
                                    <Phone size={15} className={styles.inputIcon} />
                                    <input type="tel" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Email Address *</label>
                            <div className={styles.inputWrap}>
                                <Mail size={15} className={styles.inputIcon} />
                                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Village</label>
                                <div className={styles.inputWrap}>
                                    <MapPin size={15} className={styles.inputIcon} />
                                    <input type="text" placeholder="Village name" value={form.village} onChange={e => set('village', e.target.value)} />
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>District</label>
                                <input type="text" placeholder="District name" value={form.district} onChange={e => set('district', e.target.value)} />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Preferred Language</label>
                            <select value={form.language} onChange={e => set('language', e.target.value)}>
                                <option value="hi">Hindi - हिंदी</option>
                                <option value="te">Telugu - తెలుగు</option>
                                <option value="bn">Bengali - বাংলা</option>
                                <option value="ta">Tamil - தமிழ்</option>
                                <option value="mr">Marathi - मराठी</option>
                            </select>
                        </div>

                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label>Password *</label>
                                <div className={styles.inputWrap}>
                                    <Lock size={15} className={styles.inputIcon} />
                                    <input type={showPw ? 'text' : 'password'} placeholder="Create password" value={form.password} onChange={e => set('password', e.target.value)} />
                                    <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>
                                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <div className={styles.field}>
                                <label>Confirm Password *</label>
                                <div className={styles.inputWrap}>
                                    <Lock size={15} className={styles.inputIcon} />
                                    <input type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <label className={styles.checkLabel}>
                            <input type="checkbox" required />
                            <span>I agree to the Terms of Service and Privacy Policy</span>
                        </label>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? <span className={styles.spinner} /> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p className={styles.switchText}>Already have an account? <Link href="/login">Login</Link></p>
                </motion.div>
            </div>
        </div>
    )
}
