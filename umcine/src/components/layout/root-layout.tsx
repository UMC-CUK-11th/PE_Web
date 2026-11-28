'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Footer } from './footer'
import { Header } from './header'

export function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const showsFooter = pathname !== '/search'

  return (
    <div className="min-h-screen w-full bg-[#f6f7f9]">
      <Header />
      {children}
      {showsFooter && <Footer />}
    </div>
  )
}
