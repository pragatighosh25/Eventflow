import { Event } from '../models/Event.js';
import { AppError } from '../middleware/errorHandler.js';
import { formatEvent } from '../utils/formatEvent.js';
import { getEventStatus } from '../utils/eventStatus.js';
import {
  generateEventCopy,
  generateRegistrationFields,
  generateRecommendations,
} from '../services/ai.service.js';

export async function postEventCopy(req, res, next) {
  try {
    const { title, category, audience } = req.body;
    const copy = await generateEventCopy({ title, category, audience });
    res.json({ success: true, copy });
  } catch (err) {
    next(err);
  }
}

export async function postRegistrationFields(req, res, next) {
  try {
    const { prompt } = req.body;
    const result = await generateRegistrationFields({ prompt });
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getRecommendations(req, res, next) {
  try {
    if (req.user.role !== 'attendee') {
      throw new AppError('Personalized recommendations are available for attendees', 403);
    }

    const userId = req.user._id.toString();
    const registeredIds = new Set();
    const pastRegistrations = [];

    const allEvents = await Event.find({});

    for (const e of allEvents) {
      for (const r of e.registrations || []) {
        if (r.user.toString() === userId) {
          registeredIds.add(e._id.toString());
          pastRegistrations.push({
            title: e.title,
            blurb: (e.description || '').slice(0, 200),
          });
        }
      }
    }

    const candidates = [];

    for (const e of allEvents) {
      if (registeredIds.has(e._id.toString())) continue;
      const fe = formatEvent(e);
      const ts = getEventStatus(fe);
      if (ts !== 'upcoming' && ts !== 'ongoing') continue;
      if (e.organizer.toString() === userId) continue;

      const titleLower = (e.title || '').toLowerCase();
      let categoryGuess = 'general';
      if (/hack|code|dev|tech|ai|data|react|python/.test(titleLower)) categoryGuess = 'tech';
      if (/music|art|design|food|wellness|yoga/.test(titleLower)) categoryGuess = 'creative-lifestyle';

      candidates.push({
        id: e._id.toString(),
        title: e.title,
        description: (e.description || '').slice(0, 500),
        location: e.location,
        categoryGuess,
      });
    }

    const userSummary = {
      name: req.user.name,
      role: req.user.role,
      profile: req.user.profile,
      pastRegistrations: pastRegistrations.slice(0, 12),
    };

    const { recommendations } = await generateRecommendations({
      userSummary,
      candidateEvents: candidates.slice(0, 35),
    });

    const docById = new Map(allEvents.map((ev) => [ev._id.toString(), ev]));
    const enriched = recommendations
      .map((r) => {
        const doc = docById.get(r.eventId);
        if (!doc) return null;
        return {
          ...formatEvent(doc),
          recommendation: { score: r.score, reason: r.reason },
        };
      })
      .filter(Boolean);

    res.json({ success: true, recommendations: enriched });
  } catch (err) {
    next(err);
  }
}
