# تقرير QA النهائي — مواعيدك

**التاريخ**: 30 مايو 2026  
**الحالة**: Security/API/Auth/Deployment/Data Gateway stabilization complete — production verification still requires live environment credentials.

## Project Snapshot

- **Stack**: pnpm monorepo, React 19 + Vite 7 + TypeScript 5.9, Express 5 API, PostgreSQL/Drizzle, Supabase-ready auth
- **Package manager**: pnpm 10
- **Workspace structure**: `artifacts/mawaeedak` frontend, `artifacts/api-server` API, `lib/*` shared libraries, `scripts` QA tooling
- **Frontend path**: `artifacts/mawaeedak`
- **API path**: `artifacts/api-server`
- **Production URL**: `https://mawaeedak-api-server.vercel.app/`
- **Deployment provider**: Vercel
- **Frontend build command**: `pnpm --filter @workspace/mawaeedak run build`
- **Root typecheck command**: `pnpm run typecheck`
- **Deployment output directory**: `artifacts/mawaeedak/dist/public`
- **API routing model**: frontend can use same-origin `/api/*` or external API through `VITE_API_BASE_URL`
- **Supabase status**: schema/RLS readiness documented; production connection not proven until deployment variables and SQL policies are applied
- **Auth/admin status**: browser-local admin bypass removed; production admin role source is Supabase `app_metadata.role`

## Completed Since Audit

| Area | Status | Evidence |
|---|---:|---|
| API write-route lockdown | ✅ Complete | PR #2 merged |
| Post-merge verification fixes | ✅ Complete | PR #7 merged |
| Admin/Auth production guard | ✅ Complete | PR #8 merged |
| Deployment API routing | ✅ Complete | PR #9 merged |
| Supabase/RLS readiness docs | ✅ Complete | PR #10 merged |
| Data Gateway API transport cleanup | ✅ Complete | PR #14 merged |
| Duplicate tracking issue cleanup | ✅ Complete | Issues #11/#12 closed as duplicates, #13 completed |

## Security / Authorization

- Appointment create/update/delete API routes are protected server-side.
- Financial event create/update/delete API routes are protected server-side.
- Notification mutation/read-state routes are protected server-side.
- Demo admin fallback cannot grant production admin access.
- Frontend admin role reads trust Supabase `app_metadata`, not user-editable `user_metadata`.
- Hardcoded demo admin password was removed from frontend source; development demo auth requires an environment value.
- No service-role key should be exposed in frontend assets.

## Deployment / API Routing

- Frontend API calls can now target a separately deployed Express API through `VITE_API_BASE_URL`.
- `authedFetch` normalizes `VITE_API_BASE_URL`, appends relative `/api/*` paths, and attaches Bearer tokens when Supabase session exists.
- `dataGateway.ts` uses the shared authenticated API transport, reducing inconsistent raw `fetch('/api/...')` behavior.

## Supabase / RLS

- `SUPABASE_SCHEMA.sql` documents the proposed Supabase tables and RLS enablement.
- `RLS_POLICIES.sql` documents user-owned policies for sensitive tables and public-read policies for active/published content.
- `docs/SUPABASE_RLS_READINESS.md` documents setup order, environment variables, SQL checks, and smoke checks.
- Production Supabase verification is still pending until real Supabase project variables are configured and policies are executed.

## Verification Results

| Check | Result |
|---|---|
| API server typecheck/build after security lockdown | ✅ Passed in prior Codex report |
| Frontend post-merge typecheck/build after issue #3 | ✅ Passed in prior Codex report |
| Vercel preview for Supabase readiness doc PR | ✅ Ready |
| Connector static review of PR #14 | ✅ Completed |
| Full fresh runtime `pnpm install/typecheck/build` after PR #14 | ⚠️ Not run from this connector environment |
| Authorized admin API smoke with real Supabase admin | ⚠️ Requires live credentials |
| Supabase RLS live user-isolation smoke | ⚠️ Requires configured Supabase project |

## Remaining Limitations

- Native iOS/Android packaging is not configured and still requires platform credentials/signing assets.
- Production Supabase/RLS behavior is not proven until real environment variables and SQL execution are completed.
- Full end-to-end visual validation against the owner’s reference screenshots has not been completed in this QA report.
- This connector environment cannot run `pnpm` commands directly; runtime checks must be executed by Codex/Replit/GitHub Actions.

## Current Verdict

**Publishable Preview / Stabilized Web-PWA baseline.**

Not yet full Production Ready because live Supabase credentials, RLS execution, authorized smoke tests, native packaging, and final visual-reference validation remain external/runtime gates.

## Next Required Runtime Gate

Run from a clean checkout of `main`:

```bash
pnpm install --frozen-lockfile
pnpm run typecheck
pnpm run build
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/mawaeedak run typecheck
pnpm --filter @workspace/mawaeedak run build
```

Then run smoke tests for:

- `/`
- `/login`
- `/register`
- `/finance`
- `/story`
- `/notifications`
- `/admin`
- unauthenticated protected API mutations → must return 401/403
- authorized admin API mutations → must succeed with real Supabase admin token
- normal user RLS isolation → cannot access another user’s rows
