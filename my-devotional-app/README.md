# Devotional App

React + TypeScript + Vite application for daily devotionals (public reading flow + admin publishing flow).

## Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4
- Supabase (Postgres + Auth + RLS)

## Core Features

- Public devotional list and daily reading flow.
- Step-by-step devotional progression per device.
- Admin authentication + protected dashboard.
- Admin CRUD for devotionals and publish toggle.

## Security Baseline

- No credentials are hardcoded in source files.
- Local secrets are environment-based only.
- `user_progress` access is constrained by `x-device-id` header + RLS.
- Admin routes require both authenticated session and `admin_profiles` membership.

## Environment Variables

Copy `.env.example` to `.env` and fill with real values.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_DB_URL`
- `E2E_BASE_URL` (optional)
- `E2E_SUPABASE_URL` (optional)
- `E2E_SUPABASE_ANON_KEY` (optional)
- `E2E_ADMIN_EMAIL` (optional)
- `E2E_ADMIN_PASSWORD` (optional)

## Install and Run

```bash
npm install
npm run dev
```

## Validation Commands

```bash
npm run lint
npm run build
npm run scan:secrets
npm audit
```

or run all:

```bash
npm run check
```

## Database Setup

Schema file: `supabase-schema.sql`

Apply schema (explicit confirmation required):

```bash
CONFIRM_DB_SETUP=yes SUPABASE_DB_URL=postgresql://... node setup-db.mjs
```

## User Progress Contract

Public users are anonymous and tracked by device:

- Client generates a stable `device_id` in local storage.
- Supabase client sends `x-device-id` in every request.
- RLS allows `user_progress` `SELECT/INSERT/UPDATE/DELETE` only when `device_id` matches `x-device-id`.

If this header is removed or changed, progress access is blocked by RLS.

## Admin Access Contract

- Admin login uses Supabase Auth.
- After login, app checks `admin_profiles` for the authenticated user.
- Users without admin profile are signed out and denied admin routes.

## Release Checklist

See `RELEASE_CHECKLIST.md`.

## GitHub Pages Deploy

Workflow file: `.github/workflows/deploy-pages.yml` (repo root).

Required repo secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Setup once in GitHub:

1. Go to `Settings -> Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` or run the workflow manually from `Actions`.

Notes:

- Workflow builds from `my-devotional-app`.
- `VITE_BASE_PATH` is auto-calculated in CI (`/repo-name/` for project pages, `/` for `*.github.io` repos).
- `VITE_USE_HASH_ROUTER=true` is used in Pages builds, so routes work without server rewrites.
