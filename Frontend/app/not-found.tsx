'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const id = setTimeout(() => {
      router.replace('/#ilanlar')
    }, 2000)
    return () => clearTimeout(id)
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center px-6 py-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">İlan Bulunamadı</h1>
        <p className="text-gray-600 mb-6">Aradığınız ilan yayından kaldırılmış olabilir. 2 saniye içinde güncel ilanlara yönlendirileceksiniz.</p>
        <Link href="/portfoy" className="inline-block bg-blue-600 text-white px-5 py-2 font-medium hover:bg-blue-700 transition-colors">Güncel İlanlara Git</Link>
      </div>
    </main>
  )
}


