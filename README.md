# Evently 🎟️

A full-stack event management platform that lets users discover, create, and purchase tickets for events. Built with a React frontend and a Node.js/Express REST API backed by MongoDB Atlas and Redis.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Contributing](#contributing)

---

## Features

- **Event Discovery** — Browse, search, and filter events by category with pagination support
- **Trending Events** — Dedicated endpoint to surface the most popular events
- **Event Management** — Authenticated users can create, edit, and delete their own events
- **Order / Ticketing** — Place and track ticket orders linked to events
- **User Authentication** — Register and login with JWT-based session management
- **Category Management** — Events are organised into named categories
- **Analytics Dashboard** — Protected dashboard and orders pages with statistics
- **System Metrics** — Built-in request metrics endpoint for observability
- **Rate Limiting** — Brute-force protection on login (5 req / 15 min) and register (3 req / hr)
- **Redis Caching** — Upstash Redis integration for fast data access

---

## Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB Atlas (Mongoose) |
| Caching | Upstash Redis (ioredis) |
| Auth | JWT + bcryptjs |
| Rate Limiting | express-rate-limit |
| Dev server | nodemon |

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| Routing | Wouter |
| Data fetching | TanStack Query v5 |
| UI components | Radix UI + shadcn/ui |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |

---

## Project Structure

```
EVENTLY-main/
├── backend/                  # Express REST API
│   ├── config/
│   │   └── redis.js          # Upstash Redis client
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── eventController.js
│   │   ├── metricsController.js
│   │   ├── orderController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT protect guard
│   │   ├── metrics.js         # Request metrics tracker
│   │   ├── rateLimiter.js     # Login / register limiters
│   │   └── redisMiddleware.js # Injects redis onto req
│   ├── models/
│   │   ├── Category.js
│   │   ├── events.js
│   │   ├── Order.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── orderRoutes.js
│   │   └── statsRoutes.js
│   ├── server.js             # Entry point
│   └── package.json
│
└── evently/                  # React frontend
    ├── src/
    │   ├── components/
    │   │   ├── ui/           # shadcn/ui component library
    │   │   ├── event-card.jsx
    │   │   ├── footer.jsx
    │   │   ├── layout.jsx
    │   │   └── navbar.jsx
    │   ├── pages/
    │   │   ├── home.jsx
    │   │   ├── login.jsx
    │   │   ├── register.jsx
    │   │   ├── categories.jsx
    │   │   ├── dashboard.jsx  # Protected
    │   │   ├── metrics.jsx
    │   │   ├── events/
    │   │   │   ├── index.jsx
    │   │   │   ├── detail.jsx
    │   │   │   ├── create.jsx
    │   │   │   └── edit.jsx
    │   │   └── orders/
    │   │       └── index.jsx  # Protected
    │   └── App.jsx
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- An [Upstash Redis](https://upstash.com/) database

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd EVENTLY-main/backend

# 2. Install dependencies
npm install

# 3. Create your environment file (see Environment Variables below)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`.

### Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd EVENTLY-main/evently

# 2. Install dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

The app will be served at `http://localhost:5173` (or the next available port).

---

## Environment Variables

Create a `.env` file inside the `backend/` directory with the following keys:

```env
# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/evently

# JSON Web Token secret (use a long random string in production)
JWT_SECRET=your_jwt_secret_here

# Upstash Redis connection URL
UPSTASH_REDIS_URL=rediss://:your_token@your-endpoint.upstash.io:6379

# Server port (optional, defaults to 5000)
PORT=5000
```

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint | Description | Rate limit |
|---|---|---|---|
| POST | `/register` | Create a new user account | 3 / hr |
| POST | `/login` | Login and receive a JWT | 5 / 15 min |

### Events — `/api/events`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | — | List events (supports `?search=`, `?categoryId=`, `?limit=`, `?offset=`) |
| POST | `/` | ✅ | Create a new event |
| GET | `/trending` | — | Get trending events |
| GET | `/:id` | — | Get a single event by ID |
| PATCH | `/:id` | ✅ | Update an event |
| DELETE | `/:id` | ✅ | Delete an event |
| GET | `/:id/related` | — | Get events related to a given event |

### Orders — `/api/orders`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List all orders |
| POST | `/` | Place a new order |
| GET | `/:id` | Get a single order by ID |

### Categories — `/api/categories`

Standard CRUD operations for event categories.

### Stats — `/api/stats`

Aggregate statistics for the analytics dashboard.

### Metrics — `/api/metrics`

Returns real-time system/request metrics.

---

## Authentication

Evently uses **JWT (JSON Web Tokens)**.

1. Call `POST /api/auth/login` with `{ username, password }`.
2. Store the returned `token` in `localStorage` under the key `"token"`.
3. Include it in protected requests as a Bearer token:
   ```
   Authorization: Bearer <token>
   ```

On the frontend, the `ProtectedRoute` component checks for this token and redirects unauthenticated users to `/login`.

Tokens expire after **30 days**.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the ISC License.
