'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Eye, EyeOff, Brain, Smartphone, Globe } from 'lucide-react'
import styles from './login.module.css'

export default function Login() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '', userType: 'asha' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        localStorage.setItem('user', JSON.stringify({ email: form.email, userType: form.userType, name: form.email.split('@')[0] }))
        router.push('/dashboard')
    }

    return (
        <div className={styles.root}>
            {/* Left panel */}
            <div className={styles.left}>
                <div className={styles.leftOrb1} />
                <div className={styles.leftOrb2} />
                <div className={styles.leftContent}>
                    <div className={styles.leftBrand}>
                        <div className={styles.leftLogo}>
                            <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                        <div>
                            <div className={styles.leftBrandName}>RuralDiag</div>
                            <div className={styles.leftBrandSub}>AI Healthcare Platform</div>
                        </div>
                    </div>
                    <h2 className={styles.leftTitle}>Empowering ASHA Workers with AI</h2>
                    <p className={styles.leftDesc}>Join thousands of frontline health workers using AI-powered diagnostics to save lives in rural India.</p>
                    <div className={styles.leftFeatures}>
                        {[
                            { icon: Brain, label: 'AI Diagnosis', sub: 'Powered by AWS Bedrock' },
                            { icon: Smartphone, label: 'Offline First', sub: 'Works without internet' },
                            { icon: Globe, label: '5+ Languages', sub: 'Multilingual support' },
                        ].map(({ icon: Icon, label, sub }) => (
                            <div key={label} className={styles.leftFeature}>
                                <div className={styles.leftFeatureIcon}><Icon size={20} /></div>
                                <div>
                                    <div className={styles.leftFeatureLabel}>{label}</div>
                                    <div className={styles.leftFeatureSub}>{sub}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className={styles.right}>
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.cardHeader}>
                        <h1>Welcome back</h1>
                        <p>Login to continue to RuralDiag</p>
                    </div>

                    <form onSubmit={handleLogin} className={styles.form}>
                        <div className={styles.field}>
                            <label>User Type</label>
                            <select value={form.userType} onChange={e => setForm({ ...form, userType: e.target.value })}>
                                <option value="asha">ASHA Worker</option>
                                <option value="doctor">PHC Doctor</option>
                                <option value="admin">District Admin</option>
                            </select>
                        </div>

                        <div className={styles.field}>
                            <label>Email Address</label>
                            <div className={styles.inputWrap}>
                                <Mail size={16} className={styles.inputIcon} />
                                <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label>Password</label>
                            <div className={styles.inputWrap}>
                                <Lock size={16} className={styles.inputIcon} />
                                <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                <button type="button" className={styles.eyeBtn} onClick={() => setShowPw(!showPw)}>
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.row}>
                            <label className={styles.checkLabel}>
                                <input type="checkbox" /> <span>Remember me</span>
                            </label>
                            <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
                        </div>

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? <span className={styles.spinner} /> : <>Login <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p className={styles.switchText}>Don't have an account? <Link href="/signup">Sign up</Link></p>
                </motion.div>
            </div>
        </div>
    )
}
