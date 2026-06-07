# Admin Visual + Functional Contract — مواعيدك

## Purpose

This document is the required acceptance contract for the owner/admin panel.

The admin panel must match the approved visual references in `scripts/test-results/` and every visible section, card, table, form, and button must perform a real function.

A page is not accepted because it opens. A button is not accepted because it has `onClick`. A section is not accepted because it is visually present.

## Approved Visual References

The following files are the visual source of truth:

| Reference file | Required section / route | Required functional scope |
|---|---|---|
| `scripts/test-results/admin-reference-01-dashboard.png` | `/admin`, `/admin/dashboard` | Dashboard cards, stats, latest activity, quick actions, real links, loading/error states |
| `scripts/test-results/admin-reference-02-members.png` | `/admin/members` | List members, search/filter, edit, block/unblock, role changes, session/action feedback |
| `scripts/test-results/admin-reference-03-financial.png` | `/admin/financial`, `/admin/official-financial` | Read, add, edit, delete, activate/deactivate, refresh persistence, user-facing reflection where applicable |
| `scripts/test-results/admin-reference-04-messages.png` | `/admin/messages` | Add/edit/delete daily message, activate message, persist after refresh, reflect on HomePage |
| `scripts/test-results/admin-reference-05-story.png` | `/admin/story` | Manage story templates, preview, activate/deactivate, persist after refresh, reflect in story/daily-card flow |
| `scripts/test-results/admin-reference-06-themes.png` | `/admin/themes` | List themes, edit, activate/deactivate, availability, persist after refresh, reflect in user UI where applicable |
| `scripts/test-results/admin-reference-07-notifications.png` | `/admin/notifications` | Read/delete notifications through Gateway; broadcast is disabled unless server/Edge Function exists |
| `scripts/test-results/admin-reference-08-news-jobs.png` | `/admin/news-jobs` | Add/edit/delete/publish/hide news and jobs, persist after refresh, reflect in user-facing centers |
| `scripts/test-results/admin-reference-09-reports.png` | `/admin/reports` | Show report data without broken API dependency, filters, CSV export, explicit partial/local mode if no central audit table |
| `scripts/test-results/admin-reference-10-settings.png` | `/admin/settings`, `/admin/permissions`, `/admin/support`, `/admin/social` | Settings save, permissions save, support management, external integrations clearly disabled if not connected |

## Non-negotiable Visual Rules

1. The admin panel must preserve the approved visual identity shown in the reference screenshots.
2. Do not redesign from scratch.
3. Do not replace the approved layout with a generic dashboard.
4. Keep RTL layout, spacing, typography, card treatment, tables, buttons, and section hierarchy aligned with the references.
5. Any deviation must be required for a real functional fix and must be documented.

## Non-negotiable Functional Rules

Every section must support, where applicable:

- Display real data or explicit empty state.
- Add item.
- Edit item.
- Delete item.
- Activate/deactivate item.
- Search/filter if visible.
- Save with success message.
- Failure message on error.
- Loading state.
- Hard refresh persistence.
- User-facing reflection when the admin-managed data appears in the user app.

## Fake Function Rejection Rules

The following are not accepted as working functionality:

- Route exists only.
- Static card only.
- Button with `onClick` but no saved effect.
- Toast-only action.
- Disabled button counted as success.
- LocalStorage presented as full production backend.
- API call that fails silently.
- Supabase failure silently falling back to api-server in `supabase` mode.
- External social/push/broadcast button shown as working without server/API keys.

## Production Data Source Rule

For production, the recommended mode is:

```bash
VITE_DATA_SOURCE_MODE=supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

In Supabase-only mode:

- Gateway-backed sections must use Supabase directly.
- API/server-only actions must be converted, moved to Edge Function/server, or disabled clearly.
- Do not claim `api-server` is unnecessary while an admin page still depends on Orval/API for production behavior.

## Required E2E Acceptance

A final E2E gate must prove:

1. Admin login works.
2. Every admin route opens without white screen.
3. For each production-ready section, perform one real create/edit/delete or activate/deactivate operation.
4. Refresh after the operation.
5. Verify the data remains or the state changed.
6. Verify user-facing reflection for:
   - daily message → HomePage
   - news/jobs → user centers
   - financial event → user finance/home countdown
   - theme activation → user UI/account/theme flow where applicable
7. Verify known external features are disabled clearly and not counted as working.

## Current Known Partial Areas

These areas must not be reported as fully working until converted or clearly disabled:

- Notification broadcast/send-to-all: requires server or Supabase Edge Function.
- Social publishing/automation: requires external API keys and trusted server flow.
- Central audit reports: requires Supabase `audit_logs` or server-side logging.
- Settings/permissions stored only in localStorage are local/demo, not global production settings.

## Acceptance Sentence

The admin panel is accepted only when it visually matches `scripts/test-results/admin-reference-*.png` and every visible section/content/button either works with a real persisted effect or is explicitly disabled with a clear reason.
