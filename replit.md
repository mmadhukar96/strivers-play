# Strivers Play

## Overview

Strivers Play is a gamified arcade platform built as a full-stack web application. It features multiple mini-games (Dice Battle, Math Blitz, Memory Flip, Speed Click) with a turn-based combat system, XP/leveling progression, a rank system (Bronze through Diamond), coin economy, a global leaderboard, and a Pro upgrade tier. The app uses a dark purple/gaming-themed UI with animations and celebratory effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, dark gaming theme with custom color tokens defined in `client/src/index.css`
- **Animations**: Framer Motion for page/game transitions, react-confetti for win celebrations
- **Fonts**: Outfit (display), Inter (body) loaded via Google Fonts
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with TypeScript (tsx for dev, esbuild for production)
- **Framework**: Express 5
- **API Pattern**: REST endpoints defined in `shared/routes.ts` as a typed route manifest with Zod validation. The `api` object describes paths, methods, input schemas, and response types.
- **Authentication**: Simple mock session system (stores a single userId in memory). Not production auth — just a username-based login that creates or finds a user.
- **Build**: Custom build script (`script/build.ts`) that runs Vite for client and esbuild for server, outputting to `dist/`

### Shared Layer (`shared/`)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions using PostgreSQL dialect. Defines `users` table with fields: id, username, xp, coins, level, isPro, rank. Also exports rank calculation utilities, game result schema, and Zod-based insert schemas.
- **Routes** (`shared/routes.ts`): Typed API route definitions shared between client and server, ensuring type-safe API calls.

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Current Implementation**: In-memory storage (`MemStorage` class in `server/storage.ts`) with a `Map<number, User>`. Pre-seeds mock leaderboard users.
- **Database Ready**: Drizzle config (`drizzle.config.ts`) points to `DATABASE_URL` env var for PostgreSQL. Schema migrations go to `./migrations`. Use `npm run db:push` to push schema to database.
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts data access, making it easy to swap MemStorage for a Drizzle/PostgreSQL implementation.

### Game Architecture
- Games are client-side React components with local state management
- Game results (won/lost, XP earned, coins earned) are sent to `POST /api/game/complete` 
- XP determines level and rank; rank is calculated server-side via `calculateRank()` utility
- Rank progression: Bronze (0) → Silver (500) → Gold (1500) → Platinum (3000) → Diamond (6000)
- Pro users get 2x XP multiplier

### Key API Endpoints
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/login` | Login/create user by username |
| GET | `/api/me` | Get current authenticated user |
| POST | `/api/game/complete` | Submit game result, update user stats |
| GET | `/api/leaderboard` | Get all users sorted by XP |
| POST | `/api/upgrade` | Upgrade user to Pro status |

### Project Structure
```
client/           → React frontend
  src/
    components/   → Reusable components (layout, rank-badge)
    components/ui/→ shadcn/ui primitives
    pages/        → Route pages (dashboard, game, leaderboard, login, upgrade)
    hooks/        → Custom hooks (use-user, use-game, use-toast)
    lib/          → Utilities (queryClient, utils)
server/           → Express backend
  index.ts        → Server entry point
  routes.ts       → API route handlers
  storage.ts      → Data storage layer (IStorage interface + MemStorage)
  vite.ts         → Vite dev server middleware
  static.ts       → Production static file serving
shared/           → Shared between client and server
  schema.ts       → Drizzle schema + game types + rank system
  routes.ts       → Typed API route definitions
```

## External Dependencies

- **PostgreSQL**: Required database (connect via `DATABASE_URL` environment variable). Currently using in-memory storage but schema and Drizzle config are ready for Postgres.
- **Drizzle ORM + drizzle-kit**: Database ORM and migration tooling for PostgreSQL
- **Google Fonts**: Outfit, Inter, DM Sans, Fira Code, Geist Mono loaded via CDN
- **Replit Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev-only Replit integration)
- **No external auth service**: Uses simple in-memory mock session
- **No payment processing**: Pro upgrade is currently a mock toggle (no Stripe integration active despite being in build allowlist)