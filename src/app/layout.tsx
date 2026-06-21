import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CodeItUp — Cloud IDE',
  description: 'Write, run, and save code in your browser. Open-source cloud IDE supporting 8+ languages.',
  icons: {
    icon: '/febicon.png',
    apple: '/febicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-black text-white antialiased" style={{ fontFamily: 'var(--font-stack)' }}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-stack)',
              fontSize: '13px',
            }
          }}
        />
      </body>
    </html>
  )
}
