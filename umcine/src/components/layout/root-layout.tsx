import { Outlet, useRouterState } from '@tanstack/react-router'
import { Footer } from './footer'
import { Header } from './header'

export function RootLayout() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const showsFooter = pathname !== '/search'

  return (
    <div className="min-h-screen w-full bg-[#f6f7f9]">
      <Header />
      <Outlet />
      {showsFooter && <Footer />}
    </div>
  )
}
