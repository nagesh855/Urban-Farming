# urbanFarming

urbanFarming is a responsive urban farming and community garden management platform built with React, Vite, and an Express API. It is designed around the product brief for a modern urban farming ecosystem and brings together growers, coordinators, buyers, and administrators in a single experience.

## Features

- Smart home dashboard for community agriculture operations
- Plot booking and garden management
- Weather-based crop planning
- Harvest tracking and resource planning
- Hyperlocal produce marketplace
- Volunteer task coordination
- Community forum and discussion space
- Admin visibility into bookings, payments, and operations
- Responsive interface for mobile, tablet, laptop, and desktop

## Tech Stack

- React.js
- Vite
- Express.js
- Node.js
- MongoDB-ready backend structure
- Responsive CSS design

## Run locally

1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env`. Set `MONGODB_URI`, the allowed frontend origin(s) in `FRONTEND_ORIGINS`, a private `AUTH_TOKEN_SECRET` of at least 32 characters, and unique `ADMIN_EMAIL` / `ADMIN_PASSWORD` values. Never commit `.env`.
3. Start the app with both frontend and API from this folder:
   npm run dev
4. Or start only the API:
   npm run server
5. Build for production:
   npm run build
6. Preview the build locally:
   npm run preview

The API connects to MongoDB before listening on port 5000. On first startup, it
stores the existing dashboard starter data as a MongoDB document if one is not
already present. Test the database-aware health endpoint at
`http://localhost:5000/api/health` and the persisted dashboard at
`http://localhost:5000/api/dashboard`. The Vite development server also proxies
these routes under `http://localhost:5173/api/`.

Registration and member sign-in use the MongoDB-backed `/api/auth/register`
and `/api/auth/login` endpoints. Passwords are salted and hashed; admin sign-in
uses the server-only `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.
Admin sessions are signed and verified by the API. Community posts, cart data,
and admin CRUD records are demo data saved in the browser, not server-backed
orders or production records. Cart checkout is explicitly a demo and does not
process a payment.

The app uses browser-history routes for `/`, `/plots`, `/marketplace`,
`/community`, `/cart`, `/admin`, `/login`, and `/register`. Vite serves the SPA
fallback for direct route visits and refreshes during development.

## Project structure

- `src/` — frontend React application
- `server/` — Express API for dashboard data
- `vite.config.js` — Vite configuration and API proxy

## Hero drone animation

The hero flies `src/assets/hero-drone-sprayer.png` across the farm background at
`src/assets/hero-field.png`. Replace the drone photo at that location to use
another drone image. CSS-generated water-mist particles travel with the drone.

## Vision

Grow Together. Share Locally. Build a Greener Community.
