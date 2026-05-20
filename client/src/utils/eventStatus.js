export const EVENT_TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'past', label: 'Past' },
];

export function getEventStatus(event, now = new Date()) {
  if (event.status === 'finished') return 'past';

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

export function filterEventsByTab(events, tab) {
  return events.filter((e) => getEventStatus(e) === tab);
}

export function formatDateRange(startDate, endDate) {
  const opts = { month: 'short', day: 'numeric', year: 'numeric' };
  const start = new Date(startDate).toLocaleDateString(undefined, opts);
  const end = new Date(endDate).toLocaleDateString(undefined, opts);
  return start === end ? start : `${start} – ${end}`;
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
