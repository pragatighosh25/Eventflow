import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Users, Mic2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    setEmail(role === 'organizer' ? 'priya@example.com' : 'alex@example.com');
    setPassword('demo123');
  };

  return (
    <div>
      {/* Mobile heading */}
      <div className="mb-8 lg:hidden">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Log in to manage or attend events</p>
      </div>

      {/* Desktop heading */}
      <div className="mb-6 hidden lg:block">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Log in to your EventFlow account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8"
      >
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Signing in…' : 'Log in'}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400">or try a demo account</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Demo quick-fill buttons — clean, no password hint shown */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('organizer')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
          >
            <Mic2 size={14} />
            Organizer
          </button>
          <button
            type="button"
            onClick={() => fillDemo('attendee')}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-600"
          >
            <Users size={14} />
            Attendee
          </button>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{' '}
        <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
          Create one now
        </Link>
      </p>

      <p className="mt-4 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-brand-600"
        >
          <ArrowRight size={16} className="rotate-180" />
          Explore homepage
        </Link>
      </p>
    </div>
  );
}
