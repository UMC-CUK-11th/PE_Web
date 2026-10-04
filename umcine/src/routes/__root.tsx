import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '../components/layout/header';

export const Route = createRootRoute({
  component: () => (
    <div className='app'>
      <Header />
      <Outlet />
    </div>
  ),
  notFoundComponent: () => <main>페이지를 찾을 수 없어요.</main>,
});
