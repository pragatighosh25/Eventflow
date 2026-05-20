const IMAGE_BY_KEYWORD = [
  { match: /react|tech|summit|dev/i, url: 'https://images.unsplash.com/photo-1540575467067-178a50c2df87?auto=format&fit=crop&w=800&q=80' },
  { match: /startup|pitch|business/i, url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80' },
  { match: /design|workshop|creative/i, url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80' },
  { match: /music|concert|party/i, url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80' },
];

export function getDefaultEventImage(title = 'event', id = '') {
  const found = IMAGE_BY_KEYWORD.find(({ match }) => match.test(title));
  if (found) return found.url;
  const seed = (id || title).replace(/\W/g, '').slice(0, 12) || 'eventflow';
  return `https://picsum.photos/seed/${seed}/800/450`;
}

export function resolveEventImage(event) {
  if (event?.image?.trim()) return event.image.trim();
  return getDefaultEventImage(event?.title, event?.id);
}
