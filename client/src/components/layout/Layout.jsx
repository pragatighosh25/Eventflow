import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fffdf9] to-white">
      <Navbar />

      <main
        className={
          isLandingPage
            ? 'w-full'
            : 'mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8'
        }
      >
        <Outlet />
      </main>
    </div>
  );
}
