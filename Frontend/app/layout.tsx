import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Script from 'next/script'
import GtagPageView from '@/components/GtagPageView'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hatice Özen Gayrimenkul',
  description: 'Antalya bölgesindeki en güncel gayrimenkul ilanları.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          type="image/png"
          sizes="180x180"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7KQH1CGNCR"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7KQH1CGNCR');
          `}
        </Script>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={null}>
              <GtagPageView />
            </Suspense>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}


