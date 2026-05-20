import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity as ActivityIcon, ArrowRight, ChevronDown, MapPin, Users } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import EventImage from '../components/events/EventImage';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { formatDateRange, formatDateTime, getEventStatus } from '../utils/eventStatus';

function humanizeKey(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
}

function AttendeeCard({ registration, event }) {
  const fieldMap = new Map((event?.customFields || []).map((f) => [f.id, f.label]));

  const labelFor = (key) => {
    if (fieldMap.has(key)) return fieldMap.get(key);
    if (key.startsWith('ai-')) return 'Additional detail';
    return humanizeKey(key);
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <p className="font-semibold text-slate-900">
            {registration.responses?.name || 'Attendee'}
          </p>
          <p className="text-xs text-slate-500">
            Registered {formatDateTime(registration.registeredAt)}
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {registration.responses?.email}
        </span>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(registration.responses || {})
          .filter(([key]) => key !== 'name' && key !== 'email')
          .map(([key, value]) => (
            <div key={key} className="rounded-lg bg-brand-50/50 px-3 py-2">
              <dt className="text-xs text-slate-500">{labelFor(key)}</dt>
              <dd className="text-sm font-medium text-slate-800">{value || '—'}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}

function OrganizerActivity({ groups }) {
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-6">
      {groups.map(({ event, registrations }, index) => {
        const isOpen = expanded[event.id] !== false;
        const status = getEventStatus(event);

        return (
          <section
            key={event.id}
            className="overflow-hidden rounded-2xl border-2 border-brand-100 bg-white shadow-card"
          >
            <header className="border-b border-brand-100 bg-gradient-to-r from-brand-50 to-white">
              <button
                type="button"
                onClick={() => toggle(event.id)}
                className="flex w-full items-start gap-4 p-5 text-left transition hover:bg-brand-50/60"
              >
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-brand-100 bg-brand-50">
                  <EventImage event={event} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <h2 className="text-lg font-semibold text-slate-900">{event.title}</h2>
                    <Badge variant={status}>{status}</Badge>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <MapPin size={14} className="text-brand-500" />
                    {event.location}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatDateRange(event.startDate, event.endDate)}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white">
                    <Users size={14} />
                    {registrations.length} registered
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-brand-500 transition ${isOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
            </header>

            {isOpen && (
              <div className="space-y-3 bg-slate-50/50 p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">Attendees & submitted details</p>
                  <Link
                    to={`/organizer/events/${event.id}`}
                    className="text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    Manage event
                    <ArrowRight size={14} />
                  </Link>
                </div>
                {registrations.map((reg) => (
                  <AttendeeCard key={reg.id} registration={reg} event={event} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function AttendeeActivity({ items }) {
  return (
    <div className="space-y-4 ">
      {items.map((item) => (
        <article
          key={item.id}
          className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-card"
        >
          <div className="border-b border-brand-100 bg-brand-50 px-5 py-4">
            <Link
              to={`/events/${item.event.id}`}
              className="text-lg font-semibold text-slate-900 hover:text-brand-600"
            >
              {item.event.title}
            </Link>
            <p className="mt-1 text-xs text-slate-500">
              {formatDateRange(item.event.startDate, item.event.endDate)} · Registered{' '}
              {formatDateTime(item.registeredAt)}
            </p>
            <Badge variant={getEventStatus(item.event)} className="mt-2">
              {getEventStatus(item.event)}
            </Badge>
          </div>
          <div className="p-5">
            <AttendeeCard registration={item} event={item.event} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Activity() {
  const { isOrganizer } = useAuth();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.events
      .activity()
      .then(({ activity: data }) => setActivity(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const isEmpty = !activity || (Array.isArray(activity) && activity.length === 0);

  return (
    <div className="pb-20 md:pb-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Activity</h1>
        <p className="mt-1 text-sm text-slate-500">
          {isOrganizer
            ? 'Registrations grouped by event expand each to see attendee details'
            : 'Your event registrations and submitted information'}
        </p>
      </div>

      {loading && (
        <p className="py-12 text-center text-sm text-slate-500">Loading activity…</p>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && isEmpty && (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description={
            isOrganizer
              ? 'When attendees register for your events, they will appear grouped under each event here.'
              : 'Register for an event to see your activity here.'
          }
          action={
            <Link to="/events" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              Browse events
            </Link>
          }
        />
      )}

      {!loading && !error && !isEmpty && isOrganizer && (
        <OrganizerActivity groups={activity} />
      )}

      {!loading && !error && !isEmpty && !isOrganizer && (
        <AttendeeActivity items={activity} />
      )}
    </div>
  );
}
