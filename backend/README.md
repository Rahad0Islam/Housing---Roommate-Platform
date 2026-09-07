# Housing & Roommate Platform API

A production-oriented REST API for discovering rental housing, managing buildings and rooms, booking accommodation, handling owner verification, finding compatible roommates, and collecting rent and utility payments.

Built with Express 5, TypeScript, Prisma ORM 7, PostgreSQL, JWT authentication, Redis, Cloudinary, Nodemailer, Google authentication, and bKash Tokenized Checkout.

## Features

- JWT authentication with access and refresh tokens
- HTTP-only cookie authentication with Bearer-token support
- Role-based authorization for tenants, owners, and administrators
- Credential registration with email OTP verification
- Google authentication
- Password recovery and reset flows
- Building, flat, room, and amenity management
- Room availability and rental configuration
- Booking lifecycle management
- Owner application and verification workflow
- Roommate profiles and searchable roommate discovery
- Monthly rent and utility-bill management
- bKash booking and monthly-payment checkout
- Cloudinary image and document uploads
- Redis-backed OTP and payment-token storage
- Gmail SMTP transactional email delivery
- Role-scoped analytics dashboards
- Centralized error handling and async request handling
- Vercel-ready production bundle

## Technology Stack

| Layer | Technology |
| --- | --- |
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma 7 with `@prisma/adapter-pg` |
| Authentication | JSON Web Tokens, cookies, bcryptjs |
| Validation | Zod |
| Cache and OTP storage | Redis |
| File storage | Cloudinary |
| Email | Nodemailer with SMTP |
| Social authentication | Google OAuth ID-token verification |
| Payments | bKash Tokenized Checkout |
| Build | tsup |
| Formatting and linting | Biome |
| Deployment | Vercel with `@vercel/node` |

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── *.prisma
│   └── schema.prisma
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── lib/
│   ├── middleware/
│   ├── modules/
│   │   ├── amenity/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── bkashPayment/
│   │   ├── booking/
│   │   ├── building/
│   │   ├── flat/
│   │   ├── monthlypayment/
│   │   ├── owner/
│   │   ├── roommateProfile/
│   │   ├── room/
│   │   ├── user/
│   │   └── utilitybill/
│   ├── templates/
│   └── utils/
├── generated/prisma/
├── postman/
├── package.json
├── prisma7.config.ts
├── tsconfig.json
├── tsup.config.ts
└── vercel.json
```

## Roles

The API defines three roles:

- `TENANT`: searches properties, creates bookings, makes payments, and manages roommate profiles
- `OWNER`: manages properties, rooms, amenities, bills, and owner applications
- `ADMIN`: manages platform-level operations, owner verification, users, and analytics

Authentication also checks the current database record. Blocked and deleted accounts cannot access protected routes.

## API

All application routes are prefixed with `/api/v1`.

### Authentication

Base path: `/api/v1/auth`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | Public | Register a new account |
| `POST` | `/verify-email` | Public | Verify registration OTP |
| `POST` | `/login` | Public | Log in and issue tokens |
| `GET` | `/me` | Authenticated | Get the current user |
| `POST` | `/refresh-token` | Public with refresh token | Issue a new access token |
| `POST` | `/google` | Public | Authenticate with Google |
| `POST` | `/forgot-password` | Public | Request a password-reset OTP |
| `POST` | `/reset-password` | Public | Reset a password |

Access tokens are read from the `accessToken` cookie first, then from the `Authorization` header. Use `Authorization: Bearer <token>` for API clients that do not use cookies.

### Buildings

Base path: `/api/v1/buildings`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/` | `OWNER`, `ADMIN` | Create a building |
| `GET` | `/` | Public | List buildings |
| `PATCH` | `/:id` | `OWNER`, `ADMIN` | Update a building |
| `DELETE` | `/:id` | `OWNER`, `ADMIN` | Delete a building |
| `GET` | `/owner` | Authenticated | Get buildings for the current owner |
| `GET` | `/:id` | Public | Get a building by ID |

### Flats

Base path: `/api/v1/flats`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/create-flat/:buildingId` | `OWNER`, `ADMIN` | Add a flat to a building |
| `PATCH` | `/update-flat/:flatId` | `OWNER`, `ADMIN` | Update a flat |
| `DELETE` | `/delete-flat/:flatId` | `OWNER`, `ADMIN` | Delete a flat |
| `GET` | `/get-flats/:buildingId` | Authenticated | List flats in a building |
| `GET` | `/get-flat/:flatId` | Authenticated | Get a flat by ID |

### Rooms

Base path: `/api/v1/rooms`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/:flatId` | `OWNER`, `ADMIN` | Add a room to a flat |
| `PATCH` | `/:roomId` | `OWNER`, `ADMIN` | Update a room |
| `DELETE` | `/:roomId` | `OWNER`, `ADMIN` | Delete a room |
| `GET` | `/:roomId` | Public | Get a room by ID |
| `GET` | `/flat/:flatId` | Public | List rooms in a flat |

### Bookings

Base path: `/api/v1/bookings`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/` | `TENANT`, `ADMIN` | Create a booking |
| `GET` | `/` | `ADMIN`, `OWNER`, `TENANT` | List bookings using role-based scoping |
| `GET` | `/:bookingId` | `ADMIN`, `OWNER`, `TENANT` | Get a booking |
| `PATCH` | `/cancel/:bookingId` | `ADMIN`, `OWNER`, `TENANT` | Cancel a booking |
| `PATCH` | `/ongoing/:bookingId` | `ADMIN`, `OWNER` | Mark a booking as ongoing |
| `PATCH` | `/complete/:bookingId` | `ADMIN`, `OWNER`, `TENANT` | Complete a booking |

Booking statuses include `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `EXPIRED`, and `ON_GOING`.

### Payments

Base path: `/api/v1/bkash-payment`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/create-payment` | Authenticated | Start a bKash booking payment |
| `GET` | `/booking_payment/callback` | Public callback | Receive the bKash booking callback |
| `POST` | `/create-monthly-payment` | Authenticated | Start a bKash monthly-payment checkout |
| `GET` | `/monthly_payment/callback` | Public callback | Receive the monthly-payment callback |

Payment types include `BOOKING`, `MONTHLY_RENT`, `UTILITY`, and `DEPOSIT`. Payment statuses include `INITIATED`, `PENDING`, `SUCCESS`, `FAILED`, `CANCELLED`, and `REFUNDED`.

### Utility Bills and Monthly Payments

Utility bills: `/api/v1/utility-bills`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/create-utility-bill` | `OWNER` | Create a utility bill |
| `GET` | `/get-all-utility-bills` | `OWNER`, `TENANT`, `ADMIN` | List utility bills |
| `GET` | `/get-utility-bill/:id` | `OWNER`, `TENANT`, `ADMIN` | Get a utility bill |
| `GET` | `/get-utility-bill-by-flat/:flatId` | `OWNER`, `TENANT`, `ADMIN` | Get bills for a flat |

Monthly payments: `/api/v1/monthly-payments`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/create-monthly-bill` | `OWNER` | Create a monthly payment bill |
| `GET` | `/get-all-monthly-bills` | `OWNER`, `TENANT`, `ADMIN` | List monthly bills |
| `GET` | `/get-monthly-bill/:id` | `OWNER`, `TENANT`, `ADMIN` | Get a monthly bill |

### Amenities

Base path: `/api/v1/amenities`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/create-amenity` | `OWNER` | Add an amenity |
| `GET` | `/get-all-amenities/:buildingId` | Authenticated | List building amenities |
| `GET` | `/get-amenity/:id` | Authenticated | Get an amenity |
| `PATCH` | `/update-amenity/:id` | `OWNER` | Update an amenity |
| `DELETE` | `/delete-amenity/:id` | `OWNER` | Delete an amenity |

### Roommate Profiles

Base path: `/api/v1/roommate-profiles`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/` | `TENANT` | Create a roommate profile |
| `GET` | `/me` | `TENANT` | Get the current tenant's profile |
| `PATCH` | `/me` | `TENANT` | Update the current profile |
| `DELETE` | `/me` | `TENANT` | Delete the current profile |
| `GET` | `/` | Authenticated | Search roommate profiles |
| `GET` | `/:id` | Authenticated | Get a profile by ID |

### Owner Verification

Base path: `/api/v1/owners`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/apply-as-owner` | `TENANT` | Submit an owner application |
| `PATCH` | `/approve-owner-application/:id` | `ADMIN` | Approve an owner application |
| `PATCH` | `/reject-owner-application/:id` | Admin workflow | Reject an owner application |
| `GET` | `/all-owner-applications` | `ADMIN` | List owner applications |

Owner statuses are `PENDING`, `VERIFIED`, and `REJECTED`.

### User Administration

Base path: `/api/v1/userprofileimage`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/` | Authenticated | Upload a profile image |
| `DELETE` | `/delete-image` | Authenticated | Delete the current profile image |
| `PATCH` | `/block-user/:userId` | `ADMIN` | Block a user |
| `PATCH` | `/active-user/:userId` | `ADMIN` | Reactivate a blocked user |

User statuses are `ACTIVE`, `BLOCKED`, and `DELETED`.

### Analytics

Base path: `/api/v1/analytics`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/admin` | `ADMIN` | Platform-wide inventory, booking, and payment metrics |
| `GET` | `/owner` | `OWNER` | Owner-scoped property, booking, and billing metrics |
| `GET` | `/tenant` | `TENANT` | Tenant-scoped booking, payment, and roommate-profile metrics |

Analytics endpoints accept optional `from` and `to` query parameters for date filtering.

## Standard Responses

Successful responses use the following envelope:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Resource retrieved successfully",
  "data": {},
  "meta": {}
}
```

Error responses are normalized by the global error handler. Database errors are mapped where applicable, including:

| Prisma code | HTTP status | Meaning |
| --- | --- | --- |
| `P2002` | `409` | Duplicate record |
| `P2003` | `400` | Foreign-key violation |
| `P2025` | `404` | Record not found |
| `P1000` | `401` | Database authentication failure |
| `P1001` | `503` | Database unavailable |

## Data Model

The Prisma schema is split into focused files under `prisma/`:

- `User`
- `Owner`
- `Building`
- `Flat`
- `Room`
- `Booking`
- `Amenity`
- `MonthlyPay`
- `Payment`
- `UtilityBill`
- `RoommateProfile`

The models use PostgreSQL UUIDs, timestamps, relation constraints, indexes, unique constraints, and decimal fields for monetary values.

## Environment Variables

Create a `.env` file in the `backend` directory. Never commit secrets.

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/housing_roommate
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000

BCRYPT_SALT_ROUNDS=12
JWT_ACCESS_SECRET=replace-with-a-long-random-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

REDIS_NAME=default
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
EMAIL_SENDER=no-reply@example.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

GOOGLE_CLIENT_ID=your-google-client-id

BKASH_BASE_URL=https://tokenized.sandbox.bka.sh/v1.2.0-beta
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_CALLBACK_URL=http://localhost:5000/api/v1/bkash-payment/booking_payment/callback
```

Use production credentials and a public HTTPS callback URL in deployed environments.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- PostgreSQL
- Redis
- Cloudinary account for uploads
- SMTP account for email flows
- bKash merchant credentials for payment flows

### Installation

```bash
git clone <repository-url>
cd "Housing & Roommate Platform/backend"
npm install
```

Create `.env`, then generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

Start the development server:

```bash
npm run dev
```

The default health endpoint is:

```text
GET http://localhost:5000/
```

Expected response:

```text
house and roommate platform service is running
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the server with `tsx` watch mode |
| `npm run build` | Generate Prisma Client and bundle the server with tsup |
| `npm start` | Run the production bundle from `dist/server.js` |
| `npm run generate` | Generate a new module scaffold |
| `npm run format:check` | Check formatting with Biome |
| `npm run format:fix` | Format source files with Biome |
| `npm run lint:check` | Check lint rules with Biome |
| `npm run lint:fix` | Apply Biome lint fixes |
| `npm test` | Test script placeholder; automated tests are not configured yet |

## Prisma Commands

```bash
# Generate the client
npx prisma generate

# Create and apply a development migration
npx prisma migrate dev --name describe_change

# Check migration status
npx prisma migrate status

# Open Prisma Studio
npx prisma studio
```

The application startup runs the seed routine. Review `src/utils/seed.ts` before using seeded accounts in any shared or production environment.

## Deployment

The repository includes `vercel.json` configured to serve the bundled `dist/server.js` through `@vercel/node`.

Build locally before deployment:

```bash
npm run build
npm start
```

Configure every environment variable in the hosting provider before deploying. In particular, use production PostgreSQL, Redis, SMTP, Cloudinary, Google, and bKash credentials, and set `APP_URL` and `FRONTEND_URL` to the correct deployed origins.

## API Clients

A Postman collection is available at:

```text
postman/Housing_roomMate_platform.json
```

The collection currently focuses on authentication flows. Keep its base URL and auth path aligned with the application routes before using it as a complete API reference. This README documents the mounted routes from the current source code.

## Security Notes

- Keep JWT, database, Redis, SMTP, Cloudinary, Google, and bKash credentials out of source control.
- Use HTTPS in production so authentication cookies and payment callbacks are protected.
- Use strong, unique JWT secrets.
- Replace or remove development seed credentials before production deployment.
- Validate `APP_URL` and `FRONTEND_URL` carefully because CORS and payment redirects depend on them.
- Restrict administrative endpoints to trusted administrator accounts.

## License

No project license has been specified yet.
