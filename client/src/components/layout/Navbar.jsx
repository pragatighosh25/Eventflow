import { Link, NavLink } from 'react-router-dom';
import { Activity, CalendarDays, LayoutDashboard, List, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { navLinkClass, navLinkClassMobile } from '../../utils/nav';
import Button from '../ui/Button';
import UserMenu from './UserMenu';

export default function Navbar() {
  const { user, isOrganizer } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={user ? '/dashboard' : '/'} className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl shadow-sm shadow-orange-500/20">
  <img
    src="/logo.svg"
    alt="EventFlow logo"
    className="h-full w-full object-cover"
  />
</div>
            <span className="hidden text-lg font-semibold tracking-tight text-slate-900 sm:inline">
              Event<span className="text-brand-500">Flow</span>
            </span>
          </Link>

          {user && (
            <nav className="hidden items-center gap-1 md:flex">
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/events" end className={navLinkClass}>
                Event list
              </NavLink>
              <NavLink to="/activity" className={navLinkClass}>
                Activity
              </NavLink>
            </nav>
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                {isOrganizer && (
                  <Link to="/events/new">
                    <Button
                      size="md"
                      className="shadow-md shadow-brand-500/30 ring-2 ring-brand-400/20 md:px-5"
                    >
                      <Plus size={16} />
                      <span className="hidden sm:inline">Create event</span>
                      <span className="sm:hidden">Create</span>
                    </Button>
                  </Link>
                )}
                <UserMenu />
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="sm:px-4 sm:py-2.5 sm:text-sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="sm:px-4 sm:py-2.5 sm:text-sm">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {user && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
            <NavLink to="/dashboard" className={navLinkClassMobile}>
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
            <NavLink to="/events" end className={navLinkClassMobile}>
              <List size={20} />
              Events
            </NavLink>
            <NavLink to="/activity" className={navLinkClassMobile}>
              <Activity size={20} />
              Activity
            </NavLink>
          </div>
        </nav>
      )}
    </>
  );
}
