import { getEventStatus } from './eventStatus.js';

function mapResponses(responses) {
  if (!responses) return {};
  if (responses instanceof Map) {
    return Object.fromEntries(responses.entries());
  }
  return typeof responses === 'object' ? { ...responses } : {};
}

export function formatRegistration(reg, userDoc) {
  const responses = mapResponses(reg.responses);
  return {
    id: reg._id.toString(),
    userId: reg.user?._id?.toString() || reg.user?.toString(),
    registeredAt: reg.registeredAt,
    responses,
    user: userDoc
      ? { id: userDoc._id.toString(), name: userDoc.name, email: userDoc.email }
      : undefined,
  };
}

export function formatEvent(event) {
  const obj = event.toObject ? event.toObject() : event;
  const organizerId = obj.organizer?._id?.toString() || obj.organizer?.toString();

  return {
    id: obj._id.toString(),
    organizerId,
    title: obj.title,
    description: obj.description,
    location: obj.location,
    startDate: new Date(obj.startDate).toISOString(),
    endDate: new Date(obj.endDate).toISOString(),
    capacity: obj.capacity,
    status: obj.status,
    image: obj.image || '',
    customFields: obj.customFields || [],
    registrations: (obj.registrations || []).map((reg) => formatRegistration(reg)),
    timeStatus: getEventStatus(obj),
  };
}
