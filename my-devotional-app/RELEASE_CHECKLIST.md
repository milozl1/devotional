# Release Checklist

## Security

- [ ] Rotate any credential previously exposed in code or logs.
- [ ] Confirm `.env` is local-only and `.env.example` contains placeholders only.
- [ ] Run `npm run scan:secrets` and confirm zero findings.
- [ ] Verify RLS policies are applied from `supabase-schema.sql`.

## Quality Gates

- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `npm audit` shows no high/critical vulnerabilities.

## Access Control

- [ ] Non-authenticated users cannot access `/admin`.
- [ ] Authenticated non-admin users cannot access admin routes.
- [ ] Admin users can CRUD devotionals successfully.

## Functional Smoke

- [ ] Public devotional list loads.
- [ ] Day page loads for valid day number.
- [ ] Invalid day shows error state.
- [ ] Progress updates across devotional steps.

## Performance

- [ ] Check built chunk sizes and ensure route chunks are split.
- [ ] Validate initial page load on mobile network profile.
