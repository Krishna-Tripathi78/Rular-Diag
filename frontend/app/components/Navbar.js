'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ArrowRight, Sun, Moon, Languages } from 'lucide-react'
import styles from './Navbar.module.css'
import { useApp } from '../context/AppContext'

export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const { theme, toggleTheme, lang, toggleLang, t } = useApp()

    const links = [
        { label: t.features, href: '/features' },
        { label: t.workflow, href: '/workflow' },
        { label: t.impact, href: '/impact' },
        { label: t.aboutUs, href: '/about' },
    ]

    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <div className={styles.brand} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
                    <div className={styles.logoWrap}>
                        <img src="/logo.png" alt="RuralDiag" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <span className={styles.brandName}>RuralDiag</span>
                        <span className={styles.brandSub}>AI Healthcare</span>
                    </div>
                </div>

                <div className={styles.links}>
                    {links.map(({ label, href }) => (
                        <a
                            key={href}
                            href={href}
                            className={`${styles.link} ${pathname === href ? styles.linkActive : ''}`}
                        >
                            {label}
                            {pathname === href && <span className={styles.activeDot} />}
                        </a>
                    ))}
                </div>

                <div className={styles.right}>
                    <button onClick={toggleLang} className={styles.iconBtn} title={lang === 'en' ? 'Switch to Hindi' : 'Switch to English'}>
                        <Languages size={16} />
                        <span className={styles.langLabel}>{lang === 'en' ? 'हिं' : 'EN'}</span>
                    </button>
                    <button onClick={toggleTheme} className={styles.iconBtn} title="Toggle theme">
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button onClick={() => router.push('/login')} className={styles.loginBtn}>{t.login}</button>
                    <button onClick={() => router.push('/getstarted')} className={styles.ctaBtn}>
                        {t.getStarted} <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </nav>
    )
}
