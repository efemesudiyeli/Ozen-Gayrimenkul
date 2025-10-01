'use client'

import {usePathname, useSearchParams} from 'next/navigation'
import {useEffect} from 'react'

const MEASUREMENT_ID = 'G-7KQH1CGNCR'

export default function GtagPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', MEASUREMENT_ID, {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}


