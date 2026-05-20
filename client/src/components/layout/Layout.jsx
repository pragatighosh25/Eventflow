import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fffdf9] to-white">
      <Navbar />
      <main className="mx-auto max-w-10xl px-40 py-8 pb-24 sm:px-6 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
