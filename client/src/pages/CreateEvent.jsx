import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventForm from '../components/events/EventForm';

export default function CreateEvent() {
  const { createEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <>
      <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Create event</h1>
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
    </>
  );
}
