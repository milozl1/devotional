# Audit Report (2026-03-09)

Scope: 360 audit of security, functional behavior, performance, UX, and maintainability.

## Findings by Severity

### P0

1. Exposed credentials in source scripts and local env patterns.
   - Impact: database and auth abuse risk.
   - Status: hardcoded credentials removed from code; env placeholders enforced.
   - Remaining action: rotate Supabase DB password, anon key, and admin credentials in Supabase dashboard.

### P1

1. Admin route previously validated session only (not role).
   - Impact: non-admin authenticated users could reach admin UI flow.
   - Status: fixed with `admin_profiles` check + explicit `isAdmin` gating.

2. `user_progress` policy previously allowed unrestricted access (`USING (true)`).
   - Impact: cross-device read/write possibility.
   - Status: fixed with per-operation RLS policies tied to `x-device-id`.

3. Lint blockers:
   - `react-refresh/only-export-components`
   - `prefer-const`
   - `react-hooks/set-state-in-effect`
   - Status: resolved by context split, API refactor, and completion-state derivation.

### P2

1. Build reliability warning due Vite beta + Node version mismatch.
   - Status: moved to stable Vite 6 + plugin-react 4.

2. Large bundle warning.
   - Status: route lazy-loading + manual chunk split added.

3. Corrupted README documentation.
   - Status: replaced with clean operational documentation.

## Backlog (Prioritized)

### P0 Immediate

1. Rotate all secrets previously committed or shared.
2. Invalidate affected sessions/tokens.
3. Re-run `npm run scan:secrets` after rotation and env refresh.

### P1 Next

1. Add CI gate for `npm run check`.
2. Add integration tests for non-admin denial path.
3. Add regression test for `x-device-id` policy behavior.

### P2 Planned

1. Add bundle budget checks in CI.
2. Add Lighthouse mobile baseline and monitor trends.
3. Add typed API client wrapper for better error normalization.
