// app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// 1. Oluşturduğumuz component'leri import ediyoruz
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Özen Gayrimenkul',
  description: 'Antalya bölgesindeki en güncel gayrimenkul ilanları.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          {/* 2. Header'ı buraya ekliyoruz */}
          <Header />

          {/* children, o anki sayfanın içeriğini temsil eder. Ona dokunmuyoruz. */}
          <main className="flex-grow">{children}</main>

          {/* 3. Footer'ı buraya ekliyoruz */}
          <Footer />
        </div>
      </body>
    </html>
  )
}