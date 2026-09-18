import './globals.css'
import { AppProvider } from './context/AppContext'

export const metadata = {
    title: 'RuralDiag — AI Healthcare for ASHA Workers',
    description: 'AI-powered diagnostic support for rural health workers across India',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AppProvider>{children}</AppProvider>
            </body>
        </html>
    )
}
