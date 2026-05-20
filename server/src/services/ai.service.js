import { env } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

function assertGroq() {
  if (!env.groq.apiKey?.trim()) {
    throw new AppError(
      'AI is not configured. Add GROQ_API_KEY to your server .env.',
      503,
    );
  }
}

function parseJsonFromText(text) {
  let t = text.trim();
  const fenced = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) t = fenced[1].trim();
  const start = t.indexOf('{');
  const end = t.lastIndexOf('}');
  if (start !== -1 && end > start) t = t.slice(start, end + 1);
  return JSON.parse(t);
}

async function chatJson(systemPrompt, userPrompt) {
  assertGroq();

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.groq.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: env.groq.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 4096,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || `Groq error (${res.status})`;
    throw new AppError(msg, 502);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new AppError('Empty AI response', 502);

  try {
    return parseJsonFromText(text);
  } catch {
    throw new AppError('AI returned invalid JSON. Try again with simpler inputs.', 502);
  }
}

export async function generateEventCopy({ title, category, audience }) {
  if (!title?.trim()) throw new AppError('Event title is required');

  const system = `You are an expert event marketer. Reply with ONLY valid JSON, no markdown, matching this shape:
{
  "tagline": "short catchy line",
  "description": "2-4 engaging paragraphs about the event",
  "agenda": ["time or phase — item", "..."],
  "highlights": ["bullet", "..."],
  "faqs": [{"question":"...","answer":"..."}, ...]
}`;

  const user = `Event title: ${title.trim()}
Category: ${category?.trim() || 'general'}
Target audience: ${audience?.trim() || 'general public'}

Write compelling copy suitable for an event landing page.`;

  return chatJson(system, user);
}

const FIELD_TYPES = new Set(['text', 'email', 'number', 'tel', 'textarea', 'select']);

export async function generateRegistrationFields({ prompt }) {
  if (!prompt?.trim()) throw new AppError('Prompt is required');

  const system = `You build registration forms. Reply with ONLY valid JSON: { "fields": [ ... ] }
Each field: { "label": string, "type": one of text|email|number|tel|textarea|select, "required": boolean, "options": string[] (only if type is select) }
For "resume" or file upload, use type "text" and label like "Resume / portfolio link" — we do not support file uploads.
Keep 3–8 practical fields.`;

  const user = `Organizer request:\n${prompt.trim()}`;

  const raw = await chatJson(system, user);
  const list = Array.isArray(raw.fields) ? raw.fields : raw.list || raw;

  if (!Array.isArray(list)) {
    throw new AppError('AI did not return a fields array', 502);
  }

  const fields = list
    .map((f, i) => {
      const type = FIELD_TYPES.has(f.type) ? f.type : 'text';
      const id = `ai-${Date.now()}-${i}`;
      const label = String(f.label || 'Field').trim();
      if (!label) return null;
      const field = {
        id,
        label,
        type,
        required: Boolean(f.required),
      };
      if (type === 'select' && Array.isArray(f.options) && f.options.length) {
        field.options = f.options.map((o) => String(o).trim()).filter(Boolean);
      }
      return field;
    })
    .filter(Boolean);

  if (!fields.length) throw new AppError('AI produced no usable fields', 502);

  return { fields };
}

export async function generateRecommendations({ userSummary, candidateEvents }) {
  if (!candidateEvents?.length) {
    return { recommendations: [] };
  }

  const system = `You personalize event recommendations. Reply with ONLY valid JSON:
{ "recommendations": [ { "eventId": "mongodb id string", "score": 0-100, "reason": "1-2 sentences" }, ... ] }
Pick at most 8 events, ordered by score descending. Only use eventIds from the provided list.`;

  const user = `User profile (JSON):\n${JSON.stringify(userSummary, null, 2)}\n\n
Candidate events (JSON array of { id, title, description, location, categoryGuess }):\n${JSON.stringify(candidateEvents, null, 2)}`;

  const raw = await chatJson(system, user);
  const recs = raw.recommendations;
  if (!Array.isArray(recs)) return { recommendations: [] };

  const allowed = new Set(candidateEvents.map((e) => e.id));
  return {
    recommendations: recs
      .filter((r) => r.eventId && allowed.has(String(r.eventId)))
      .slice(0, 8)
      .map((r) => ({
        eventId: String(r.eventId),
        score: Number(r.score) || 0,
        reason: String(r.reason || '').trim(),
      })),
  };
}
