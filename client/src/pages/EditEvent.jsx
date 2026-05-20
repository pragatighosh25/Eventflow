import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventForm from '../components/events/EventForm';
import { toDatetimeLocalValue } from '../utils/dates';
import { ArrowLeft } from 'lucide-react';

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getEvent, updateEvent, refreshEvent } = useEvents();
  const navigate = useNavigate();
  const [event, setEvent] = useState(() => getEvent(id));

  useEffect(() => {
    if (!event && id) {
      refreshEvent(id).then(setEvent).catch(() => setEvent(null));
    }
  }, [id, event, refreshEvent]);

  if (!event || event.organizerId !== user?.id) {
    return <p className="text-slate-500">Event not found.</p>;
  }

  const initial = {
    ...event,
    startDate: toDatetimeLocalValue(event.startDate),
    endDate: toDatetimeLocalValue(event.endDate),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 md:pb-0">
      <Link
  to={`/organizer/events/${id}`}
  className="group inline-flex items-center gap-1 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
>
  <ArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" />
  Back to manage
</Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Edit event</h1>
      <div className="mt-8">
        <EventForm
          initial={initial}
          submitLabel="Save changes"
          onSubmit={async (payload) => {
            await updateEvent(id, payload);
            navigate(`/organizer/events/${id}`);
          }}
        />
      </div>
    </div>
  );
}
