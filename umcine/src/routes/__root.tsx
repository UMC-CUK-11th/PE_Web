import { createRootRoute } from '@tanstack/react-router'
import { RootLayout } from '../components/layout/root-layout'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
})
