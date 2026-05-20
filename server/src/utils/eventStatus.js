export function getEventStatus(event, now = new Date()) {
  if (event.status === 'finished') return 'past';

  const start = new Date(event.startDate);
  const end = new Date(event.endDate);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'past';
}

export function matchesTab(event, tab) {
  if (!tab) return true;
  return getEventStatus(event) === tab;
}
