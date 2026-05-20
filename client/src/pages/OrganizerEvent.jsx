import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import RegistrantsTable from '../components/events/RegistrantsTable';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatDateRange, getEventStatus } from '../utils/eventStatus';

export default function OrganizerEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEvent, markFinished } = useEvents();
  const event = getEvent(id);

  if (!event || event.organizerId !== user?.id) {
    return <p className="text-slate-500">Event not found.</p>;
  }

  const status = getEventStatus(event);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 md:pb-0">
      <button
        type="button"
        onClick={() => navigate('/events')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={18} />
        All events
      </button>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
            <Badge variant={status}>{status}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-500">{formatDateRange(event.startDate, event.endDate)} · {event.location}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/organizer/events/${id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil size={16} />
              Edit
            </Button>
          </Link>
          {status !== 'past' && event.status !== 'finished' && (
            <Button variant="secondary" size="sm" onClick={() => markFinished(id)}>
              Mark finished
            </Button>
          )}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <Users className="text-brand-500" size={22} />
          <h2 className="text-lg font-semibold text-slate-900">
            Registrations ({event.registrations?.length ?? 0})
          </h2>
        </div>
        <RegistrantsTable event={event} />
      </section>
    </div>
  );
}
