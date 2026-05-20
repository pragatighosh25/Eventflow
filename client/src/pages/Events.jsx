import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarOff, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import CreateEventCta from '../components/events/CreateEventCta';
import { ConfirmModal } from '../components/ui/Modal';
import { EVENT_TABS, filterEventsByTab } from '../utils/eventStatus';

export default function Events() {
  const { user, isOrganizer } = useAuth();
  const { events, deleteEvent, markFinished } = useEvents();
  const [tab, setTab] = useState('upcoming');
  const [deleteId, setDeleteId] = useState(null);

  const visibleEvents = useMemo(() => {
    const filtered = filterEventsByTab(events, tab);
    if (isOrganizer) {
      return filtered.filter((e) => e.organizerId === user.id);
    }
    return filtered;
  }, [events, tab, isOrganizer, user?.id]);

  const handleConfirmDelete = async () => {
    if (deleteId) await deleteEvent(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Events</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isOrganizer ? 'Manage your published events' : 'Discover and register for events'}
        </p>
      </div>

      {isOrganizer && <CreateEventCta className="mb-8" />}

      <div className="mb-6 flex gap-2 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
        {EVENT_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {visibleEvents.length === 0 ? (
        <EmptyState
          icon={CalendarOff}
          title={`No ${tab} events`}
          description={
            isOrganizer
              ? tab === 'upcoming'
                ? 'Create your first event to get started.'
                : `You have no ${tab} events right now.`
              : `Check back later for ${tab} events.`
          }
          action={
            isOrganizer && tab === 'upcoming' ? (
              <Link to="/events/new">
                <Button>Create event</Button>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              showOrganizerActions={isOrganizer}
              onDelete={setDeleteId}
              onMarkFinished={markFinished}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete event?"
        message="This will permanently remove the event and all registrations."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
