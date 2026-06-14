# DATA_SOURCE_MAP.md â€” ظ…ظˆط§ط¹ظٹط¯ظƒ
**طھط§ط±ظٹط® ط§ظ„ط¥ظ†ط´ط§ط،:** 2026-05-24 | Phase 12A

ط®ط±ظٹط·ط© ط´ط§ظ…ظ„ط© ظ„ظ…طµط§ط¯ط± ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ط­ط§ظ„ظٹط© ظˆظ…ظ‚ط§ط¨ظ„ط§طھظ‡ط§ ظپظٹ Supabase.

---

## ظ…ظ„ط®طµ ط§ظ„ظ…طµط§ط¯ط± ط§ظ„ط­ط§ظ„ظٹط©

| ط§ظ„ظ…طµط¯ط± | ط§ظ„ط§ط³طھط®ط¯ط§ظ… | ط§ظ„ط­ط§ظ„ط© |
|---|---|---|
| **PostgreSQL (Drizzle/Express)** | 12 ط¬ط¯ظˆظ„طŒ ظƒظ„ ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„طھط´ط؛ظٹظ„ظٹط© | ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© ط§ظ„ط­ط§ظ„ظٹ |
| **localStorage** | ط±ط­ظ„ط§طھ ط§ظ„ط³ظپط±طŒ ظ…ظ‡ط§ظ… ط§ظ„ط¹ظ…ظ„طŒ ظ…ط³ظˆط¯ط© ط§ظ„ط³طھظˆط±ظٹطŒ ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„ط´ط®طµظٹط© | ط¨ظٹط§ظ†ط§طھ ظ…ط­ظ„ظٹط© |
| **Supabase** | Auth ظپظ‚ط· â€” /admin login | ظٹط¹ظ…ظ„ |
| **External API** | ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط© (Aladhan) | ظٹط¹ظ…ظ„ |

---

## ط¬ط¯ظˆظ„ ظ…طµط§ط¯ط± ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„طھظپطµظٹظ„ظٹ

| ط§ظ„طµظپط­ط©/ط§ظ„ظ…ظٹط²ط© | ط§ظ„ظ…طµط¯ط± ط§ظ„ط­ط§ظ„ظٹ | ط¬ط¯ظˆظ„ PostgreSQL (Drizzle) | ط¬ط¯ظˆظ„ Supabase | ط¹ط§ظ…ط©/ط®ط§طµط© | ظٹط­طھط§ط¬ user_id | ظٹط­طھط§ط¬ Migration | ط¯ط±ط¬ط© ط§ظ„ظ…ط®ط§ط·ط± | ط§ظ„ظ‚ط±ط§ط± ط§ظ„ظ…ظ‚طھط±ط­ |
|---|---|---|---|---|---|---|---|---|
| **ط§ظ„ط±ط¦ظٹط³ظٹط© â€” ط±ط³ط§ظ„ط© ط§ظ„ظٹظˆظ…** | PostgreSQL API | `daily_messages` | `daily_messages` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed + ط¨ظٹط§ظ†ط§طھ ط­ط§ظ„ظٹط© |
| **ط§ظ„ط±ط¦ظٹط³ظٹط© â€” ظ…ظˆط§ظ‚ظٹطھ ط§ظ„طµظ„ط§ط©** | Aladhan API ط®ط§ط±ط¬ظٹ | `prayer_times` (cache) | ط؛ظٹط± ظ…ظˆط¬ظˆط¯ | ط¹ط§ظ…ط© | ظ„ط§ | ظ„ط§ | ظ…ظ†ط®ظپط¶ط© | ظٹط¨ظ‚ظ‰ external API |
| **ط§ظ„ط±ط¦ظٹط³ظٹط© â€” ط§ظ„ط¹ط¯ط§ط¯ط§طھ ط§ظ„ظ…ط§ظ„ظٹط©** | PostgreSQL API | `financial_events` | `financial_events` | ظ…ط´طھط±ظƒط© ط­ط§ظ„ظٹط§ظ‹* | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ†ط¹ظ… | ظ…طھظˆط³ط·ط© | migration + ط¥ط¶ط§ظپط© user_id |
| **ط§ظ„طھظ‚ظˆظٹظ… â€” ط§ظ„ظ…ظˆط§ط¹ظٹط¯** | PostgreSQL API | `appointments` | `appointments` | ظ…ط´طھط±ظƒط© ط­ط§ظ„ظٹط§ظ‹* | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ†ط¹ظ… | ظ…طھظˆط³ط·ط© | migration + ط¥ط¶ط§ظپط© user_id |
| **ط§ظ„ظ…ط§ظ„ â€” ط§ظ„ط£ط­ط¯ط§ط« ط§ظ„ظ…ط§ظ„ظٹط©** | PostgreSQL API | `financial_events` | `financial_events` | ظ…ط´طھط±ظƒط© ط­ط§ظ„ظٹط§ظ‹* | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ†ط¹ظ… | ظ…طھظˆط³ط·ط© | migration + ط¥ط¶ط§ظپط© user_id |
| **ط§ظ„ظ…ط§ظ„ â€” ط§ظ„ط­ط§ط³ط¨ط§طھ** | ط­ط³ط§ط¨ط§طھ ظ…ط­ظ„ظٹط© | â€” | â€” | ظ…ط­ظ„ظٹط© | ظ„ط§ | ظ„ط§ | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¨ظ‚ظ‰ ظ…ط­ظ„ظٹط§ظ‹ |
| **ط³طھظˆط±ظٹ ط§ظ„ظٹظˆظ… â€” ط§ظ„ظ‚ظˆط§ظ„ط¨** | PostgreSQL API | `story_templates` | `story_templates` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed + ط¨ظٹط§ظ†ط§طھ ط­ط§ظ„ظٹط© |
| **ط³طھظˆط±ظٹ ط§ظ„ظٹظˆظ… â€” ط§ظ„ظ…ط³ظˆط¯ط©** | localStorage | `mawaeedak_story_v1` | â€” | ظ…ط­ظ„ظٹط© | ظ„ط§ | ظ„ط§ | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¨ظ‚ظ‰ localStorage |
| **ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ** | PostgreSQL API | `notifications` | `notifications` | ظ…ط´طھط±ظƒط© ط­ط§ظ„ظٹط§ظ‹* | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ†ط¹ظ… | ظ…طھظˆط³ط·ط© | migration + ط¥ط¶ط§ظپط© user_id |
| **ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ â€” ط§ظ„طھظپط¶ظٹظ„ط§طھ** | localStorage | â€” | `notification_preferences` | ط®ط§طµط© | ظ†ط¹ظ… | ظ„ط§ (ط¨ظٹط§ظ†ط§طھ ط¬ط¯ظٹط¯ط©) | ظ…ظ†ط®ظپط¶ط© | ط±ط¨ط· ط¨ظ€ Supabase ظ…ط¨ط§ط´ط±ط© |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„ط£ط¹ظ…ط§ظ„** | localStorage | â€” | â€” | ظ…ط­ظ„ظٹط© | ظ„ط§ | ظ„ط§ | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¨ظ‚ظ‰ localStorage |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„ط³ظپط±** | localStorage | `mawaeedak_travel_v1` | â€” | ظ…ط­ظ„ظٹط© | ظ„ط§ | ظ„ط§ | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¨ظ‚ظ‰ localStorage |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„ط¯ط±ط§ط³ط©** | ط­ط³ط§ط¨ط§طھ ظ…ط­ظ„ظٹط© | â€” | â€” | ظ…ط­ظ„ظٹط© | ظ„ط§ | ظ„ط§ | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¨ظ‚ظ‰ ظ…ط­ظ„ظٹط§ظ‹ |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„ط£ط®ط¨ط§ط±** | PostgreSQL API | `news` | `news` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed + ط¨ظٹط§ظ†ط§طھ ط­ط§ظ„ظٹط© |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„ظˆط¸ط§ط¦ظپ** | PostgreSQL API | `jobs` | `jobs` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed + ط¨ظٹط§ظ†ط§طھ ط­ط§ظ„ظٹط© |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„طھظ‡ط§ظ†ظٹ** | ط­ط³ط§ط¨ط§طھ ظ…ط­ظ„ظٹط© | â€” | â€” | ظ…ط­ظ„ظٹط© | ظ„ط§ | ظ„ط§ | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¨ظ‚ظ‰ ظ…ط­ظ„ظٹط§ظ‹ |
| **ظ…ط±ط§ظƒط² â€” ط§ظ„ط´ظƒط§ظˆظ‰** | PostgreSQL API | `complaints` | `complaints` | ظ…ط´طھط±ظƒط© | user_id ط§ط®طھظٹط§ط±ظٹ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | migration |
| **ط­ط³ط§ط¨ظٹ â€” ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ** | localStorage (`app-user`) | â€” | `profiles` | ط®ط§طµط© | ظ†ط¹ظ… | ظ„ط§ (ط¨ظٹط§ظ†ط§طھ ط¬ط¯ظٹط¯ط©) | ظ…ظ†ط®ظپط¶ط© | ط±ط¨ط· ط¨ظ€ Supabase ظ…ط³طھظ‚ط¨ظ„ط§ظ‹ |
| **ط­ط³ط§ط¨ظٹ â€” ط§ظ„ط«ظٹظ…ط§طھ** | PostgreSQL API | `themes` | `themes` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed + ط¨ظٹط§ظ†ط§طھ ط­ط§ظ„ظٹط© |
| **ط­ط³ط§ط¨ظٹ â€” ط§ظ„ط«ظٹظ… ط§ظ„ظ…ط®طھط§ط±** | localStorage (`app-mode`) | â€” | `profiles.theme_preference` | ط®ط§طµط© | ظ†ط¹ظ… | ظ„ط§ (ط¨ظٹط§ظ†ط§طھ ط¬ط¯ظٹط¯ط©) | ظ…ظ†ط®ظپط¶ط© | ط±ط¨ط· ط¨ظ€ Supabase ظ…ط³طھظ‚ط¨ظ„ط§ظ‹ |
| **ط§ظ„ط¥ط¯ط§ط±ط© â€” Auth** | Supabase Auth | â€” | `auth.users` + `user_roles` | ط®ط§طµط© | ظ†ط¹ظ… | طھظ… | ظ„ط§ ظٹظˆط¬ط¯ | ظٹط¹ظ…ظ„ |
| **ط§ظ„ط¥ط¯ط§ط±ط© â€” ط§ظ„ط£ط­ط¯ط§ط«** | PostgreSQL API | `public_events` | `public_events` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed |
| **ط§ظ„ط¥ط¯ط§ط±ط© â€” ط§ظ„ط±ط³ط§ط¦ظ„** | PostgreSQL API | `daily_messages` | `daily_messages` | ط¹ط§ظ…ط© (admin_managed) | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | seed |
| **Audit Logs** | PostgreSQL API | `audit_logs` | `audit_logs` | admin_managed | ظ„ط§ | ظ†ط¹ظ… | ظ…ظ†ط®ظپط¶ط© | migration |

> *ظ…ط´طھط±ظƒط© ط­ط§ظ„ظٹط§ظ‹: ظ„ط§ ظٹظˆط¬ط¯ user_id ظپظٹ schema ط§ظ„ط­ط§ظ„ظٹ â€” ظƒظ„ ط§ظ„ط¨ظٹط§ظ†ط§طھ global

---

## ظپط­طµ ظƒظ„ ط¬ط¯ظˆظ„

### ط¬ط¯ط§ظˆظ„ Drizzle (PostgreSQL ط§ظ„ط­ط§ظ„ظٹ)

| ط§ظ„ط¬ط¯ظˆظ„ | ظپظٹ PostgreSQL | ظپظٹ Supabase | ط¨ظٹط§ظ†ط§طھ ط­ط§ظ„ظٹط© | ظٹط­طھط§ط¬ Migration | user-owned | admin-managed | ظٹط­طھط§ط¬ RLS | ظٹط­طھط§ط¬ Seed |
|---|---|---|---|---|---|---|---|---|
| `appointments` | âœ… 2 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ |
| `financial_events` | âœ… 8 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ |
| `daily_messages` | âœ… 8 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ (ط¹ط§ظ…ط©) | ظ†ط¹ظ… |
| `story_templates` | âœ… 2 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ (ط¹ط§ظ…ط©) | ظ†ط¹ظ… |
| `themes` | âœ… 10 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ (ط¹ط§ظ…ط©) | ظ†ط¹ظ… |
| `notifications` | âœ… 3 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ†ط¹ظ… (ظ…ط³طھظ‚ط¨ظ„ط§ظ‹) | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ |
| `public_events` | âœ… 0 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ„ط§ | ظ†ط¹ظ… (seed) | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ (ط¹ط§ظ…ط©) | ظ†ط¹ظ… |
| `news` | âœ… 2 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ (ط¹ط§ظ…ط©) | ظ†ط¹ظ… |
| `jobs` | âœ… 2 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ (ط¹ط§ظ…ط©) | ظ†ط¹ظ… |
| `complaints` | âœ… 3 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ط§ط®طھظٹط§ط±ظٹ | ظ„ط§ | ظ†ط¹ظ… | ظ„ط§ |
| `audit_logs` | âœ… 28 طµظپ | âœ… ظ…ظˆط¬ظˆط¯ | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ„ط§ | ظ†ط¹ظ… | ظ†ط¹ظ… (admin ظپظ‚ط·) | ظ„ط§ |
| `prayer_times` | âœ… (cache) | â‌Œ ط؛ظٹط± ظ…ظˆط¬ظˆط¯ | cache ظپظ‚ط· | ظ„ط§ | ظ„ط§ | ظ„ط§ | ظ„ط§ | ظ„ط§ |

### ط¬ط¯ط§ظˆظ„ Supabase ظپظ‚ط· (ط؛ظٹط± ظ…ظˆط¬ظˆط¯ط© ظپظٹ Drizzle)

| ط§ظ„ط¬ط¯ظˆظ„ | ظپظٹ PostgreSQL | ظپظٹ Supabase | ط§ظ„ط؛ط±ط¶ | user-owned | admin-managed | ظٹط­طھط§ط¬ Seed |
|---|---|---|---|---|---|---|
| `profiles` | â‌Œ | âœ… | ظ…ظ„ظپ ط§ظ„ظ…ط³طھط®ط¯ظ… ط§ظ„ط´ط®طµظٹ | ظ†ط¹ظ… | ظ„ط§ | ظ„ط§ (auto-created) |
| `roles` | â‌Œ | âœ… | طھط¹ط±ظٹظپ ط§ظ„ط£ط¯ظˆط§ط± | ظ„ط§ | ظ†ط¹ظ… | ظ†ط¹ظ… |
| `permissions` | â‌Œ | âœ… | طھط¹ط±ظٹظپ ط§ظ„طµظ„ط§ط­ظٹط§طھ | ظ„ط§ | ظ†ط¹ظ… | ظ†ط¹ظ… |
| `role_permissions` | â‌Œ | âœ… | ط±ط¨ط· ط¯ظˆط± ط¨طµظ„ط§ط­ظٹط§طھ | ظ„ط§ | ظ†ط¹ظ… | ظ†ط¹ظ… |
| `user_roles` | â‌Œ | âœ… | ط±ط¨ط· ظ…ط³طھط®ط¯ظ… ط¨ط¯ظˆط± | ظ†ط¹ظ… | ظ†ط¹ظ… | ظ†ط¹ظ… (hrqâ†’super_admin) |
| `admin_users` | â‌Œ | âœ… | ظ‚ط§ط¦ظ…ط© ط§ظ„ظ…ط³ط¤ظˆظ„ظٹظ† | ظ„ط§ | ظ†ط¹ظ… | ظ†ط¹ظ… |
| `notification_preferences` | â‌Œ | âœ… | طھظپط¶ظٹظ„ط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ | ظ†ط¹ظ… | ظ„ط§ | ظ„ط§ |
| `app_settings` | â‌Œ | âœ… | ط¥ط¹ط¯ط§ط¯ط§طھ ط§ظ„طھط·ط¨ظٹظ‚ | ظ„ط§ | ظ†ط¹ظ… | ظ†ط¹ظ… |

---

## ط§ظ„ط§ط®طھظ„ط§ظپط§طھ ط§ظ„ط­ط±ط¬ط© ط¨ظٹظ† Schema ط§ظ„ط­ط§ظ„ظٹ ظˆSupabase

| ط§ظ„ط§ط®طھظ„ط§ظپ | ط§ظ„ظˆطµظپ | ط¯ط±ط¬ط© ط§ظ„ط®ط·ظˆط±ط© | ط§ظ„ط­ظ„ ط§ظ„ظ…ظ‚طھط±ط­ |
|---|---|---|---|
| **ط؛ظٹط§ط¨ user_id** | ط¬ط¯ط§ظˆظ„ appointments/financial_events/notifications ظ„ط§ طھط­طھظˆظٹ `user_id` ظپظٹ Drizzle | ط¹ط§ظ„ظٹط© | ط¥ط¶ط§ظپط© ط¹ظ…ظˆط¯ `user_id uuid` + migration |
| **prayer_times** | ظ…ظˆط¬ظˆط¯ ظپظٹ Drizzle ظƒظ€ cacheطŒ ط؛ظٹط± ظ…ظˆط¬ظˆط¯ ظپظٹ Supabase | ظ…ظ†ط®ظپط¶ط© | ظٹط¨ظ‚ظ‰ cache ظ…ط­ظ„ظٹ ط£ظˆ ظٹظڈط­ط°ظپ |
| **ظ†ظˆط¹ ID** | Drizzle ظٹط³طھط®ط¯ظ… `serial` (integer)طŒ Supabase ظٹط³طھط®ط¯ظ… `uuid` | ط¹ط§ظ„ظٹط© | ط§ظ„ط¬ط¯ط§ظˆظ„ ط§ظ„ظ…ط´طھط±ظƒط© طھط­طھط§ط¬ طھط¹ط¯ظٹظ„ ط£ظˆ wrapper |
| **ط¹ط¯ظ… ظˆط¬ظˆط¯ `owner_id`** | Drizzle tables ظ„ظٹط³طھ ظ…ط±ط¨ظˆط·ط© ط¨ظ€ user | ط¹ط§ظ„ظٹط© | ط¥ط¶ط§ظپط© foreign key ظ„ظ€ `auth.users(id)` |
| **created_at type** | Drizzle timestampطŒ Supabase timestamptz | ظ…ظ†ط®ظپط¶ط© | ظ‚ط§ط¨ظ„ ظ„ظ„طھط­ظˆظٹظ„ |

---

## ظ…ظ„ط®طµ ط§ظ„ظ‚ط±ط§ط±ط§طھ

| ط§ظ„طھطµظ†ظٹظپ | ط§ظ„ط¬ط¯ط§ظˆظ„ |
|---|---|
| **ظٹط¨ظ‚ظ‰ ظپظٹ PostgreSQL/Express** (ظ„ط§ طھط؛ظٹظٹط± ط§ظ„ط¢ظ†) | ط§ظ„ظƒظ„ â€” ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© ط§ظ„ط­ط§ظ„ظٹ |
| **ط£ظˆظ„ظˆظٹط© migration ط¹ط§ظ„ظٹط©** | `daily_messages`, `story_templates`, `themes`, `news`, `jobs` (admin-managedطŒ ط¨ظ„ط§ user_id) |
| **ط£ظˆظ„ظˆظٹط© migration ظ…طھظˆط³ط·ط©** | `appointments`, `financial_events`, `notifications`, `complaints` (طھط­طھط§ط¬ user_id) |
| **ظٹط¨ظ‚ظ‰ localStorage** | ظ…ظ‡ط§ظ… ط§ظ„ط¹ظ…ظ„طŒ ط±ط­ظ„ط§طھ ط§ظ„ط³ظپط±طŒ ظ…ط³ظˆط¯ط© ط§ظ„ط³طھظˆط±ظٹطŒ ط§ظ„ط«ظٹظ… ط§ظ„ظ…ط®طھط§ط±طŒ ط§ظ„ظ…ظ„ظپ ط§ظ„ط´ط®طµظٹ |
| **Supabase Auth ظپظ‚ط·** | /admin â€” ظٹط¹ظ…ظ„ ط¨ط§ظ„ظپط¹ظ„ |
| **Supabase ط¬ط§ظ‡ط² ظ„ظ„ط±ط¨ط·** | `profiles`, `notification_preferences` (ط¨ظٹط§ظ†ط§طھ ط¬ط¯ظٹط¯ط©) |

---

## طھط­ط¯ظٹط« Phase 12C â€” Admin Seed Status (2026-05-24)

### ط­ط§ظ„ط© ط¬ط¯ط§ظˆظ„ admin-managed ط¨ط¹ط¯ Phase 12C

| ط§ظ„ط¬ط¯ظˆظ„ | PostgreSQL (ط§ظ„ط­ط§ظ„ظٹ) | Supabase Seed | ط§ظ„ط£ط¹ظ…ط¯ط© ط§ظ„ظ…ظڈط¶ط§ظپط© |
|---|---|---|---|
| `daily_messages` | 8 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | legacy_id, migrated_at, migration_batch |
| `story_templates` | 2 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | legacy_id, migrated_at, migration_batch |
| `themes` | 10 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | legacy_id, migrated_at, migration_batch |
| `news` | 2 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | legacy_id, migrated_at, migration_batch |
| `jobs` | 2 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | legacy_id, migrated_at, migration_batch |
| `public_events` | 0 طµظپ | ظ…طھط¬ط§ظ‡ظ„ | â€” |

**ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط©:** PostgreSQL/Express/Drizzle â€” ظ„ط§ طھط؛ظٹظٹط±

---

## طھط­ط¯ظٹط« Phase 12D â€” User-owned Core Migration Status (2026-05-24)

| ط§ظ„ط¬ط¯ظˆظ„ | PostgreSQL (ط§ظ„ط­ط§ظ„ظٹ) | Supabase Seed | user_id |
|---|---|---|---|
| `appointments` | 2 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | hrq@hotmail.com UUID |
| `financial_events` | 8 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | hrq@hotmail.com UUID |
| `notifications` | ظ„ظ… طھظڈظ†ظ‚ظ„ | â€” | â€” |
| `complaints` | ظ„ظ… طھظڈظ†ظ‚ظ„ | â€” | â€” |

**ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط©:** PostgreSQL/Express/Drizzle â€” ظ„ط§ طھط؛ظٹظٹط±

---

## طھط­ط¯ظٹط« Phase 12D Verification (2026-05-24)

### ط§ظ„ط­ط§ظ„ط© ط§ظ„ظ†ظ‡ط§ط¦ظٹط© ظ„ظƒظ„ ط§ظ„ط¬ط¯ط§ظˆظ„ ظپظٹ Supabase

| ط§ظ„ط¬ط¯ظˆظ„ | PostgreSQL | Supabase | user_id | ط§ظ„ط­ظƒظ… |
|---|---|---|---|---|
| `appointments` | 2 طµظپ âœ… | 2 طµظپ âœ… | hrq UUID âœ… | Applied |
| `financial_events` | 8 طµظپ âœ… | 8 طµظپ âœ… | hrq UUID âœ… | Applied |
| `notifications` | 3 طµظپ | 0 طµظپ | â€” | âڈ³ Phase 12E |
| `complaints` | 3 طµظپ | 0 طµظپ | â€” | âڈ³ Phase 12E |
| `daily_messages` | 8 طµظپ âœ… | 8 طµظپ âœ… | â€” | Applied (12C) |
| `themes` | 10 طµظپ âœ… | 10 طµظپ âœ… | â€” | Applied (12C) |
| `news` | 2 طµظپ âœ… | 2 طµظپ âœ… | â€” | Applied (12C) |
| `jobs` | 2 طµظپ âœ… | 2 طµظپ âœ… | â€” | Applied (12C) |
| `story_templates` | 2 طµظپ âœ… | 2 طµظپ âœ… | â€” | Applied (12C) |

**ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© ط§ظ„ط­ط§ظ„ظٹ:** PostgreSQL/Express/Drizzle â€” ظ„ط§ طھط؛ظٹظٹط± ط­طھظ‰ Phase 12F

---

## طھط­ط¯ظٹط« Phase 12E â€” Support Data Migration Ready (2026-05-24)

| ط§ظ„ط¬ط¯ظˆظ„ | PostgreSQL | Supabase | user_id | ط§ظ„ط­ظƒظ… |
|---|---|---|---|---|
| `notifications` | 3 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | hrq UUID | Needs SQL Run |
| `complaints` | 3 طµظپ âœ… | SQL ط¬ط§ظ‡ط² âڈ³ | NULL | Needs SQL Run |
| `appointments` | 2 طµظپ âœ… | 2 طµظپ âœ… | hrq UUID âœ… | Applied (12D) |
| `financial_events` | 8 طµظپ âœ… | 8 طµظپ âœ… | hrq UUID âœ… | Applied (12D) |

**ط¨ط¹ط¯ طھط´ط؛ظٹظ„ 12E: ط¥ط¬ظ…ط§ظ„ظٹ Supabase = 40 طµظپ**
**ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© ط§ظ„ط­ط§ظ„ظٹ:** PostgreSQL/Express/Drizzle â€” ظ„ط§ طھط؛ظٹظٹط± ط­طھظ‰ Phase 12F

---

## طھط­ط¯ظٹط« Phase 12E Verification (2026-05-24)

### ط§ظ„ط­ط§ظ„ط© ط§ظ„ظ†ظ‡ط§ط¦ظٹط© ظ„ظƒظ„ ط§ظ„ط¬ط¯ط§ظˆظ„ ظپظٹ Supabase â€” 40 طµظپ

| ط§ظ„ط¬ط¯ظˆظ„ | PostgreSQL | Supabase | user_id | ط§ظ„ط­ظƒظ… |
|---|---|---|---|---|
| `daily_messages` | 8 âœ… | 8 âœ… | â€” | Applied (12C) |
| `story_templates` | 2 âœ… | 2 âœ… | â€” | Applied (12C) |
| `themes` | 10 âœ… | 10 âœ… | â€” | Applied (12C) |
| `news` | 2 âœ… | 2 âœ… | â€” | Applied (12C) |
| `jobs` | 2 âœ… | 2 âœ… | â€” | Applied (12C) |
| `appointments` | 2 âœ… | 2 âœ… | hrq UUID âœ… | Applied (12D) |
| `financial_events` | 8 âœ… | 8 âœ… | hrq UUID âœ… | Applied (12D) |
| `notifications` | 3 âœ… | 3 âœ… | hrq UUID âœ… | Applied (12E) |
| `complaints` | 3 âœ… | 3 âœ… | NULL âœ… | Applied (12E) |

**ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© ط§ظ„ط­ط§ظ„ظٹ:** PostgreSQL/Express/Drizzle â€” ظ„ط§ طھط؛ظٹظٹط± ط­طھظ‰ Phase 12F

---

## طھط­ط¯ظٹط« Phase 12F â€” Supabase Shadow Read (2026-05-24)

### Data Layer Architecture

```
ط§ظ„ط­ط§ظ„ظٹ (Phase 12F):
  UI â†’ Orval hooks â†’ Express API â†’ PostgreSQL
                                     â†‘
                              ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط©

Shadow (ط¹ظ†ط¯ VITE_DATA_SOURCE_MODE=supabase_shadow):
  UI â†’ Orval hooks â†’ Express API â†’ PostgreSQL  â†گ ظٹظڈط¹ط±ط¶ ظ„ظ„ظ…ط³طھط®ط¯ظ…
  supabaseData.ts â†’ Supabase DB               â†گ ظ…ظ‚ط§ط±ظ†ط© ظپظ‚ط·

ط§ظ„ظ‚ط§ط¯ظ… (Phase 12G):
  UI â†’ supabaseData.ts â†’ Supabase DB  â†گ ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© ط§ظ„ط¬ط¯ظٹط¯
```

### ط§ظ„ظ…ظ„ظپط§طھ ط§ظ„ط¬ط¯ظٹط¯ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„ط¯ظˆط± |
|---|---|
| `src/lib/dataSourceMode.ts` | Feature flag ("api" ط§ظپطھط±ط§ط¶ظٹط§ظ‹) |
| `src/lib/supabaseData.ts` | 9 ط¯ظˆط§ظ„ ظ‚ط±ط§ط،ط© + runShadowComparison |

### Shadow Comparison ط§ظ„ظ…طھظˆظ‚ط¹ (API = Supabase = 40 طµظپ)

| ط§ظ„ط¬ط¯ظˆظ„ | API | Supabase | Match |
|---|---|---|---|
| daily_messages | 8 | 8 | âœ… |
| story_templates | 2 | 2 | âœ… |
| themes | 10 | 10 | âœ… |
| news | 2 | 2 | âœ… |
| jobs | 2 | 2 | âœ… |
| appointments | 2 | 2 | âœ… |
| financial_events | 8 | 8 | âœ… |
| notifications | 3 | 3 | âœ… |
| complaints | 3 | 3 | âœ… |

**ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط©:** PostgreSQL/Express/Drizzle â€” ظ„ط§ طھط؛ظٹظٹط± ط­طھظ‰ Phase 12G

---

## طھط­ط¯ظٹط« Phase 12G â€” Data Gateway Cutover (2026-05-24)

### ط§ظ„ظ…ظ„ظپط§طھ ط§ظ„ط¬ط¯ظٹط¯ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„ط¯ظˆط± |
|---|---|
| `src/lib/dataGateway.ts` | Data Gateway â€” ظٹظˆط¬ظ‘ظ‡ ط§ظ„ظ‚ط±ط§ط،ط© ط­ط³ط¨ ط§ظ„ظˆط¶ط¹ |
| `src/features/admin/AdminDataLayer.tsx` | ظ„ظˆط­ط© ظ…ظ‚ط§ط±ظ†ط© ط·ط¨ظ‚ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ظپظٹ /admin/data-layer |

### Data Gateway â€” gwGet functions

| ط§ظ„ط¯ط§ظ„ط© | API Path | Supabase Reader |
|---|---|---|
| `gwGetDailyMessages` | /api/daily-messages | getDailyMessagesFromSupabase |
| `gwGetStoryTemplates` | /api/story-templates | getStoryTemplatesFromSupabase |
| `gwGetThemes` | /api/themes | getThemesFromSupabase |
| `gwGetNews` | /api/news | getNewsFromSupabase |
| `gwGetJobs` | /api/jobs | getJobsFromSupabase |
| `gwGetAppointments` | /api/appointments | getAppointmentsFromSupabase |
| `gwGetFinancialEvents` | /api/financial-events | getFinancialEventsFromSupabase |
| `gwGetNotifications` | /api/notifications | getNotificationsFromSupabase |
| `gwGetComplaints` | /api/complaints | getComplaintsFromSupabase |

### ظ‚ط±ط§ط± Mutations

**Read Cutover ظپظ‚ط·** â€” ظƒظ„ ط¹ظ…ظ„ظٹط§طھ POST/PATCH/DELETE طھط¨ظ‚ظ‰ ط¹ظ„ظ‰ API/PostgreSQL.
ط§ظ„ط­ظƒظ…: **Supabase Read Cutover Ready** ظˆظ„ظٹط³ Full Supabase Data Source.

### Data Flow ط§ظ„ظ…ط¹طھظ…ط¯

```
mode=api (ط§ظ„ط§ظپطھط±ط§ط¶ظٹ):
  ط؛ظٹط± ظ…طھط£ط«ط± â€” Orval hooks â†’ Express API â†’ PostgreSQL

mode=supabase_shadow:
  Orval hooks â†’ Express API â†’ PostgreSQL (ظ„ظ„ظˆط§ط¬ظ‡ط©)
  gwRunShadowComparison â†’ Supabase (ظ…ظ‚ط§ط±ظ†ط© ظپظٹ /admin/data-layer)

mode=supabase:
  gwGet* â†’ Supabase â†’ PostgreSQL/API (fallback)
  Mutations: Express API â†’ PostgreSQL (ظ„ظ… طھطھط؛ظٹط±)
```

---

## طھط­ط¯ظٹط« Phase 12H â€” Frontend Read Gateway Integration (2026-05-24)

### ظ…ظ„ظپ ط¬ط¯ظٹط¯

| ط§ظ„ظ…ظ„ظپ | ط§ظ„ط¯ظˆط± |
|---|---|
| `src/hooks/useGatewayData.ts` | React Query hooks طھط؛ظ„ظ‘ظپ gwGet* ظ„ظ„ظ‚ط±ط§ط،ط© |

### طھطµظ†ظٹظپ ط§ظ„طµظپط­ط§طھ

| ط§ظ„طµظپط­ط© | ظ…طµط¯ط± ط§ظ„ظ‚ط±ط§ط،ط© | ظ…طµط¯ط± ط§ظ„ظƒطھط§ط¨ط© | ط§ظ„ظ…ظ„ط§ط­ط¸ط© |
|---|---|---|---|
| CentersNewsPage | Gateway (gw:news) | â€” | read-only âœ… |
| CentersJobsPage | Gateway (gw:jobs) | â€” | read-only âœ… |
| AccountPage | Gateway (gw:themes) | localStorage | theme âœ… |
| StoryPage | Gateway (gw:story-templates) + Orval | localStorage | templates âœ… |
| CalendarPage | Orval â†’ API | Orval â†’ API | Phase 12I |
| FinancePage | Orval â†’ API | Orval â†’ API | Phase 12I |
| NotificationsPage | Orval â†’ API | Orval â†’ API | Phase 12I |
| HomePage | Orval â†’ API | â€” | Phase 12I |
| Admin pages | Orval â†’ API | Orval â†’ API | Phase 12I |

---

## طھط­ط¯ظٹط« Phase 12I â€” Controlled Write Cutover (2026-05-24)

### ظ…ظ„ظپط§طھ ط¬ط¯ظٹط¯ط© / ظ…ط­ط¯ظ‘ط«ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„طھط؛ظٹظٹط± |
|---|---|
| `src/lib/supabaseData.ts` | WriteResult + markNotificationReadInSupabase + markAllNotificationsReadInSupabase |
| `src/lib/dataGateway.ts` | gwMarkNotificationRead + gwMarkAllNotificationsRead |
| `src/features/admin/AdminDataLayer.tsx` | Write Test UI + mutations inventory |

### ط³ظٹط§ط³ط© ط§ظ„ظƒطھط§ط¨ط© ط§ظ„ظƒط§ظ…ظ„ط©

| ط§ظ„طµظپط­ط© / ط§ظ„ط¬ط¯ظˆظ„ | ط§ظ„ظ‚ط±ط§ط،ط© | ط§ظ„ظƒطھط§ط¨ط© | ط§ظ„ظˆط¶ط¹ |
|---|---|---|---|
| notifications (gateway test) | â€” | gwMarkNotificationRead â†’ Supabase (mode=supabase) | Write Gateway |
| NotificationsPage | Orval â†’ API | Orval â†’ API | Phase 12J |
| CalendarPage | Orval â†’ API | Orval â†’ API | Phase 12J |
| FinancePage | Orval â†’ API | Orval â†’ API | Phase 12J |
| Admin pages | Orval â†’ API | Orval â†’ API | Phase 12J |
| CentersNewsPage | Gateway â†’ Supabase/API | â€” | read-only |
| CentersJobsPage | Gateway â†’ Supabase/API | â€” | read-only |
| AccountPage | Gateway â†’ Supabase/API | localStorage | read-only |
| StoryPage | Gateway â†’ Supabase/API | localStorage | read-only |

---

## طھط­ط¯ظٹط« Phase 12J â€” Notifications Read+Write Consistency (2026-05-24)

### ظ…ظ„ظپط§طھ ظ…ظڈط¹ط¯ظژظ‘ظ„ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„طھط؛ظٹظٹط± |
|---|---|
| `src/lib/supabaseData.ts` | deleteNotificationInSupabase |
| `src/lib/dataGateway.ts` | gwDeleteNotification |
| `src/features/notifications/NotificationsPage.tsx` | Gateway read+write |

### ط®ط±ظٹط·ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظ…ط­ط¯ظژظ‘ط«ط©

| ط§ظ„طµظپط­ط© | ط§ظ„ظ‚ط±ط§ط،ط© | ط§ظ„ظƒطھط§ط¨ط© | ظ…ظ„ط§ط­ط¸ط© |
|---|---|---|---|
| NotificationsPage | useGatewayNotifications | gwMark*/gwDelete | âœ… ظ…طھط³ظ‚ Phase 12J |
| TopBar (ط¹ط¯ط§ط¯) | useGatewayUnreadCount | â€” | âœ… 12K |
| AdminNotifications | useGatewayNotifications | deleteâ†’Gateway / sendâ†’API | âœ… 12K |
| CentersNewsPage | useGatewayNews | â€” | read-only âœ… |
| CentersJobsPage | useGatewayJobs | â€” | read-only âœ… |
| AdminNewsJobs | useGatewayNews + useGatewayJobs | gwCreate/Update/Delete News/Job | âœ… 12L |
| AccountPage | useGatewayThemes | localStorage | read-only âœ… |
| StoryPage | useGatewayStoryTemplates | localStorage | read-only âœ… |
| CalendarPage | Orval â†’ API | Orval â†’ API | âڈ³ Phase 12M+ |
| FinancePage | Orval â†’ API | Orval â†’ API | âڈ³ Phase 12M+ |

---

## طھط­ط¯ظٹط« Phase 12L â€” Admin News/Jobs CRUD Gateway (2026-05-25)

### ظ…ظ„ظپط§طھ ظ…ظڈط¹ط¯ظژظ‘ظ„ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„طھط؛ظٹظٹط± |
|---|---|
| `src/lib/supabaseData.ts` | 6 ط¯ظˆط§ظ„ ط¬ط¯ظٹط¯ط©: createNewsInSupabase / updateNewsInSupabase / deleteNewsInSupabase / createJobInSupabase / updateJobInSupabase / deleteJobInSupabase + NewsPayload + JobPayload |
| `src/lib/dataGateway.ts` | imports ظ…ط­ط¯ظژظ‘ط«ط© + gwCreateNews / gwUpdateNews / gwDeleteNews / gwCreateJob / gwUpdateJob / gwDeleteJob (6 ط¯ظˆط§ظ„) |
| `src/features/admin/AdminNewsJobs.tsx` | ط¥ط¹ط§ط¯ط© ظƒطھط§ط¨ط© ظƒط§ظ…ظ„ط© â€” read: useGatewayNews/useGatewayJobs / write: gw* async functions |

### ط³ظ„ظˆظƒ AdminNewsJobs ط¨ط¹ط¯ Phase 12L

| ط§ظ„ط¹ظ…ظ„ظٹط© | mode=api | mode=supabase_shadow | mode=supabase |
|---|---|---|---|
| ظ‚ط±ط§ط،ط© news/jobs | API (Gateway hook) | API (Gateway hook) | Supabase |
| ط¥ط¶ط§ظپط© ط®ط¨ط±/ظˆط¸ظٹظپط© | POST /api/news|jobs | POST /api/news|jobs | Supabase INSERT |
| طھط¹ط¯ظٹظ„ ط®ط¨ط±/ظˆط¸ظٹظپط© | PATCH /api/news|jobs/:id | PATCH /api/news|jobs/:id | Supabase UPDATE |
| ط­ط°ظپ ط®ط¨ط±/ظˆط¸ظٹظپط© | DELETE /api/news|jobs/:id | DELETE /api/news|jobs/:id | Supabase DELETE |
| ظپط´ظ„ write ط¹ظ†ط¯ supabase | â€” | â€” | toast ط®ط·ط£ طµط±ظٹط­ (ظ„ط§ fallback طµط§ظ…طھ) |

### ط®ط±ظٹط·ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظƒط§ظ…ظ„ط© ط¨ط¹ط¯ Phase 12L

| ط§ظ„طµظپط­ط© | ط§ظ„ظ‚ط±ط§ط،ط© | ط§ظ„ظƒطھط§ط¨ط© | ط§ظ„ط§طھط³ط§ظ‚ |
|---|---|---|---|
| TopBar | useGatewayUnreadCount | â€” | âœ… 12K |
| NotificationsPage | useGatewayNotifications | gw* writes | âœ… 12J |
| AdminNotifications | useGatewayNotifications | deleteâ†’Gateway / sendâ†’API | âœ… 12K |
| CentersNewsPage | useGatewayNews | â€” | âœ… read-only |
| CentersJobsPage | useGatewayJobs | â€” | âœ… read-only |
| AdminNewsJobs | useGatewayNews + useGatewayJobs | gwCreate/Update/Delete News/Job | âœ… 12L |
| AdminThemes | useGatewayThemes | gwUpdateTheme | âœ… 12M |
| AdminStory | useGatewayStoryTemplates | gwCreate/Update/Delete StoryTemplate | âœ… 12M |
| AdminMessages | useGatewayDailyMessages | gwCreate/Update/Delete DailyMessage | âœ… 12M |
| AccountPage | useGatewayThemes | localStorage | âœ… |
| StoryPage | useGatewayStoryTemplates | localStorage | âœ… |
| CalendarPage | useGatewayAppointments | gwCreate/Update/Delete Appointment | âœ… 12N |
| HomePage (upcoming) | useGatewayUpcomingAppointments | gwCreateAppointment | âœ… 12N |
| FinancePage | useGatewayFinancialCountdown | gwCreate/Update/Delete FinancialEvent | âœ… 12O |
| HomePage (countdown) | useGatewayFinancialCountdown | â€” | âœ… 12O |
| StoryPage (counters) | useGatewayFinancialCountdown | â€” | âœ… 12O |

### Divergence ط§ظ„ظ…طھط¨ظ‚ظٹ ط¨ط¹ط¯ Phase 12M

| ط§ظ„ظ†ط·ط§ظ‚ | ط§ظ„ظˆط¶ط¹ | ط§ظ„ظ…ط®ط§ط·ط±ط© |
|---|---|---|
| CalendarPage CRUD | Orval/API ظپظ‚ط· | ظ…طھظˆط³ط·ط© (appointments â€” user-owned) |
| FinancePage CRUD | Orval/API ظپظ‚ط· | ظ…طھظˆط³ط·ط© (financial_events â€” user-owned) |
| AdminNotifications send | API ظپظ‚ط· (fan-out) | ظ…ظ†ط®ظپط¶ط© (ظ…ظˆط«ظژظ‘ظ‚ ط¹ظ…ط¯ط§ظ‹) |

---

## طھط­ط¯ظٹط« Phase 12M â€” Admin Content CRUD Gateway (2026-05-25)

### ظ…ظ„ظپط§طھ ظ…ظڈط¹ط¯ظژظ‘ظ„ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„طھط؛ظٹظٹط± |
|---|---|
| `src/lib/supabaseData.ts` | ThemeUpdatePayload + updateThemeInSupabase / StoryTemplatePayload + 3 ط¯ظˆط§ظ„ / DailyMessagePayload + 3 ط¯ظˆط§ظ„ |
| `src/lib/dataGateway.ts` | 7 gateway functions ط¬ط¯ظٹط¯ط© + imports |
| `src/features/admin/AdminThemes.tsx` | useGatewayThemes + gwUpdateTheme |
| `src/features/admin/AdminStory.tsx` | useGatewayStoryTemplates + gw* |
| `src/features/admin/AdminMessages.tsx` | useGatewayDailyMessages + gw* |

### ط®ط±ظٹط·ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظƒط§ظ…ظ„ط© ط¨ط¹ط¯ Phase 12M

| ط§ظ„طµظپط­ط© | ط§ظ„ظ‚ط±ط§ط،ط© | ط§ظ„ظƒطھط§ط¨ط© | ط§ظ„ط§طھط³ط§ظ‚ |
|---|---|---|---|
| TopBar | useGatewayUnreadCount | â€” | âœ… 12K |
| NotificationsPage | useGatewayNotifications | gw* writes | âœ… 12J |
| AdminNotifications | useGatewayNotifications | deleteâ†’Gateway / sendâ†’API | âœ… 12K |
| CentersNewsPage | useGatewayNews | â€” | âœ… read-only |
| CentersJobsPage | useGatewayJobs | â€” | âœ… read-only |
| AdminNewsJobs | useGatewayNews + useGatewayJobs | gwCreate/Update/Delete | âœ… 12L |
| AdminThemes | useGatewayThemes | gwUpdateTheme | âœ… 12M |
| AdminStory | useGatewayStoryTemplates | gwCreate/Update/Delete | âœ… 12M |
| AdminMessages | useGatewayDailyMessages | gwCreate/Update/Delete | âœ… 12M |
| AccountPage | useGatewayThemes | localStorage | âœ… |
| StoryPage | useGatewayStoryTemplates | localStorage | âœ… |
| CalendarPage | useGatewayAppointments | gwCreate/Update/Delete Appointment | âœ… 12N |
| HomePage (upcoming) | useGatewayUpcomingAppointments | gwCreateAppointment | âœ… 12N |
| FinancePage | useGatewayFinancialCountdown | gwCreate/Update/Delete FinancialEvent | âœ… 12O |
| HomePage (countdown) | useGatewayFinancialCountdown | â€” | âœ… 12O |
| StoryPage (counters) | useGatewayFinancialCountdown | â€” | âœ… 12O |

---

## طھط­ط¯ظٹط« Phase 12K â€” Notification System Full Consistency (2026-05-25)

### ظ…ظ„ظپط§طھ ظ…ظڈط¹ط¯ظژظ‘ظ„ط©

| ط§ظ„ظ…ظ„ظپ | ط§ظ„طھط؛ظٹظٹط± |
|---|---|
| `src/lib/supabaseData.ts` | `getUnreadNotificationsCountFromSupabase()` |
| `src/lib/dataGateway.ts` | `gwGetUnreadNotificationsCount()` |
| `src/hooks/useGatewayData.ts` | `gwQueryKeys.unreadCount` + `useGatewayUnreadCount()` |
| `src/components/layout/TopBar.tsx` | Gateway hook ظ„ظ„ط¹ط¯ط§ط¯ |
| `src/features/admin/AdminNotifications.tsx` | Gateway read + delete |

### ط®ط±ظٹط·ط© ظ†ط¸ط§ظ… ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظƒط§ظ…ظ„ط©

| ط§ظ„ظ…ظƒظˆظ‘ظ† | ط§ظ„ظ‚ط±ط§ط،ط© | ط§ظ„ظƒطھط§ط¨ط© | Gateway Key |
|---|---|---|---|
| TopBar | useGatewayUnreadCount | â€” | ['gw','unread-count'] |
| NotificationsPage | useGatewayNotifications | gw* functions | ['gw','notifications'] |
| AdminNotifications | useGatewayNotifications | gwDeleteNotification / useCreateNotification | ['gw','notifications'] |

### ط®ط±ظٹط·ط© ط§ظ„ط¨ظٹط§ظ†ط§طھ ط§ظ„ظƒط§ظ…ظ„ط© ط¨ط¹ط¯ Phase 12K

| ط§ظ„طµظپط­ط© | ط§ظ„ظ‚ط±ط§ط،ط© | ط§ظ„ظƒطھط§ط¨ط© | ط§ظ„ط§طھط³ط§ظ‚ |
|---|---|---|---|
| TopBar | Gateway unreadCount | â€” | âœ… 12K |
| NotificationsPage | Gateway notifications | Gateway writes | âœ… 12J |
| AdminNotifications | Gateway notifications | deleteâ†’Gateway / sendâ†’API | âœ… 12K |
| CentersNewsPage | Gateway news | â€” | âœ… read-only |
| CentersJobsPage | Gateway jobs | â€” | âœ… read-only |
| AccountPage | Gateway themes | localStorage | âœ… |
| StoryPage | Gateway story-templates | localStorage | âœ… |
| CalendarPage | Orval â†’ API | Orval â†’ API | âڈ³ Phase 12L |
| FinancePage | Orval â†’ API | Orval â†’ API | âڈ³ Phase 12L |

---

## Phase 12P: Final Gateway Coverage Summary (2026-05-25)

### Gateway Complete (ظ‚ط±ط§ط،ط© + ظƒطھط§ط¨ط© â€” mode-aware)

| ط§ظ„ظ†ط·ط§ظ‚ | ط§ظ„طµظپط­ط§طھ | ط§ظ„ظ…ط±ط­ظ„ط© |
|---|---|---|
| appointments | CalendarPage + HomePage (upcoming) | 12N |
| financial_events | FinancePage + HomePage (countdown) + StoryPage | 12O |
| notifications | NotificationsPage + TopBar + AdminNotifications | 12J/12K |
| news | CentersNewsPage + AdminNewsJobs | 12H/12L |
| jobs | CentersJobsPage + AdminNewsJobs | 12H/12L |
| themes | AccountPage + AdminThemes | 12H/12M |
| story_templates | StoryPage + AdminStory | 12H/12M |
| daily_messages | HomePage + StoryPage + AdminMessages | 12H/12M |
| complaints | AdminDataLayer (read) | 12G |

### API Intentionally (ظ„ط§ طھط­ظˆظٹظ„ ظ…ط®ط·ط· â€” ظ…ظˆط«ظ‚)

| ط§ظ„ظ†ط·ط§ظ‚ | ط§ظ„ط³ط¨ط¨ |
|---|---|
| prayer_times | server-computed â€” ظ„ط§ ظ…ظƒط§ظپط¦ Supabase |
| today_message | server-computed â€” ظ„ط§ ظ…ظƒط§ظپط¦ Supabase |
| admin stats | server-computed aggregate |
| audit_logs | server-only trail |
| public_events | ظ„ظٹط³ ظپظٹ Supabase schema |
| AdminFinancial CRUD | admin view ظƒظ„ users â€” ظ„ط§ RLS |
| notification send | fan-out server-side |
| complaints write | Orval form â†’ API ظ…ط¨ط§ط´ط±ط© |

### Remaining Orval Imports (ظ…ظ‚ط¨ظˆظ„ â€” ظ„ط§ data fetching)

| ط§ظ„ظ…ظ„ظپ | ط§ظ„ط§ط³طھط®ط¯ط§ظ… | ط§ظ„ط³ط¨ط¨ |
|---|---|---|
| CalendarPage | getListAppointmentsQueryKey, type Appointment | cache invalidation + type ظپظ‚ط· |
| NotificationsPage | getGetUnreadNotificationsCountQueryKey | cache invalidation ظپظ‚ط· |
| AdminMessages/Story/Themes | get*QueryKey | cache invalidation ظپظ‚ط· |
| AdminNewsJobs | getListNewsQueryKey, getListJobsQueryKey | cache invalidation ظپظ‚ط· |

## Phase 4 Live Env/RLS Gate - 2026-06-01

Runtime env availability for this Codex session is MISSING for `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ADMIN_API_TOKEN`, and `SUPABASE_JWT_SECRET`. `SUPABASE_SERVICE_ROLE_KEY` is also missing and is not referenced by the current server guard.

Data-source proof status:

| Data path | Status | Evidence |
|---|---|---|
| PostgreSQL via `DATABASE_URL` | Blocked | Secret missing, DB connection cannot run |
| Supabase REST via anon key | Blocked | Supabase URL/key missing |
| Official financial override mutation | Blocked | Admin live auth and DB unavailable |
| Public active override read path | Blocked | No live override can be created/read |
| Audit logs | Blocked | Admin mutation cannot run |
| Frontend service-role exposure | PASS | `work/phase4-admin-smoke.cjs` found no frontend source/bundle service-role references after rebuild |

Build/typecheck status: `pnpm install --frozen-lockfile`, `pnpm run typecheck`, and `pnpm run build` pass in this runtime after the Windows-safe package script and platform-native dependency fixes.

Latest live proof update: env, DB, Supabase REST, frontend exposure scan, and guest mutation denial pass. Admin mutation/audit proof remains blocked by live schema drift: `financial_events.name_ar` is required in the live database but not satisfied by the current app/smoke payload.

