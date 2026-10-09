<div align="center">
  <img src="./docs/logo.svg" alt="RoommateFinder logo" width="110" />

  <h1>RoommateFinder</h1>

  <p>Find a place to belong.</p>

  <p>
    <a href="https://bashakhoja.vercel.app">Live application</a>
    ·
    <a href="https://housingroommatebackend.vercel.app">Live API</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-111827?logo=next.js" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-149ECA?logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/Express-5-111827?logo=express" alt="Express 5" />
    <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma" alt="Prisma 7" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  </p>
</div>

> A full-stack housing marketplace and roommate-matching platform for discovering buildings, managing rental inventory, booking rooms, processing payments, and finding compatible roommates.

The project is split into a Next.js frontend and an Express/Prisma backend. It is designed for local development and independent Vercel deployments.

## Live deployment

| Service | URL |
| --- | --- |
| Frontend application | [bashakhoja.vercel.app](https://bashakhoja.vercel.app) |
| Backend API | [housingroommatebackend.vercel.app](https://housingroommatebackend.vercel.app) |
| API base URL | [housingroommatebackend.vercel.app/api/v1](https://housingroommatebackend.vercel.app/api/v1) |

## Features

### Public experience

- Responsive landing page with featured buildings
- Building search, filtering, pagination, and detailed property pages
- Flat and room browsing
- Room availability and pricing information
- Professional light/dark theme toggle with light mode as the default
- Protected booking flow with return-to-page authentication redirects

### Authentication

- Email and password registration and login
- Account verification and password reset flows
- Google Sign-In
- Role-based access for tenants, owners, and administrators
- Demo users seeded by the backend seed script
- HTTP-only authentication cookies

### Owner and administrator tools

- Building creation and editing
- Building image replacement
- Amenity and feature management
- Flat management
- Room creation, editing, availability, pricing, and image replacement
- Owner application review
- User activation and account management
- Dashboard analytics

### Tenant experience

- Room booking and booking status management
- bKash booking and monthly payment integration
- Monthly bills and utility bills
- Roommate profile creation and editing
- Compatibility-based roommate matching
- City and building roommate search
- Roommate lifestyle information and current residence details

## Technology

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- TanStack Query
- React Hook Form
- Zod
- Biome

### Backend

- Node.js
- Express 5
- TypeScript
- Prisma 7
- PostgreSQL
- Redis
- Google OAuth verification
- Cloudinary image storage
- Nodemailer
- bKash payment gateway
- Zod validation

## Project structure

```text
.
├── backend/
│   ├── prisma/              # Prisma schema and migrations
│   ├── src/
│   │   ├── config/          # Environment-backed configuration
│   │   ├── lib/             # Prisma, Redis, mail, and OAuth clients
│   │   ├── middleware/      # Authentication, validation, and errors
│   │   ├── modules/         # Feature modules and API routes
│   │   ├── templates/       # Email templates
│   │   └── utils/           # Seed data and shared utilities
│   ├── prisma7.config.ts
│   └── package.json
├── frontend/
│   ├── public/              # Public images and static assets
│   ├── src/
│   │   ├── api/             # API clients
│   │   ├── app/             # Next.js routes and pages
│   │   ├── components/      # Reusable UI and feature components
│   │   ├── hooks/           # React Query and application hooks
│   │   ├── providers/       # Query and authentication providers
│   │   └── types/           # Frontend types
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm, Bun, or another Node.js package manager
- PostgreSQL database
- Redis instance
- Google OAuth Web application client
- Cloudinary account
- SMTP account for email features
- bKash merchant credentials for payment features

## Local setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Housing & Roommate Platform"
```

### 2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 3. Configure backend environment variables

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

PORT=8000
NODE_ENV=development

APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-different-long-random-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

REDIS_USER=default
REDIS_PASSWORD=replace-with-redis-password
REDIS_HOST=localhost
REDIS_PORT=6379

SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-smtp-password
EMAIL_SENDER=your-email@example.com

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_CALLBACK_URL=http://localhost:8000/api/v1
```

Never commit real credentials. The backend `.gitignore` excludes `.env`.

### 4. Configure frontend environment variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

The frontend and backend must use the same Google client ID.

### 5. Generate Prisma Client and apply migrations

```bash
cd backend
npx prisma generate
npx prisma migrate deploy
```

For local schema development, use Prisma Migrate Dev instead:

```bash
npx prisma migrate dev
```

### 6. Start the applications

Open two terminals.

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

The applications will be available at:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:8000>
- Backend health response: <http://localhost:8000/>

## Available scripts

### Frontend

```bash
npm run dev       # Start Next.js development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run Biome checks
npm run format    # Format frontend files
```

### Backend

```bash
npm run dev           # Start the Express development server
npm run build         # Generate Prisma Client and bundle the backend
npm run start         # Start the bundled production server
npm run lint:check    # Check backend lint rules
npm run lint:fix      # Fix backend lint issues
npm run format:check  # Check backend formatting
npm run format:fix    # Format backend files
```

## API overview

The backend API is prefixed with:

```text
/api/v1
```

Main resource groups include:

| Resource | Base path |
| --- | --- |
| Authentication | `/api/v1/auth` |
| Buildings | `/api/v1/buildings` |
| Flats | `/api/v1/flats` |
| Rooms | `/api/v1/rooms` |
| Bookings | `/api/v1/bookings` |
| Payments | `/api/v1/bkash-payment` |
| Monthly payments | `/api/v1/monthly-payments` |
| Utility bills | `/api/v1/utility-bills` |
| Amenities | `/api/v1/amenities` |
| Roommates | `/api/v1/roommate-profiles` |
| Users | `/api/v1/users` |
| Owners | `/api/v1/owners` |
| Analytics | `/api/v1/analytics` |

Protected endpoints use authentication cookies and role-based authorization.

## Google Sign-In configuration

Use a Google OAuth client of type **Web application**.

### Authorized JavaScript origins

Add the frontend origin only:

```text
http://localhost:3000
https://your-frontend.vercel.app
```

Do not add API paths or the backend URL as a JavaScript origin.

### Production environment variables

Frontend Vercel project:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app/api/v1
```

Backend Vercel project:

```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
FRONTEND_URL=https://your-frontend.vercel.app
APP_URL=https://your-frontend.vercel.app
```

The client ID must be identical in both projects. Redeploy the frontend after changing any `NEXT_PUBLIC_*` variable.

## bKash payment configuration

bKash callbacks must point to the backend deployment, not the frontend deployment.

```env
BKASH_CALLBACK_URL=https://your-backend.vercel.app/api/v1
```

The generated callback endpoints are:

```text
https://your-backend.vercel.app/api/v1/bkash-payment/booking_payment/callback
https://your-backend.vercel.app/api/v1/bkash-payment/monthly_payment/callback
```

After changing the callback URL, redeploy the backend and create a new payment. Existing payment URLs retain their original callback URL.

## Vercel deployment

Deploy the two applications as separate Vercel projects.

### Frontend project

- Root Directory: `frontend`
- Framework preset: Next.js
- Build command: `npm run build`
- Required variables: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

### Backend project

- Root Directory: `backend`
- Build command: `npm run build`
- Required variables: database, Redis, JWT, Google, Cloudinary, SMTP, bKash, `FRONTEND_URL`, and `APP_URL`
- `BKASH_CALLBACK_URL` must use the backend Vercel URL

The backend exports the Express application for Vercel and uses the normal `app.listen()` startup flow only for local development.

## Security guidelines

- Never commit `.env`, `.env.local`, credentials, private keys, or API secrets.
- Rotate credentials immediately if they are exposed.
- Use separate credentials for local, staging, and production environments.
- Use long random values for JWT secrets.
- Restrict Google OAuth origins to known frontend domains.
- Keep `FRONTEND_URL` and `APP_URL` restricted to trusted origins.
- Use sandbox bKash credentials for development.
- Do not expose backend secrets through `NEXT_PUBLIC_*` variables.

## Troubleshooting

### Google returns `origin_mismatch`

Add the exact frontend origin currently shown in the browser address bar to Google Cloud Authorized JavaScript origins. Do not add `/login`, `/dashboard`, or an API path.

### bKash callback shows a frontend error

Check that `BKASH_CALLBACK_URL` points to the backend deployment, for example:

```env
BKASH_CALLBACK_URL=https://your-backend.vercel.app/api/v1
```

### Backend times out on Vercel

Check the Vercel deployment logs and confirm:

- The backend project root is `backend`.
- All required environment variables are configured.
- The backend was redeployed after environment changes.
- The deployed root URL responds before testing payment callbacks.

### Frontend cannot reach the API

Verify that `NEXT_PUBLIC_API_BASE_URL` contains the backend API prefix:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend.vercel.app/api/v1
```

Also verify backend CORS settings and the exact frontend URL in `FRONTEND_URL` and `APP_URL`.

## License

This project is currently distributed without a declared open-source license. Add a license file before publishing it for reuse or redistribution.
