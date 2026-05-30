# API Audit Report

Updated: 2026-05-30

## P0 Security/API Blockers

| Area | Prior behavior | Change made | Verification |
| --- | --- | --- | --- |
| Appointment mutations | `POST /api/appointments`, `PATCH /api/appointments/:id`, and `DELETE /api/appointments/:id` accepted unauthenticated requests. | Added `requireAdmin` middleware to appointment create/update/delete routes. | `pnpm --filter @workspace/api-server run typecheck`; `pnpm --filter @workspace/api-server run build` |
| Financial event mutations | `POST /api/financial-events`, `PATCH /api/financial-events/:id`, and `DELETE /api/financial-events/:id` accepted unauthenticated requests. | Added `requireAdmin` middleware to financial event create/update/delete routes. | `pnpm --filter @workspace/api-server run typecheck`; `pnpm --filter @workspace/api-server run build` |
| Notification mutations | Notification read-state and delete mutation routes accepted unauthenticated requests. | Added `requireAdmin` middleware to `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`, and `DELETE /api/notifications/:id`. Existing notification create route already used `requireAdmin`. | `pnpm --filter @workspace/api-server run typecheck`; `pnpm --filter @workspace/api-server run build` |
| Admin fallback | Demo admin credentials could still be used when Supabase was absent from a production build. | Demo admin auth is now development-only. Production builds without Supabase cannot authenticate via demo credentials, and admin role checks rely on Supabase `app_metadata`. | API checks passed; frontend production build was not run because verification scope requested API-only focused checks. |

## Remaining API Risks

- Read routes for appointments, financial events, and notifications remain public in this patch because the requested P0 scope targeted unsafe write/mutation routes.
- Current appointment, financial event, and notification schemas do not include user ownership columns, so this patch uses existing admin authorization rather than inventing ownership semantics.
- Supabase/RLS production verification remains pending against a connected production Supabase project.
