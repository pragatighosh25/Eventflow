import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Check, MapPin, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventImage from '../components/events/EventImage';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { formatDateRange, getEventStatus } from '../utils/eventStatus';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAttendee } = useAuth();
  const { getEvent, isRegistered, refreshEvent, loading } = useEvents();
  const [event, setEvent] = useState(() => getEvent(id));

  useEffect(() => {
    if (!event && id) {
      refreshEvent(id).then(setEvent).catch(() => setEvent(null));
    }
  }, [id, event, refreshEvent]);

  if (loading && !event) {
    return <p className="py-16 text-center text-slate-500">Loading event…</p>;
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Event not found.</p>
        <Link to="/events" className="mt-4 inline-block text-brand-600">
          Back to events
        </Link>
      </div>
    );
  }

  const status = getEventStatus(event);
  const registered = user && isRegistered(id, user.id);
  const full = (event.registrations?.length ?? 0) >= event.capacity;

  return (
    <>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="relative h-56 sm:h-72 bg-brand-50">
          <EventImage event={event} />
          <div className="absolute left-4 top-4">
            <Badge variant={status}>{status}</Badge>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{event.title}</h1>
          <p className="mt-4 text-slate-600 leading-relaxed">{event.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="text-brand-500" size={18} />
              {formatDateRange(event.startDate, event.endDate)}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="text-brand-500" size={18} />
              {event.location}
            </p>
            <p className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="text-brand-500" size={18} />
              {event.registrations?.length ?? 0} / {event.capacity} registered
            </p>
          </div>

          {isAttendee && status !== 'past' && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-8">
              {registered ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700">
                  Registered <Check size={16} />
                </span>
              ) : full ? (
                <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600">
                  Event is full
                </span>
              ) : (
                <Link to={`/events/${id}/register`}>
                  <Button size="lg">Register for this event</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
