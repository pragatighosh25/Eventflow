# EventFlow

Full-stack event management platform — React frontend + Express/MongoDB backend.

## Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI

## Quick start

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run seed
npm run dev
```

API runs at **http://localhost:5000**

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at **http://localhost:5173** (proxies `/api` → backend)

## Demo accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Organizer | priya@example.com | demo123 |
| Attendee | alex@example.com | demo123 |

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Sign up |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user (JWT) |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/events` | List events |
| GET | `/api/events/:id` | Event detail |
| POST | `/api/events` | Create event (organizer) |
| PUT | `/api/events/:id` | Update event (organizer) |
| DELETE | `/api/events/:id` | Delete event (organizer) |
| PATCH | `/api/events/:id/finish` | Mark finished |
| POST | `/api/events/:id/register` | Register (attendee) |
| GET | `/api/events/activity` | Activity feed |
| POST | `/api/ai/event-copy` | AI description/tagline/agenda/FAQs (organizer) |
| POST | `/api/ai/registration-fields` | AI dynamic form fields (organizer) |
| GET | `/api/ai/recommendations` | Personalized recommendations (attendee) |

Send JWT as: `Authorization: Bearer <token>`

## Email on registration

Configure SMTP in `server/.env`. If omitted, confirmation emails are **logged to the console**.

If you get `self-signed certificate in certificate chain`, set:

```env
SMTP_TLS_REJECT_UNAUTHORIZED=false
```

in `server/.env` (safe for local/dev networks; keep `true` in production if possible).

## Free AI setup

Get a free API key from https://console.groq.com and set:

```env
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## Project structure

```
client/     React + Vite + Tailwind
server/     Express + MongoDB + JWT
```
