import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

import Badge from '../ui/Badge';
import EventImage from './EventImage';
import { ConfirmModal } from '../ui/Modal';
import { formatDateRange, getEventStatus } from '../../utils/eventStatus';

export default function EventCard({
  event,
  showOrganizerActions,
  onDelete,
  onMarkFinished,
}) {
  const status = getEventStatus(event);
  const spotsLeft =
    event.capacity - (event.registrations?.length ?? 0);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);

  return (
    <>
      <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card transition hover:border-brand-200 hover:shadow-elevated">
        <div className="relative h-40 overflow-hidden bg-brand-50">
          <EventImage
            event={event}
            imgClassName="transition duration-300 group-hover:scale-105"
          />

          <div className="absolute right-3 top-3">
            <Badge variant={status}>{status}</Badge>
          </div>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
            {event.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm text-slate-500">
            {event.description}
          </p>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <Calendar
                size={16}
                className="shrink-0 text-brand-500"
              />
              {formatDateRange(
                event.startDate,
                event.endDate
              )}
            </p>

            <p className="flex items-center gap-2">
              <MapPin
                size={16}
                className="shrink-0 text-brand-500"
              />
              {event.location}
            </p>

            <p className="flex items-center gap-2">
              <Users
                size={16}
                className="shrink-0 text-brand-500"
              />
              {event.registrations?.length ?? 0} registered ·{' '}
              {spotsLeft} spots left
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              to={
                showOrganizerActions
                  ? `/organizer/events/${event.id}`
                  : `/events/${event.id}`
              }
              className="rounded-xl bg-brand-500 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-brand-600 sm:flex-1"
            >
              {showOrganizerActions
                ? 'Manage'
                : 'View details'}
            </Link>

            {showOrganizerActions && (
              <div className="flex gap-2">
                {status !== 'past' && (
                  <button
                    type="button"
                    onClick={() => setConfirmFinish(true)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                  >
                    Finish
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-red-200 text-red-600 transition hover:bg-red-50"
                  aria-label="Delete event"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      <ConfirmModal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => {
          onDelete?.(event.id);
          setConfirmDelete(false);
        }}
        title="Delete event?"
        message="This action cannot be undone. The event and registrations will be permanently removed."
        confirmLabel="Delete"
        danger
      />

      <ConfirmModal
        open={confirmFinish}
        onClose={() => setConfirmFinish(false)}
        onConfirm={() => {
          onMarkFinished?.(event.id);
          setConfirmFinish(false);
        }}
        title="Mark event as finished?"
        message="This event will move to past events."
        confirmLabel="Mark finished"
      />
    </>
  );
}