# QA Execution Plan

## Required Commands

Run only when the task explicitly allows command execution.

- `pnpm install`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test`
- API/server smoke command, if defined by the audited package scripts.
- Frontend preview or dev-server smoke command, if defined by the audited package scripts.

Record exact commands, exit codes, and any failures.

## Manual Smoke Checklist

- Open the main user flow.
- Verify login, logout, and protected-route behavior.
- Verify primary navigation in RTL.
- Verify event/date creation or viewing flows, depending on supported behavior.
- Verify admin entry points are not visible or usable by unauthorized users.
- Verify empty, loading, success, and error states where applicable.

## Security Smoke Checklist

- Unauthorized users cannot access protected user routes.
- Non-admin users cannot access admin UI or admin API behavior.
- Client-side role manipulation does not grant admin privileges.
- Password reset and auth errors do not leak sensitive data.
- No secrets are exposed in frontend bundles, logs, docs, or examples.

## Data Smoke Checklist

- User-owned data is scoped to the authenticated user.
- Admin data access is intentional and server-authorized.
- Mock or seed data is not used silently in production paths.
- CRUD flows read back the same persisted data source.
- Supabase/RLS behavior matches the intended access model.

## Visual Smoke Checklist

- Primary mobile viewport renders without overlapping text or controls.
- Primary desktop viewport renders without broken layout.
- RTL text, form controls, navigation, and dialogs align correctly.
- Buttons, tabs, menus, and inputs remain usable at small widths.
- Visual-reference comparison is recorded when that phase begins.

## Deployment Smoke Checklist

- Required environment variables are documented and present in the deployment target.
- Frontend deployment can reach the intended API/backend.
- Backend can reach Supabase with safe key usage.
- Production route refreshes do not break.
- Health or smoke endpoint succeeds if available.
- Deployment result, URL, and known risks are recorded.
