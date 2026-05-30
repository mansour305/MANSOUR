# Supabase / RLS Readiness — Mawaeedak

## Verdict

Current status: **ready for controlled Supabase setup, not yet Supabase production verified**.

The repository already contains the core Supabase transition assets:

- `SUPABASE_SCHEMA.sql` defines the proposed Supabase tables and enables RLS on user-owned sensitive tables.
- `RLS_POLICIES.sql` defines user-owned access policies for profiles, appointments, financial events, notifications, and complaints.
- `artifacts/mawaeedak/src/lib/supabase.ts` initializes the browser Supabase client only from `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Required environment variables

### Frontend / public

These are safe to expose to the browser when RLS is enabled correctly:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### API server / server-only

These are server runtime variables only:

```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

## Tables covered by current schema

### User-owned tables

These require strict user isolation:

- `profiles`
- `appointments`
- `financial_events`
- `notifications`
- `complaints`

### Admin-managed / public-read tables

These should be public-read only when active/published and admin-write through backend only:

- `daily_messages`
- `themes`
- `story_templates`
- `news`
- `jobs`
- `public_events`

### Admin-only table

- `audit_logs`

No public policy should expose this table.

## RLS policy model

### User-owned data

Users can only select, insert, update, or delete rows where the row owner matches:

```sql
auth.uid() = user_id
```

For `profiles`, ownership uses:

```sql
auth.uid() = id
```

### Public content

Public content should be readable only when explicitly active/published:

- `daily_messages.is_active = true`
- `themes.is_active = true and themes.is_available = true`
- `story_templates.is_active = true`
- `news.is_published = true`
- `jobs.is_active = true`
- `public_events.is_active = true`

### Admin operations

Admin writes should not be performed directly by the browser using anon access. They must go through API server routes protected by admin authentication.

Admin role source of truth:

```text
Supabase auth user app_metadata.role
```

Allowed production admin roles:

```text
admin
super_admin
```

User-editable metadata must not grant admin access.

## Manual setup order in Supabase

Run this order only after creating the Supabase project:

1. Add frontend variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
2. Add backend variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. Run `SUPABASE_SCHEMA.sql` in Supabase SQL Editor.
4. Run `RLS_POLICIES.sql` in Supabase SQL Editor.
5. Create at least one admin user through Supabase Auth.
6. Set admin role through server-controlled metadata only:

```json
{
  "role": "admin"
}
```

or:

```json
{
  "role": "super_admin"
}
```

7. Verify that normal users have no admin role in `app_metadata`.

## Required verification checklist

### Security checks

- Browser client uses anon key only.
- Admin access is based on `app_metadata.role`, not `user_metadata.role`.
- Normal users cannot access `/admin`.
- Users cannot read or modify another user's appointments, financial events, notifications, profile, or complaint records.

### SQL checks

Run these manually in Supabase SQL Editor after applying policies:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
order by tablename;
```

Expected: RLS enabled on all sensitive and public-content tables listed in this document.

```sql
select schemaname, tablename, policyname, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
```

Expected: policies from `RLS_POLICIES.sql` are present.

### App smoke checks

- Guest can browse public pages.
- Guest cannot access `/admin`.
- Normal user can create and read only their own appointments.
- Normal user can create and read only their own financial events.
- Normal user can read and update only their own notifications.
- Admin can access owner dashboard only when Supabase `app_metadata.role` is `admin` or `super_admin`.

## Remaining production blockers

This readiness document does not prove production connection. Production is not confirmed until:

- Supabase variables are actually configured in the deployment environment.
- SQL schema is applied in the Supabase project.
- RLS policies are applied in the Supabase project.
- Manual smoke tests pass with real test users.
- API/server deployment variables match the same Supabase project.

## Final readiness status

**Supabase/RLS layer is documented and ready for controlled setup. It is not yet production-verified until the Supabase project is configured and smoke-tested.**
