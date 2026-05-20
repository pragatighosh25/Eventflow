import { Event } from '../models/Event.js';
import { AppError } from '../middleware/errorHandler.js';
import { formatEvent } from '../utils/formatEvent.js';
import { matchesTab } from '../utils/eventStatus.js';
import { sendRegistrationConfirmation } from '../services/email.service.js';

export async function listEvents(req, res, next) {
  try {
    const { tab } = req.query;
    const user = req.user;

    let query = {};
    if (user.role === 'organizer') {
      query.organizer = user._id;
    }

    const events = await Event.find(query).sort({ startDate: 1 });
    let formatted = events.map(formatEvent);

    if (tab) {
      formatted = formatted.filter((e) => matchesTab(e, tab));
    }

    res.json({ success: true, events: formatted });
  } catch (err) {
    next(err);
  }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new AppError('Event not found', 404);

    res.json({ success: true, event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
}

export async function createEvent(req, res, next) {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      capacity,
      image,
      customFields,
    } = req.body;

    if (!title?.trim() || !location?.trim() || !startDate || !endDate) {
      throw new AppError('Title, location, start and end dates are required');
    }

    if (new Date(endDate) < new Date(startDate)) {
      throw new AppError('End date must be after start date');
    }

    const event = await Event.create({
      organizer: req.user._id,
      title: title.trim(),
      description: description || '',
      location: location.trim(),
      startDate,
      endDate,
      capacity: Number(capacity) || 50,
      image: image || '',
      customFields: customFields || [],
      status: 'active',
      registrations: [],
    });

    res.status(201).json({ success: true, event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new AppError('Event not found', 404);

    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to edit this event', 403);
    }

    const fields = [
      'title',
      'description',
      'location',
      'startDate',
      'endDate',
      'capacity',
      'image',
      'customFields',
    ];

    fields.forEach((key) => {
      if (req.body[key] !== undefined) {
        event[key] = req.body[key];
      }
    });

    if (event.endDate < event.startDate) {
      throw new AppError('End date must be after start date');
    }

    await event.save();

    res.json({ success: true, event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new AppError('Event not found', 404);

    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized to delete this event', 403);
    }

    await event.deleteOne();

    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
}

export async function markEventFinished(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new AppError('Event not found', 404);

    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new AppError('Not authorized', 403);
    }

    event.status = 'finished';
    await event.save();

    res.json({ success: true, event: formatEvent(event) });
  } catch (err) {
    next(err);
  }
}

export async function registerForEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new AppError('Event not found', 404);

    if (event.status === 'finished') {
      throw new AppError('This event has ended');
    }

    if (event.registrations.length >= event.capacity) {
      throw new AppError('Event is full');
    }

    const already = event.registrations.some(
      (r) => r.user.toString() === req.user._id.toString(),
    );
    if (already) throw new AppError('You are already registered for this event', 409);

    const responses = req.body.responses || {};
    if (!responses.name?.trim() || !responses.email?.trim()) {
      throw new AppError('Name and email are required in registration');
    }

    event.registrations.push({
      user: req.user._id,
      responses: new Map(Object.entries(responses)),
      registeredAt: new Date(),
    });

    await event.save();

    const email = responses.email;
    const eventDate = new Date(event.startDate).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    await sendRegistrationConfirmation({
      to: email,
      name: responses.name,
      eventTitle: event.title,
      eventDate,
      location: event.location,
    });

    const updated = await Event.findById(event._id);
    const registration = updated.registrations[updated.registrations.length - 1];

    res.status(201).json({
      success: true,
      registration: {
        id: registration._id.toString(),
        userId: req.user._id.toString(),
        registeredAt: registration.registeredAt,
        responses: Object.fromEntries(registration.responses.entries()),
      },
      event: formatEvent(updated),
    });
  } catch (err) {
    next(err);
  }
}

export async function getActivity(req, res, next) {
  try {
    const user = req.user;

    if (user.role === 'organizer') {
      const events = await Event.find({ organizer: user._id }).sort({ startDate: -1 });
      const groups = events
        .filter((e) => e.registrations.length > 0)
        .map((e) => ({
          event: formatEvent(e),
          registrations: e.registrations.map((reg) => ({
            id: reg._id.toString(),
            userId: reg.user.toString(),
            registeredAt: reg.registeredAt,
            responses: Object.fromEntries(reg.responses.entries()),
          })),
        }));

      return res.json({ success: true, activity: groups });
    }

    const events = await Event.find({ 'registrations.user': user._id }).sort({ startDate: -1 });
    const items = [];

    events.forEach((event) => {
      event.registrations
        .filter((r) => r.user.toString() === user._id.toString())
        .forEach((reg) => {
          items.push({
            id: reg._id.toString(),
            event: formatEvent(event),
            registeredAt: reg.registeredAt,
            responses: Object.fromEntries(reg.responses.entries()),
          });
        });
    });

    items.sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt));

    res.json({ success: true, activity: items });
  } catch (err) {
    next(err);
  }
}
