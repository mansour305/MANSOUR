# Architecture â€” ظ…ظˆط§ط¹ظٹط¯ظƒ (Web/PWA Only)

## ظ†ط¸ط±ط© ط¹ط§ظ…ط©

طھط·ط¨ظٹظ‚ Web/PWA ط£ط­ط§ط¯ظٹ ط§ظ„طµظپط­ط© (SPA) ظ…ط¨ظ†ظٹ ط¹ظ„ظ‰ pnpm monorepoطŒ ط¨ط«ظ„ط§ط«ط© ط£ط¬ط²ط§ط، ط±ط¦ظٹط³ظٹط©:

```
Frontend (React/Vite)  â†’  API Server (Express 5)  â†’  PostgreSQL (Supabase)
```

**ظ…ظ„ط§ط­ط¸ط©**: طھظ… ط¥ط²ط§ظ„ط© ط¬ظ…ظٹط¹ ظ…ظƒظˆظ†ط§طھ Mobile/Flutter/Expo. ط§ظ„طھط·ط¨ظٹظ‚ ط§ظ„ط¢ظ† Web/PWA ظپظ‚ط·.

---

## ط¨ظ†ظٹط© Monorepo

```
artifacts/
  mawaeedak/          # SPA â€” React 18 + Vite + Tailwind v4
  api-server/         # API â€” Express 5 + TypeScript

lib/
  api-spec/           # OpenAPI 3.1 YAML â€” source of truth
  api-client-react/   # Generated: React Query hooks (Orval)
  api-zod/            # Generated: Zod v4 schemas (Orval)
  db/                 # Drizzle ORM schema + client
```

---

## Frontend â€” `artifacts/mawaeedak`

**Stack**: React 18, Vite, Tailwind CSS v4, wouter, Tanstack Query, shadcn/ui, Tajawal font

**RTL-first**: ط¬ظ…ظٹط¹ ط§ظ„ظˆط§ط¬ظ‡ط© ط¨ط§ظ„ط¹ط±ط¨ظٹط© ظ…ط¹ direction:rtl

**Routing**: wouter (client-side SPA)

```
src/
  App.tsx              # Root â€” ErrorBoundary + Router
  pages/               # طµظپط­ط§طھ ظƒظ„ ظ…ط³ط§ط±
  features/            # طµظپط­ط§طھ ط§ظ„ظ…ظ…ظٹط²ط§طھ (home/calendar/finance/centers/admin/â€¦)
  components/
    layout/            # AppShell + TopBar + BottomNav
    ui/                # shadcn/ui components
    ErrorBoundary.tsx  # Error Boundary ط¹ط±ط¨ظٹ ظٹط؛ظ„ظ‘ظپ ظƒط§ظ…ظ„ ط§ظ„طھط·ط¨ظٹظ‚
  hooks/
    useStore.tsx       # Global state (StoreProvider)
    useTheme.ts        # Theme engine hook
  lib/
    utils.ts           # Hijri/Gregorian date utilities
```

**Theme Engine**: CSS variables ظ…ط¹ `data-theme` attribute â€” ط«ظٹظ…ط§طھ ظپظٹ PostgreSQL
- **ط§ظ„ط«ظٹظ… ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ…**: ظٹط¶ط¨ط·ظ‡ ط§ظ„ظ…ط§ظ„ظƒ ظ…ظ† `/admin/themes` ظˆظٹظڈط®ط²ظژظ‘ظ† ظپظٹ ط¬ط¯ظˆظ„ `app_settings` ط¹ط¨ط± Express (`PUT /api/settings/default-theme` ظ…ط­ظ…ظٹ ط¨ظ€ `requireAdmin`). ظٹظ‚ط±ط£ظ‡ `useTheme` ظ…ظ† `GET /api/settings/default-theme` (ط¹ط§ظ…).
- **ط§ظ„ط«ظٹظ… ط§ظ„ط´ط®طµظٹ**: ظٹط®طھط§ط±ظ‡ ط§ظ„ظ…ط³طھط®ط¯ظ… ظ…ظ† `/account` ظˆظٹظڈط­ظپط¸ ظ…ط­ظ„ظٹط§ظ‹ (`localStorage: app-theme`) ظˆظٹطھط¬ط§ظˆط² ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¹ط§ظ…. "ط§ظ„ط¹ظˆط¯ط© ظ„ظ„ط§ظپطھط±ط§ط¶ظٹ" طھظ…ط³ط­ ط§ظ„طھظپط¶ظٹظ„ ط§ظ„ط´ط®طµظٹ.

**Auth & Admin Protection**:
- ط§ظ„ظˆط§ط¬ظ‡ط©: Supabase Auth (JWT). طھظˆظƒظ† ط§ظ„ط¬ظ„ط³ط© ظٹظڈط±ظپظ‚ طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ط¹ظ„ظ‰ ط§ظ„ظ€ hooks ط§ظ„ظ…ظˆظ„ظ‘ط¯ط© ظˆط¹ظ„ظ‰ ط§ظ„ظ†ط¯ط§ط،ط§طھ ط§ظ„ط®ط§ظ… ط¹ط¨ط± `authedFetch`/`apiAuth.ts`.
- ط§ظ„ط®ط§ط¯ظ…: middleware `requireAdmin` ظٹط­ظ…ظٹ ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ط¥ط¯ط§ط±ظٹط© â€” ظٹطھط­ظ‚ظ‚ ظ…ظ† Bearer JWT ط¹ط¨ط± `${SUPABASE_URL}/auth/v1/user` ظˆظٹط³ظ…ط­ ظپظ‚ط· ط¨ط§ظ„ط£ط¯ظˆط§ط± `admin`/`super_admin` (401 ط¨ط¯ظˆظ† طھظˆظƒظ†طŒ 403 ظ„ط¯ظˆط± ط؛ظٹط± ظ…طµط±ظ‘ط­طŒ 503 ط¹ظ†ط¯ ط؛ظٹط§ط¨ ط¥ط¹ط¯ط§ط¯ Supabase ظپظٹ ط§ظ„ط®ط§ط¯ظ…).
- ظ„ط§ ظٹظˆط¬ط¯ طھط¬ط§ظˆط² ط¹ط¨ط± localStorage ظ„ظ„ط­ظ…ط§ظٹط© ط§ظ„ط®ط§ط¯ظ…ظٹط© â€” admin ط§ظ„ظˆظ‡ظ…ظٹ ط§ظ„ظ…ط­ظ„ظٹ ظ„ط§ ظٹظ…ظ„ظƒ JWT ظˆظٹظڈط±ظپط¶.

---

## API Server â€” `artifacts/api-server`

**Stack**: Express 5, TypeScript, Drizzle ORM, Zod v4

**Contract-first**: ط§ظ„ظ…ط³ط§ط±ط§طھ ظ…ظڈط¹ط±ظژظ‘ظپط© ط£ظˆظ„ط§ظ‹ ظپظٹ `lib/api-spec/openapi.yaml` â†’ codegen

**Base path**: `/api`

**ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ط­ط§ظ„ظٹط©** (17+ endpoint):
```
GET/POST/PUT/DELETE /api/appointments
GET/POST/PUT/DELETE /api/financial-events
GET/POST/PUT/DELETE /api/notifications
GET/POST/PUT/DELETE /api/daily-messages
GET/POST/PUT/DELETE /api/themes
GET/POST/PUT/DELETE /api/news
GET/POST/PUT/DELETE /api/jobs
GET/POST            /api/complaints
GET/POST/PUT/DELETE /api/story-templates
GET/POST            /api/audit-logs
GET/POST/PUT/DELETE /api/public-events
GET                 /api/admin/*
GET                 /api/healthz
```

---

## Data Layer â€” PostgreSQL + Drizzle ORM

**12 ط¬ط¯ظˆظ„** ظپظٹ `lib/db/src/schema/`:

| ط§ظ„ط¬ط¯ظˆظ„ | ط§ظ„ظˆطµظپ |
|---|---|
| `appointments` | ظ…ظˆط§ط¹ظٹط¯ ط§ظ„ظ…ط³طھط®ط¯ظ… (CRUD ظƒط§ظ…ظ„) |
| `financial_events` | ط£ط­ط¯ط§ط« ظ…ط§ظ„ظٹط© (ط±ط§طھط¨/ط¯ط¹ظ…/ظپط§طھظˆط±ط©) |
| `notifications` | ط¥ط´ط¹ط§ط±ط§طھ ط¯ط§ط®ظ„ظٹط© |
| `daily_messages` | ط±ط³ط§ط¦ظ„ ط§ظ„ظٹظˆظ… (admin_managed) |
| `themes` | طھط¹ط±ظٹظپ ط§ظ„ط«ظٹظ…ط§طھ ط§ظ„ط¹ط´ط±ط© |
| `news` | ط£ط®ط¨ط§ط± (admin_managed) |
| `jobs` | ظˆط¸ط§ط¦ظپ (admin_managed) |
| `prayer_times` | ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© (طھظ‚ط¯ظٹط±ظٹط©/static) |
| `public_events` | ط£ط­ط¯ط§ط« ط¹ط§ظ…ط© (admin_managed) |
| `complaints` | ط´ظƒط§ظˆظ‰ ظˆظ…ظ‚طھط±ط­ط§طھ ط§ظ„ظ…ط³طھط®ط¯ظ…ظٹظ† |
| `audit_logs` | ط³ط¬ظ„ ظ†ط´ط§ط·ط§طھ ط§ظ„ط¥ط¯ط§ط±ط© |
| `story_templates` | ظ‚ظˆط§ظ„ط¨ ط³طھظˆط±ظٹ ط§ظ„ظٹظˆظ… |

**ظ…ظ„ط§ط­ط¸ط©**: ط§ظ„ط¬ط¯ط§ظˆظ„ ط§ظ„ط­ط§ظ„ظٹط© ظ„ط§ طھط­طھظˆظٹ `user_id` â€” ط¨ظٹط§ظ†ط§طھظ‡ط§ ظ…ط´طھط±ظƒط© (demo mode). ط¹ظ†ط¯ ط±ط¨ط· SupabaseطŒ ظٹظڈط¶ط§ظپ `user_id UUID REFERENCES auth.users` + RLS.

---

## Notification Center

- ط¥ط´ط¹ط§ط±ط§طھ ط¯ط§ط®ظ„ظٹط© ظپظ‚ط· (ظ‚ط§ط¹ط¯ط© ط¨ظٹط§ظ†ط§طھ)
- Push Notifications: **ظ…ط¤ط¬ظ„** (ظ„ط§ Firebase/Supabase Realtime ط­ط§ظ„ظٹط§ظ‹)
- Admin ظٹط±ط³ظ„ ط¥ط´ط¹ط§ط±ط§ظ‹ â†’ ظٹظڈط®ط²ظژظ‘ظ† ظپظٹ DB â†’ ظٹط¸ظ‡ط± ظ„ظ„ظ…ط³طھط®ط¯ظ…ظٹظ†

---

## PWA / Error Boundary / 404

- **manifest.json**: ظ…ظˆط¬ظˆط¯ ظ…ط¹ `lang:ar`, `dir:rtl`, `favicon.svg` icon
- **Service Worker**: **ظ…ط¤ط¬ظ„** â€” ظ„ط§ vite-plugin-pwa ط­ط§ظ„ظٹط§ظ‹
- **Offline Fallback**: **ظ…ط¤ط¬ظ„**
- **Error Boundary**: `src/components/ErrorBoundary.tsx` â€” ظٹط؛ظ„ظ‘ظپ ظƒط§ظ…ظ„ App
- **طµظپط­ط© 404**: `src/pages/not-found.tsx` â€” ط¹ط±ط¨ظٹط© ظ…ط¹ ط«ظٹظ… ط§ظ„طھط·ط¨ظٹظ‚

---

## Story Today

1. ظٹط¬ظ„ط¨ ظ‚ظˆط§ظ„ط¨ ظ…ظ† DB (`story_templates`)
2. ظٹط¬ظ„ط¨ ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ… ظ…ظ† DB (`daily_messages`)
3. ظٹط¬ظ„ط¨ ط§ظ„ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ط§ظ„ظٹط© ظ…ظ† DB (`financial_events`)
4. ط§ظ„ظ…ط³طھط®ط¯ظ… ظٹط®طھط§ط± ظ‚ط§ظ„ط¨ط§ظ‹ ظˆظٹط¹ط¯ظ‘ظ„ ط§ظ„ظ†طµ
5. ظ†ط³ط® / ظ…ط´ط§ط±ظƒط© (Web Share API) / ط­ظپط¸ (localStorage)

---

## Centers â€” ط§ظ„ظ…ط±ط§ظƒط² ط§ظ„ط«ظ…ط§ظ†ظٹط©

| ط§ظ„ظ…ط±ظƒط² | ظ…طµط¯ط± ط§ظ„ط¨ظٹط§ظ†ط§طھ |
|---|---|
| ط§ظ„ط£ط¹ظ…ط§ظ„ | localStorage (`mawaeedak_work_tasks_v1`) |
| ط§ظ„ط³ظپط± | localStorage |
| ط§ظ„ط¯ط±ط§ط³ط© | localStorage |
| ط§ظ„ط£ط®ط¨ط§ط± | PostgreSQL (`news`) |
| ط§ظ„ظˆط¸ط§ط¦ظپ | PostgreSQL (`jobs`) |
| ط§ظ„طھظ‡ط§ظ†ظٹ | static templates ظپظٹ ط§ظ„ظƒظˆط¯ |
| ط§ظ„ط´ظƒط§ظˆظ‰ | PostgreSQL (`complaints`) |
| ط§طھطµظ„ ط¨ظ†ط§ (ط³طھظˆط±ظٹ) | ظٹط¹ظٹط¯ طھظˆط¬ظٹظ‡ ظ„ظ€ StoryPage |

---

## Admin Workflows

- Auth: demo mode (localStorage `admin_authenticated`)
- ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ…: ط¥ط¯ط§ط±ط© ظƒط§ظ…ظ„ط© ظ„ط¬ظ…ظٹط¹ ط¬ط¯ط§ظˆظ„ DB
- audit_logs: ظٹظڈط³ط¬ظژظ‘ظ„ ظƒظ„ ط¥ط¬ط±ط§ط، ط¥ط¯ط§ط±ظٹ
- AdminNotifications: ط¥ط±ط³ط§ظ„ ط¥ط´ط¹ط§ط± â†’ `/api/notifications` POST

---

## Data Layer â€” Phase 12G (Supabase Read Cutover Ready)

### ط§ظ„ط­ط§ظ„ط© ط§ظ„ط­ط§ظ„ظٹط© (2026-05-24)

```
mode=api (ط§ظ„ط§ظپطھط±ط§ط¶ظٹ):
  Orval hooks â†’ Express API â†’ PostgreSQL

mode=supabase_shadow:
  Orval hooks â†’ Express API â†’ PostgreSQL   â†گ ظˆط§ط¬ظ‡ط© ط§ظ„ظ…ط³طھط®ط¯ظ…
  gwRunShadowComparison â†’ Supabase         â†گ ظ…ظ‚ط§ط±ظ†ط© /admin/data-layer

mode=supabase:
  gwGet*() â†’ Supabase â†’ fallback â†’ API    â†گ ظ‚ط±ط§ط،ط©
  Mutations (POST/PATCH/DELETE) â†’ API     â†گ ظƒطھط§ط¨ط© (ظ„ظ… طھطھط­ظˆظ„ ط¨ط¹ط¯)
```

### ط§ظ„ظ…ظ„ظپط§طھ ط§ظ„ظ…ط¶ط§ظپط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„ط¯ظˆط± |
|---|---|
| `src/lib/dataSourceMode.ts` | Feature flag â€” `DATA_SOURCE_MODE` (ط§ظپطھط±ط§ط¶ظٹ: "api") |
| `src/lib/supabaseData.ts` | 9 ط¯ظˆط§ظ„ ظ‚ط±ط§ط،ط© ظ…ظ† Supabase + runShadowComparison |
| `src/lib/dataGateway.ts` | Gateway â€” ظٹظˆط¬ظ‘ظ‡ ط§ظ„ظ‚ط±ط§ط،ط© ط­ط³ط¨ ط§ظ„ظˆط¶ط¹ |
| `src/features/admin/AdminDataLayer.tsx` | ظ„ظˆط­ط© Data Layer ظپظٹ /admin/data-layer |

### Supabase â€” ط§ظ„ط­ط§ظ„ط© (Phase 12Q)

- **Supabase Auth:** âœ… ظپط¹ظ‘ط§ظ„ â€” hrq@hotmail.com (super_admin)
- **40 طµظپ ظ…ظ†ظ‚ظˆظ„:** daily_messages(8) + story_templates(2) + themes(10) + news(2) + jobs(2) + appointments(2) + financial_events(8) + notifications(3) + complaints(3)
- **ANON_KEY ظپظ‚ط·** ظپظٹ ط§ظ„ظˆط§ط¬ظ‡ط© â€” ظ„ط§ service_roleطŒ ظ„ط§ hardcoded secrets
- **RLS:** user-owned tables طھظڈط±ط¬ط¹ 0 طµظپظˆظپ ط¨ط¯ظˆظ† session (ط¢ظ…ظ†)
- **Gateway Complete:** appointmentsطŒ financial_eventsطŒ notificationsطŒ newsطŒ jobsطŒ themesطŒ story_templatesطŒ daily_messages

### Gateway Coverage (Phase 12O/12P)

| ط§ظ„ظ†ط·ط§ظ‚ | ط§ظ„ط­ظƒظ… | ط§ظ„طµظپط­ط§طھ |
|---|---|---|
| appointments | Gateway Complete | CalendarPage + HomePage |
| financial_events | Gateway Complete | FinancePage + HomePage + StoryPage |
| notifications | Gateway Complete | NotificationsPage + TopBar + AdminNotifications |
| news | Gateway Complete | CentersNewsPage + AdminNewsJobs |
| jobs | Gateway Complete | CentersJobsPage + AdminNewsJobs |
| themes | Gateway Complete | AccountPage + AdminThemes |
| story_templates | Gateway Complete | StoryPage + AdminStory |
| daily_messages | Gateway Complete | HomePage + StoryPage + AdminMessages |
| prayer_times | API Intentionally | server-computed â€” ظ„ط§ ظ…ظƒط§ظپط¦ Supabase |
| today_message | API Intentionally | server-computed â€” ظ„ط§ ظ…ظƒط§ظپط¦ Supabase |
| admin stats + audit_logs | API Intentionally | server-computed aggregates |
| public_events | API Intentionally | ظ„ظٹط³ ظپظٹ Supabase schema |
| AdminFinancial CRUD | API Intentionally | admin view ظƒظ„ users â€” ظ„ط§ RLS |
| notification send | API Intentionally | fan-out server-side |
| complaints write | API Intentionally | Orval form submission |

### طھط؛ظٹظٹط± ط§ظ„ظˆط¶ط¹

```bash
# ظپظٹ Replit Secrets ط£ظˆ .env
VITE_DATA_SOURCE_MODE=api              # PostgreSQL/Express (ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط§ظ„ط¢ظ…ظ†)
VITE_DATA_SOURCE_MODE=supabase_shadow  # API ظ„ظ„ط¹ط±ط¶ + Supabase ظ„ظ„ظ…ظ‚ط§ط±ظ†ط©
VITE_DATA_SOURCE_MODE=supabase         # Supabase ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© (ط§ظ„ط¥ظ†طھط§ط¬)
```

**ظ‚ط§ط¹ط¯ط© ظ…ظ‡ظ…ط©:** ط§ظ„ظ‚ظٹظ…ط© ط§ظ„ط§ظپطھط±ط§ط¶ظٹط© `api` ظ…ط«ط¨طھط© ظپظٹ ط§ظ„ظƒظˆط¯ ظ„ط£ط³ط¨ط§ط¨ ط£ظ…ط§ظ†. طھظڈط؛ظٹظژظ‘ط± ظپظ‚ط· ط¹ط¨ط± env variable ظˆظ„ط§ طھظڈط¹ط¯ظژظ‘ظ„ ظپظٹ `dataSourceMode.ts` ظ…ط¨ط§ط´ط±ط©.

### Security Model

| ط§ظ„ط¬ط§ظ†ط¨ | ط§ظ„طھظپط§طµظٹظ„ |
|---|---|
| Auth ظپظٹ ط§ظ„ط¥ظ†طھط§ط¬ | Supabase Auth (email + password) |
| Auth ظپظٹ demo | localStorage ظپظ‚ط· (ط¹ظ†ط¯ ط؛ظٹط§ط¨ VITE_SUPABASE_URL) |
| Role trust | user_metadata.role (ظٹظڈط¶ط¨ط· ط¹ظ†ط¯ ط¥ظ†ط´ط§ط، ط§ظ„ظ…ط³طھط®ط¯ظ…) |
| Admin guard | ALLOWED_ROLES: admin, super_admin, content_manager, finance_manager |
| Key ظپظٹ ط§ظ„ظˆط§ط¬ظ‡ط© | ANON_KEY ظپظ‚ط· â€” ظ…ط­ظ…ظٹ ط¨ظ€ RLS |
| service_role | ظ…ظ…ظ†ظˆط¹ ظپظٹ ط§ظ„ظˆط§ط¬ظ‡ط© â€” server ظپظ‚ط· |

> **ظ…ظ„ط§ط­ط¸ط© ط£ظ…ظ†ظٹط©:** Role ظٹط£طھظٹ ظ…ظ† `user_metadata.role` ظپظٹ Supabase JWT. ظ„ظ„ط¥ظ†طھط§ط¬ ط§ظ„ط­ط±ط¬طŒ ظٹظڈظˆطµظ‰ ط¨ظ€ custom claims function ط¨ط¯ظ„ط§ظ‹ ظ…ظ† user_metadata ظ„ظ…ظ†ط¹ ط§ظ„ظ…ط³طھط®ط¯ظ… ظ…ظ† طھط¹ط¯ظٹظ„ ط¯ظˆط±ظ‡. ظ…ظˆط«ظ‚ ظƒظ‚ظٹط¯ ط­ط§ظ„ظٹ ط؛ظٹط± ظ…ط§ظ†ط¹ ظ„ظ„ط§ط³طھط®ط¯ط§ظ….

### ط§ظ„طھظˆط§ظپظ‚ ظ…ط¹ Expo ظ„ط§ط­ظ‚ط§ظ‹
- API Server ظٹط¨ظ‚ظ‰ ظ…ط±ط¬ط¹ط§ظ‹ ظ…ط´طھط±ظƒط§ظ‹ ط¨ظٹظ† Web ظˆ Expo
- Supabase client ظٹط¹ظ…ظ„ ط¹ظ„ظ‰ React Native
- Store/hooks ظ‚ط§ط¨ظ„ط© ظ„ط¥ط¹ط§ط¯ط© ط§ظ„ط§ط³طھط®ط¯ط§ظ…

---

## Single Source of Truth

| ط§ظ„ط¨ظٹط§ظ†ط§طھ | ط§ظ„ظ…طµط¯ط± |
|---|---|
| API contracts | `lib/api-spec/openapi.yaml` |
| DB schema | `lib/db/src/schema/` |
| React Query hooks | `lib/api-client-react/src/generated/` |
| Zod schemas | `lib/api-zod/src/generated/api.ts` |
| Theme colors | PostgreSQL `themes` table + Supabase |
| User preferences | localStorage |
| Admin auth | Supabase Auth (ط¥ظ†طھط§ط¬) / localStorage demo (ط¨ط¯ظˆظ† ظ…ظپط§طھظٹط­) |

