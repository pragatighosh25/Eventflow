import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventForm from '../components/events/EventForm';

export default function CreateEvent() {
  const { createEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 md:pb-0">
      <h1 className="text-2xl font-bold text-slate-900">Create event</h1>
      <p className="mt-2 text-sm text-slate-500">Set details and customize the registration form.</p>
      <div className="mt-8">
        <EventForm
          submitLabel="Publish event"
          onSubmit={async (payload) => {
            const event = await createEvent(payload);
            navigate(`/organizer/events/${event.id}`);
          }}
        />
      </div>
    </div>
  );
}
