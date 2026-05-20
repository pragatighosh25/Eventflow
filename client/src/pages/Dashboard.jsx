import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, Sparkles, TrendingUp, Users } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import Badge from '../components/ui/Badge';
import CreateEventCta from '../components/events/CreateEventCta';
import { filterEventsByTab, formatDateRange, getEventStatus } from '../utils/eventStatus';

export default function Dashboard() {
  const { user, isOrganizer } = useAuth();
  const { events } = useEvents();
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState('');

  useEffect(() => {
    if (isOrganizer) return;
    let mounted = true;
    setRecsLoading(true);
    api.ai
      .recommendations()
      .then((res) => {
        if (!mounted) return;
        setRecs(res.recommendations || []);
      })
      .catch((err) => {
        if (!mounted) return;
        setRecsError(err.message);
      })
      .finally(() => {
        if (!mounted) return;
        setRecsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOrganizer]);

  const myEvents = isOrganizer ? events.filter((e) => e.organizerId === user.id) : events;
  const upcoming = filterEventsByTab(myEvents, 'upcoming');
  const ongoing = filterEventsByTab(myEvents, 'ongoing');
  const past = filterEventsByTab(myEvents, 'past');
  const totalRegistrations = myEvents.reduce((sum, e) => sum + (e.registrations?.length ?? 0), 0);
  const myRegistrations = isOrganizer
    ? []
    : events.flatMap((e) =>
        (e.registrations || [])
          .filter((r) => r.userId === user.id)
          .map((r) => ({ ...r, event: e })),
      );

  const stats = isOrganizer
    ? [
        { label: 'Upcoming Events', value: upcoming.length, icon: Calendar },
        { label: 'Ongoing Events', value: ongoing.length, icon: TrendingUp },
        { label: 'Past Events', value: past.length, icon: ClipboardList },
        { label: 'Total Registrations', value: totalRegistrations, icon: Users },
      ]
    : [
        { label: 'Upcoming Event', value: upcoming.length, icon: Calendar },
        { label: 'Ongoing Event', value: ongoing.length, icon: TrendingUp },
        { label: 'My registrations', value: myRegistrations.length, icon: Users },
        { label: 'Past attended', value: past.length, icon: ClipboardList },
      ];

  const highlightEvents = [...ongoing, ...upcoming].slice(0, 3);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 xl:px-14">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isOrganizer
              ? 'Overview of your events and registrations'
              : 'Your events and registration activity at a glance'}
          </p>
        </div>

        {isOrganizer && <CreateEventCta className="mb-8" />}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-bold leading-none text-brand-600">{value}</p>
                  <p className="mt-2 text-sm font-medium text-slate-500">{label}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {isOrganizer ? 'Live & upcoming' : 'Happening soon'}
              </h2>
              <Link to="/events" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                View all
              </Link>
            </div>
            {highlightEvents.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">No upcoming or ongoing events.</p>
            ) : (
              <ul className="space-y-3">
                {highlightEvents.map((event) => (
                  <li key={event.id}>
                    <Link
                      to={isOrganizer ? `/organizer/events/${event.id}` : `/events/${event.id}`}
                      className="flex items-center justify-between rounded-xl border border-slate-100 p-3 transition hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <div>
                        <p className="font-medium text-slate-800">{event.title}</p>
                        <p className="text-xs text-slate-500">{formatDateRange(event.startDate, event.endDate)}</p>
                      </div>
                      <Badge variant={getEventStatus(event)}>{getEventStatus(event)}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
              <Link to="/activity" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Activity
              </Link>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/events"
                  className="flex rounded-xl px-3 py-2.5 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  Browse event list
                </Link>
              </li>
              <li>
                <Link
                  to="/activity"
                  className="flex rounded-xl px-3 py-2.5 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  {isOrganizer ? 'View all registrations & attendees' : 'View my registration history'}
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex rounded-xl px-3 py-2.5 text-slate-700 hover:bg-brand-50 hover:text-brand-700"
                >
                  Update profile for autofill
                </Link>
              </li>
            </ul>
          </section>
        </div>

        {!isOrganizer && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                <Sparkles size={18} className="text-brand-600" />
                Recommended for you
              </h2>
              <Link to="/events" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Explore events
              </Link>
            </div>

            {recsLoading && <p className="text-sm text-slate-500">Getting personalized recommendations…</p>}
            {!recsLoading && recsError && <p className="text-sm text-red-600">{recsError}</p>}
            {!recsLoading && !recsError && recs.length === 0 && (
              <p className="text-sm text-slate-500">
                No recommendations yet. Register for more events and update interests in settings.
              </p>
            )}
            {!recsLoading && !recsError && recs.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {recs.slice(0, 4).map((event) => (
                  <li key={event.id}>
                    <Link
                      to={`/events/${event.id}`}
                      className="block rounded-xl border border-slate-100 p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p className="font-medium text-slate-800">{event.title}</p>
                        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-semibold text-brand-700">
                          {Math.round(event.recommendation?.score || 0)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {event.recommendation?.reason || 'Good fit based on your profile and past activity.'}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
