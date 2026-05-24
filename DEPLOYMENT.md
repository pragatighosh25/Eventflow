# Deployment Guide (Frontend + Backend)

This project is easiest to deploy as:

- `client` on **Vercel** (or Netlify)
- `server` on **Render** (or Railway)
- MongoDB on **MongoDB Atlas**

## 1) Deploy backend (`server`) on Render

1. Push repo to GitHub.
2. In Render, create a **Web Service** from your repo.
3. Configure:
   - Root directory: `server`
   - Build command: `npm install`
   - Start command: `npm start`
4. Set environment variables:
   - `PORT=5000` (or leave default)
   - `MONGODB_URI=<your atlas uri>`
   - `JWT_SECRET=<long random secret>`
   - `CLIENT_URL=https://<your-frontend-domain>`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
   - `SMTP_TLS_REJECT_UNAUTHORIZED=true` (or `false` if your SMTP chain requires it)
   - `GROQ_API_KEY=<your groq key>`
   - `GROQ_MODEL=llama-3.3-70b-versatile`
5. Deploy and note backend URL, e.g. `https://eventflow-api.onrender.com`.

## 2) Deploy frontend (`client`) on Vercel

1. In Vercel, import your repo.
2. Configure:
   - Root directory: `client`
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Set env variable:
   - `VITE_API_URL=https://<your-backend-domain>/api`
4. Deploy.

## 3) Update backend CORS

Set `CLIENT_URL` in backend env to your Vercel URL.

## 4) Seed production/demo data (optional)

Run one-time seed where your backend runs:

```bash
npm run seed
```

Do this only for demo/staging; usually skip for production.

## 5) Pre-deploy checklist

- [ ] Secrets removed from committed files (`.env`, app passwords, API keys)
- [ ] `server/.env.example` contains placeholders only
- [ ] `client/.env.example` points to `/api` for local and use real URL in production env
- [ ] SMTP works (or fallback console logging accepted)
- [ ] Groq key configured (AI features)

