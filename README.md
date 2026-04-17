# JUICEeSTATION — Premium Juice Brand Website

A production-ready, animated web app for **JUICEeSTATION** (Bracknell, Berkshire, UK).
Pure & organic juices — no water, no sugar, no additives.

---

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + React Router
- **Backend:** Node.js + Express
- **Database:** Supabase (Postgres)
- **Payments:** Stripe-ready (mock checkout included)

---

## Folder Structure

```
juicestation/
├── client/                    # React frontend (Vite)
│   ├── public/
│   │   ├── logo.png           # Brand logo (navbar, footer, favicon)
│   │   └── hero.mp4           # Scroll-driven hero video
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ScrollVideo.jsx
│   │   │   ├── JuiceCard.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── CartDrawer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Builder.jsx
│   │   │   ├── Checkout.jsx
│   │   │   └── OrderSuccess.jsx
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── hooks/
│   │   │   └── useScrollVideo.js
│   │   ├── data/
│   │   │   └── menu.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── server/                    # Express API
│   ├── index.js
│   ├── routes/
│   │   ├── menu.js
│   │   └── orders.js
│   ├── lib/
│   │   └── supabase.js
│   ├── .env.example
│   └── package.json
├── supabase/
│   └── schema.sql             # Database schema
└── README.md
```

---

## Installation

### 1. Clone & install

```bash
git clone <your-repo>
cd juicestation

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Environment variables

**`client/.env`** (copy from `.env.example`)
```
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**`server/.env`**
```
PORT=4000
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
CLIENT_ORIGIN=http://localhost:5173
```

### 3. Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste contents of `supabase/schema.sql` → Run
3. Copy the project URL, anon key, and service role key into your `.env` files

### 4. Run locally

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:4000

---

## Deployment

### Frontend → Vercel

```bash
cd client
npm run build
# Push to GitHub, import into Vercel, set env vars
```

Vercel env vars: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Backend → Railway / Render / Fly.io

```bash
cd server
# Push to GitHub, connect to Railway, set env vars
# Start command: node index.js
```

### Database → Supabase (managed)

Already live once you ran the schema. Point both apps at it.

---

## Notes

- **Video scrubbing**: Implemented via `currentTime` on the video element tied to scroll progress. Works smoothly on desktop Chrome/Edge/Safari. For true Apple-style frame-by-frame on mobile, pre-process the MP4 into a JPEG sequence (~120 frames) and swap images in `<canvas>` instead — see `useScrollVideo.js` comments.
- **Logo**: Used in navbar, footer, and as favicon. Currently referenced from `/public/logo.png`.
- **Stripe**: Checkout page is structured to accept a Stripe integration — see comment in `Checkout.jsx`. Currently places a mock order and saves to Supabase.
- **Dark mode**: Auto-detects system preference, persists to `localStorage`.
