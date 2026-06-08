# ShopFlow

A full-stack e-commerce platform built as a production-like team project for the Node.js backend development course.

**Group:** Malmö 1 (Team Kattarp)  
**Members:** Mattias Eskilsson, Olivia Mach, Pontus Ingenius, Marcus William Johansson, Tomac Jansson  
**Repository:** [github.com/meskilsson/ShopFlow](https://github.com/meskilsson/ShopFlow/)

---

## Features

- User registration and login (Buyer, Seller, Admin roles)
- Product management with image upload (CRUD + soft delete)
- Shopping cart for both authenticated users and guests
- Order processing (cart → order checkout flow)
- Product reviews and ratings
- Role-Based Access Control (RBAC)
- GDPR compliance — soft delete, personal data export, data minimization
- Seller dashboard — manage own products and view orders
- Admin panel — full system oversight, restore deleted records

## Tech Stack

**Backend**
- Node.js (ES Modules) + Express 5
- TypeScript 6
- MongoDB Atlas via Mongoose 9
- Zod 4 for schema validation
- bcrypt + JWT (cookie-based) for authentication
- Pino for structured logging
- Multer + Supabase for image storage
- Jest + Supertest for testing

**Frontend**
- React 19 SPA
- React Router 7
- Vite 8 build tool
- TypeScript 5
- Framer Motion (animations)
- Zod (client-side validation)

**Infrastructure**
- MongoDB Atlas (database)
- Supabase (image storage)
- npm workspaces (monorepo)

## Prerequisites

Before running the project locally, make sure you have:

- **Node.js** 20 LTS or later
- **npm** 10 or later
- A **MongoDB Atlas** account (or a local MongoDB instance)
- A **Supabase** project with a storage bucket named `product-images` (required for image upload)

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/meskilsson/ShopFlow.git
cd ShopFlow

# 2. Install all workspace dependencies
npm install

# 3. Set up backend environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env — fill in all required values (see Environment Variables below)

# 4. Start development servers (frontend + backend)
npm run dev:both
```

The backend API will be available at `http://localhost:5000` and the frontend at `http://localhost:5173`.

## Environment Variables

Copy `apps/backend/.env.example` to `apps/backend/.env` and fill in each value.  
**Never commit the `.env` file — it is listed in `.gitignore`.**

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the Express server listens on (default: `5000`) |
| `NODE_ENV` | Yes | `development` or `production` |
| `MONGODB_URI` | Yes | MongoDB connection string (Atlas or localhost) |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens — generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | Yes | Token lifetime, e.g. `7d` |
| `GUEST_COOKIE_NAME` | Yes | Cookie name for guest session IDs (default: `shopflow.guestId`) |
| `CORS_ORIGIN` | Yes | Allowed frontend origin, e.g. `http://localhost:5173` |
| `SUPABASE_URL` | Yes | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (keep secret) |
| `SUPABASE_BUCKET` | Yes | Supabase storage bucket name for images |

## Usage

```bash
# Run both frontend and backend in watch mode
npm run dev:both

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:web

# Build frontend for production
npm run build:web

# Run backend tests
npm run test:backend

# Build backend TypeScript
npm run build -w @shopflow/backend

# Start compiled backend (production)
npm run start -w @shopflow/backend
```

## API Overview

The REST API base URL is `/api/v1`. Full endpoint documentation with request/response examples is in [docs/API.md](docs/API.md).

| Resource | Endpoints | Auth |
|---|---|---|
| Auth | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Mixed |
| Users | `POST /users`, `GET/PATCH/DELETE /users/:id`, wishlist, GDPR export | Mixed |
| Products | Full CRUD + image upload + variants | Mixed |
| Cart | Create, view, update, clear (guest + user) | None required |
| Address | Create, view, update, delete (guest + user) | None required |
| Orders | Create from cart, view, update status | Mixed |
| Payments | Create, view, update status | Admin only |
| Reviews | Get reviews, post review | Mixed |
| Admin | Manage users, products, orders (soft-delete + restore) | Admin only |

## Folder Structure

```
ShopFlow/
├── apps/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers (thin layer)
│   │   │   ├── services/      # Business logic
│   │   │   ├── models/        # Mongoose schemas
│   │   │   ├── routes/        # Express route definitions
│   │   │   ├── middleware/    # Auth, validation, logging, error handling
│   │   │   ├── schemas/       # Zod validation schemas
│   │   │   ├── errors/        # Custom error classes
│   │   │   ├── utils/         # JWT helpers, cookie utils
│   │   │   ├── types/         # TypeScript type definitions
│   │   │   └── __tests__/     # Jest unit tests
│   │   ├── docs/              # Backend-specific documentation
│   │   └── .env.example
│   └── web/              # React SPA
│       ├── src/
│       │   ├── pages/         # Route-level page components
│       │   ├── features/      # Feature modules (checkout, cart, etc.)
│       │   ├── components/    # Shared UI components
│       │   ├── api/           # API client methods
│       │   ├── contexts/      # React Context state
│       │   └── types/         # TypeScript types
│       └── public/
├── docs/                 # Project-level documentation
│   ├── API.md            # Full API endpoint reference
│   ├── ARCHITECTURE.md   # Architecture diagrams
│   ├── GDPR.md           # Data register and logging policy
│   ├── HANDOVER.md       # Project status, known issues, ADRs
│   └── adr/              # Architecture Decision Records
├── package.json          # Monorepo root (npm workspaces)
└── README.md
```

## Tests

Tests live in `apps/backend/src/__tests__/` and use Jest with Supertest.

```bash
# Run test suite
npm run test:backend

# Watch mode
npm run test:backend -- --watch
```

Current test coverage includes unit tests for JWT utilities, guest cookie generation, validation error formatting, and custom error classes. Integration tests for endpoints are planned — see [docs/HANDOVER.md](docs/HANDOVER.md) for the current test status.

## Team Roles

| Role | Person | Responsibilities |
|---|---|---|
| Project Manager | Tomac Jansson | Planning, GitHub Project Board, meetings |
| Git Master & Auth Lead | Mattias Eskilsson | Git workflow, JWT, RBAC, security |
| Backend Lead – Data & Core Features | Olivia Mach | Mongoose models, CRUD, order flow, soft delete |
| Frontend & API Integration | Marcus William Johansson | React SPA, UI, API consumption |
| Testing, Docs & DevOps | Pontus Ingenius | Jest, logging, documentation, deployment |

## License

This project was built as a school assignment and is not licensed for commercial use.
