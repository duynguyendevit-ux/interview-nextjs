import type { Metadata } from 'next'
import { Inter, Space_Grotesk, Manrope } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import AuthProvider from '@/components/AuthProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Interview Prep - Full Stack Java Engineer @ mesoneer',
  description: 'Comprehensive interview preparation: Spring Boot, Oracle, AWS, Angular, Kafka, Java 21. 70+ curated questions with detailed answers.',
  keywords: 'Spring Boot interview, Oracle database, AWS cloud, Angular, Kafka, Java 21, microservices, full stack engineer, mesoneer',
  openGraph: {
    title: 'Interview Prep - Full Stack Java Engineer',
    description: '70+ interview questions: Spring Boot, Oracle, AWS, Angular, Kafka, Java 21',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${inter.variable} ${spaceGrotesk.variable} ${manrope.variable}`}>
      <body className="font-manrope">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
