import { LoginUserContextProvider } from '@/contexts/LoginUserContext'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bobbin',
  description: 'アパレル向け製品管理アプリBobbin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginUserContextProvider>{children}</LoginUserContextProvider>
      </body>
    </html>
  )
}
