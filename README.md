# Unmutex

Website for Unmutex, a communication community for interview preparation: group discussions, debates, extempore, mock interviews, feedback and mentorship.

Built with React, Vite and Motion, plus a small Node server that talks to MongoDB.

## Pages

| Path | Page |
| --- | --- |
| `/` | Landing page |
| `/team` | Founders and core team |
| `/feedback` | Share a review (saved to MongoDB) |
| `/certificate` | Find and download a certificate |
| `/verify/<name>` | Certificate verification (target of the QR codes) |
| `/book` | Book a call (sent with EmailJS) |

## Setup

```bash
npm install
cp .env.example .env   # then fill in MONGODB_URI
```

## Scripts

- `npm run dev` starts the dev server, with the API, on http://localhost:5173
- `npm run build` builds the site into `dist/`
- `npm start` serves `dist/` and the API on port 3000 (set `PORT` to change it)

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `MONGODB_DB` | No | Database name (default `test`) |
| `TRUST_PROXY` | No | Set to `1` behind a reverse proxy, so rate limits use the visitor's IP |
| `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` | No | Override the EmailJS settings in `src/data.js` |

## API

- `GET /api/reviews` lists reviews
- `POST /api/Feedback` adds a review: `{ name, role, rating, feedback, avatar }`
- `POST /api/certificate` looks up a certificate: `{ name }`

## Hosting

The site needs a Node server for its API, so a static host on its own won't work. Run `npm run build` and then `npm start` on any Node 22+ host, with `MONGODB_URI` set. Allow the host's IP address in MongoDB Atlas under Network Access.
