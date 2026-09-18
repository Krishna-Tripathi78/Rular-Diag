'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react'
import styles from './forgot.module.css'

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) return
        setLoading(true)
        await new Promise(r => setTimeout(r, 800))
        setLoading(false)
        setSent(true)
    }

    return (
        <div className={styles.root}>
            <div className={styles.bg} />
            <AnimatePresence mode="wait">
                {!sent ? (
                    <motion.div key="form" className={styles.card} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
                        <Link href="/login" className={styles.backBtn}><ArrowLeft size={16} /> Back to Login</Link>
                        <div className={styles.iconWrap}><Mail size={28} /></div>
                        <h1>Forgot Password?</h1>
                        <p>No worries — we'll send you reset instructions.</p>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>Email Address</label>
                                <div className={styles.inputWrap}>
                                    <Mail size={16} className={styles.inputIcon} />
                                    <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={!email || loading}>
                                {loading ? <span className={styles.spinner} /> : <>Send Reset Link <ArrowRight size={18} /></>}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div key="success" className={styles.card} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                        <div className={styles.successIcon}><CheckCircle2 size={36} /></div>
                        <h1>Check Your Email</h1>
                        <p>We've sent password reset instructions to:</p>
                        <div className={styles.emailDisplay}>{email}</div>
                        <p className={styles.note}>Didn't receive it? Check your spam folder.</p>
                        <div className={styles.actions}>
                            <button onClick={() => setSent(false)} className={styles.resendBtn}>Resend Email</button>
                            <Link href="/login" className={styles.loginBtn}>Back to Login</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
