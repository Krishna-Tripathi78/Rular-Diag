'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaUser, FaUsers, FaHospital, FaArrowRight, FaCheck, FaChevronRight } from 'react-icons/fa'
import styles from './getstarted.module.css'

export default function GetStarted() {
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState(null)

    const roles = [
        {
            id: 'asha',
            title: 'ASHA Worker',
            subtitle: 'Grassroots Healthcare',
            description: 'Visit patients, collect symptoms, get AI-powered diagnostic suggestions',
            icon: <FaUser />,
            features: [
                'AI Diagnosis Support',
                'Offline Mode',
                'Voice Input',
                'Multilingual Interface',
                'Patient History Tracking'
            ],
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            route: '/signup?role=asha'
        },
        {
            id: 'doctor',
            title: 'PHC Doctor',
            subtitle: 'Primary Health Center',
            description: 'Monitor critical cases, receive alerts, manage referrals',
            icon: <FaHospital />,
            features: [
                'Critical Case Alerts',
                'Patient Dashboard',
                'Prescription Management',
                'Telemedicine Support',
                'Analytics & Reports'
            ],
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            route: '/signup?role=doctor'
        },
        {
            id: 'admin',
            title: 'District Admin',
            subtitle: 'Health Department',
            description: 'District-wide analytics, resource planning, outbreak monitoring',
            icon: <FaUsers />,
            features: [
                'Health Analytics Dashboard',
                'Outbreak Detection',
                'Resource Allocation',
                'Performance Metrics',
                'Policy Planning Tools'
            ],
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            route: '/signup?role=admin'
        }
    ]

    const handleRoleSelect = (role) => {
        setSelectedRole(role.id)
        setTimeout(() => {
            router.push(role.route)
        }, 300)
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <Link href="/">
                    <button className={styles.backBtn}>
                        ← Back to Home
                    </button>
                </Link>
            </div>

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Choose Your Role
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Select how you'll be using RuralDiag to transform rural healthcare
                    </p>
                </div>
            </div>

            {/* Role Cards */}
            <div className={styles.rolesSection}>
                <div className={styles.rolesGrid}>
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className={`${styles.roleCard} ${selectedRole === role.id ? styles.selected : ''}`}
                            onClick={() => handleRoleSelect(role)}
                        >
                            <div className={styles.roleHeader} style={{ background: role.gradient }}>
                                <div className={styles.roleIcon}>
                                    {role.icon}
                                </div>
                            </div>

                            <div className={styles.roleBody}>
                                <h3 className={styles.roleTitle}>{role.title}</h3>
                                <p className={styles.roleSubtitle}>{role.subtitle}</p>
                                <p className={styles.roleDescription}>{role.description}</p>

                                <div className={styles.featuresList}>
                                    {role.features.map((feature, idx) => (
                                        <div key={idx} className={styles.featureItem}>
                                            <FaCheck className={styles.checkIcon} />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className={styles.selectBtn}>
                                    Get Started <FaArrowRight />
                                </button>
                            </div>

                            {selectedRole === role.id && (
                                <div className={styles.selectedBadge}>
                                    <FaCheck /> Selected
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
                <div className={styles.infoCard}>
                    <h3>Already have an account?</h3>
                    <p>Sign in to continue where you left off</p>
                    <Link href="/login">
                        <button className={styles.loginBtn}>
                            Login <FaChevronRight />
                        </button>
                    </Link>
                </div>

                <div className={styles.infoCard}>
                    <h3>Need help choosing?</h3>
                    <p>Contact our support team for guidance</p>
                    <button className={styles.helpBtn}>
                        Get Help <FaChevronRight />
                    </button>
                </div>
            </div>

            {/* Stats Bar */}
            <div className={styles.statsBar}>
                <div className={styles.statItem}>
                    <h4>5000+</h4>
                    <p>Active ASHA Workers</p>
                </div>
                <div className={styles.statItem}>
                    <h4>800+</h4>
                    <p>Healthcare Facilities</p>
                </div>
                <div className={styles.statItem}>
                    <h4>2M+</h4>
                    <p>Patients Served</p>
                </div>
                <div className={styles.statItem}>
                    <h4>24/7</h4>
                    <p>AI Support</p>
                </div>
            </div>
        </div>
    )
}
