import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

export default function CreateEventCta({ className = '' }) {
  const { isOrganizer } = useAuth();
  if (!isOrganizer) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-100 via-orange-50 to-amber-50 p-6 shadow-sm sm:p-8 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, orange-500 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
         
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Ready to host your next event?</h2>
          <p className="mt-2 max-w-lg text-sm text-slate-600">
            Set up your event, customize the registration form, and start collecting attendee
            details in minutes.
          </p>
        </div>
        <Link to="/events/new" className="shrink-0">
  <Button
    size="lg"
    className="group w-full border border-orange-500 bg-orange-500 !text-white shadow-md shadow-orange-200 transition-all duration-300 hover:scale-[1.03] hover:border-orange-600 hover:!bg-orange-600 hover:shadow-orange-300 sm:w-auto"
  >
    <Plus
      size={20}
      className="transition-transform duration-300 group-hover:rotate-90"
    />
    Create event
  </Button>
</Link>
      </div>
    </div>
  );
}
