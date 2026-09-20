'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

export const translations = {
    en: {
        features: 'Features', workflow: 'Workflow', impact: 'Impact', aboutUs: 'About Us',
        login: 'Login', getStarted: 'Get Started',
    },
    hi: {
        features: 'विशेषताएं', workflow: 'कार्यप्रवाह', impact: 'प्रभाव', aboutUs: 'हमारे बारे में',
        login: 'लॉगिन', getStarted: 'शुरू करें',
    },
}

export function AppProvider({ children }) {
    const [theme, setTheme] = useState('dark')
    const [lang, setLang] = useState('en')

    useEffect(() => {
        const saved = localStorage.getItem('rd-theme')
        if (saved) setTheme(saved)
        const savedLang = localStorage.getItem('rd-lang')
        if (savedLang) setLang(savedLang)
    }, [])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('rd-theme', theme)
    }, [theme])

    useEffect(() => {
        localStorage.setItem('rd-lang', lang)
    }, [lang])

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
    const toggleLang = () => setLang(l => l === 'en' ? 'hi' : 'en')
    const t = translations[lang]

    return (
        <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => useContext(AppContext)
