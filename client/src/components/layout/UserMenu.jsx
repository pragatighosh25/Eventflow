import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

export default function UserMenu() {
  const { user, logout, isOrganizer } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 text-left shadow-sm transition hover:border-brand-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500/25"
        aria-haspopup="true"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
        <ChevronDown
          size={16}
          className="shrink-0 text-slate-400 transition group-hover:rotate-180 group-hover:text-brand-500"
        />
      </button>

      <div
        className="invisible absolute right-0 top-full z-50 w-56 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
        role="menu"
      >
        <div className="origin-top-right scale-95 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-elevated ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-100 group-focus-within:scale-100">
          <div className="border-b border-slate-100 px-4 py-3 sm:hidden">
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            <Badge variant={isOrganizer ? 'organizer' : 'attendee'} className="mt-2">
              {isOrganizer ? 'Organizer' : 'Attendee'}
            </Badge>
          </div>

          <div className="hidden border-b border-slate-100 px-4 py-3 sm:block">
            <Badge variant={isOrganizer ? 'organizer' : 'attendee'}>
              {isOrganizer ? 'Organizer' : 'Attendee'}
            </Badge>
          </div>

          <Link
            to="/settings"
            role="menuitem"
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
          >
            <Settings size={18} className="text-slate-400 hover:text-brand-700" />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
