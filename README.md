# Crown Heights Rentals

A full-stack short-term rental marketplace for Crown Heights. Hosts submit
properties for admin approval, guests browse approved listings and request
bookings, and admins review everything from a dedicated dashboard.

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript) — server components + server actions
- **Prisma 6** ORM with **SQLite**
- Cookie-based sessions with **bcryptjs** password hashing
- Plain CSS (no UI framework), styled to the original landing-page design

## Features

- **Auth** — sign up as a *guest* or *host*, log in / log out (HTTP-only session cookie)
- **Hosts** — submit a property (goes to `PENDING`), track listing status, confirm/decline booking requests
- **Guests** — browse & search approved properties, request bookings, cancel their own bookings
- **Admins** — approve/reject pending listings, view all listings and bookings
- **Roles** — `GUEST`, `HOST`, `ADMIN` with authorization enforced inside every server action

## Getting started

```bash
npm install
cp .env.example .env        # DATABASE_URL defaults to a local SQLite file
npx prisma migrate dev      # create the database & run migrations
npm run db:seed             # load demo users + properties
npm run dev                 # http://localhost:3000
```

### Demo accounts (created by the seed)

| Role  | Email                      | Password      |
| ----- | -------------------------- | ------------- |
| Admin | admin@crownheights.com     | password123   |
| Host  | host@crownheights.com      | password123   |
| Guest | guest@crownheights.com     | password123   |

## Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the dev server                 |
| `npm run build`     | `prisma generate` + production build  |
| `npm run start`     | Start the production server          |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | `tsc --noEmit`                       |
| `npm run db:migrate`| Create/apply a dev migration         |
| `npm run db:deploy` | Apply migrations (production)         |
| `npm run db:seed`   | Seed demo data                       |
| `npm run db:reset`  | Drop, re-migrate and re-seed the DB  |

## Project structure

```
prisma/
  schema.prisma        # User / Session / Property / Booking models
  seed.ts              # demo data
src/
  app/                 # routes (landing, auth, properties, dashboards)
  components/          # Header, Footer, PropertyCard, BookingForm, StatusBadge
  lib/
    prisma.ts          # Prisma client singleton
    auth.ts            # session + password helpers
    actions/           # server actions (auth, properties, bookings)
```

## Deployment notes

The app uses SQLite, which works out of the box locally. Serverless platforms
(e.g. Vercel) have ephemeral/read-only filesystems, so for a hosted deployment
switch the Prisma datasource `provider` to `postgresql` and point `DATABASE_URL`
at a managed Postgres database, then run `npm run db:deploy`.
