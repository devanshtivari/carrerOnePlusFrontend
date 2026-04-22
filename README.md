# AI Teaching Platform — Frontend

Next.js 15 (App Router, TypeScript, Tailwind CSS) frontend for the AI Teaching Platform. All data shown in the UI is fetched from the companion backend (`/backend`) via the REST API under `/api/v1`.

## Prerequisites

- Node.js `>= 20.9`
- npm / pnpm / yarn / bun
- A running backend server (see `backend/README.md`) exposing `/api/v1`

## Environment variables

Copy `.env.example` → `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

| Variable | Description | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend REST API. Must include the `/api/v1` suffix. | `http://localhost:3001/api/v1` |

The API client (`src/lib/api.ts`) injects the `Authorization: Bearer …` header from `sessionStorage.access_token` and transparently refreshes expired tokens via `POST /auth/refresh`.

## Scripts

```bash
npm install          # install dependencies
npm run dev          # start dev server on :3000
npm run build        # production build
npm run start        # run the production build
npm run lint         # ESLint + type-aware rules
```

## Project structure

```
src/
  app/                Next.js App Router routes
  components/
    features/         Feature-scoped UI (student, teacher, courses, landing, …)
    shared/           Sidebar, Navbar, Footer, Profile, …
  hooks/              Reusable data-fetching hooks (useApi, useCurrentUser, useNotifications)
  lib/                axios client, icon resolver, utilities
  services/           Typed API clients (one per backend module)
```

### Data flow

1. A component calls a hook from `hooks/` (e.g. `useApi`, `useNotifications`).
2. The hook invokes a typed method from `services/*.ts` (e.g. `coursesService.list()`).
3. The service issues an HTTP request through the shared `api` axios instance.
4. The raw API response is transformed into UI-friendly shapes by helpers living alongside each feature (`./data.ts` + `./types.ts`).

There are **no hardcoded fixtures** in production UI components — every dashboard, course, test, roster, leaderboard and notification reads from the backend. Feature-local `data.ts` files now only expose transformation helpers and empty/fallback constants used during loading.

## Deployment

Any Node-compatible host works (Vercel, Fly.io, container runtimes). The app is no longer statically exported (`output: 'export'` was removed because routes depend on runtime data). Configure `NEXT_PUBLIC_API_URL` on the hosting platform to point at the deployed backend.
