import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import RegistrationForm from '../components/events/RegistrationForm';

export default function EventRegister() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getEvent, registerForEvent, isRegistered, refreshEvent, loading } = useEvents();
  const [event, setEvent] = useState(() => getEvent(id));

  useEffect(() => {
    if (!event && id) {
      refreshEvent(id).then(setEvent).catch(() => setEvent(null));
    }
  }, [id, event, refreshEvent]);

  if (loading && !event) {
    return <p className="text-slate-500">Loading event…</p>;
  }

  if (!event) {
    return <p className="text-slate-500">Event not found.</p>;
  }

  if (isRegistered(id, user.id)) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-card max-w-6xl mx-auto">
        <p className="text-slate-600">You are already registered.</p>
        <Link to={`/events/${id}`} className="mt-4 inline-block text-brand-600">
          Back to event
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 md:pb-0">
      <Link
        to={`/events/${id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-600"
      >
        <ArrowLeft size={18} />
        Back to event
      </Link>
      <h1 className="text-2xl font-bold text-slate-900">Register for {event.title}</h1>
      <p className="mt-2 text-sm text-slate-500">Fill in your details to complete registration.</p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <RegistrationForm
          event={event}
          onSubmit={async (responses) => {
            await registerForEvent(id, user.id, responses);
          }}
        />
      </div>
    </div>
  );
}
