# Environment Variables â€” ظ…ظˆط§ط¹ظٹط¯ظƒ

## ط§ظ„ظ…ط·ظ„ظˆط¨ ط­ط§ظ„ظٹط§ظ‹ (API/PostgreSQL)

| ط§ظ„ظ…طھط؛ظٹط± | ط§ظ„ظˆطµظپ | ظ…ط·ظ„ظˆط¨ |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | âœ… ظ†ط¹ظ… |
| `SESSION_SECRET` | Express session secret (ط¹ط´ظˆط§ط¦ظٹ ظˆط·ظˆظٹظ„) | âœ… ظ†ط¹ظ… |

## Supabase (ظ…ظپط¹ظ‘ظ„ â€” Phase 12)

| ط§ظ„ظ…طھط؛ظٹط± | ط§ظ„ظˆطµظپ | ظ…ظ„ط§ط­ط¸ط© |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | ط¢ظ…ظ† ظ„ظ„ظˆط§ط¬ظ‡ط© â€” VITE_ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key | ط¢ظ…ظ† ظ„ظ„ظˆط§ط¬ظ‡ط© ظ…ط¹ RLS â€” VITE_ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | **ط®ط§ط¯ظ… ظپظ‚ط· â€” ظ„ط§ طھط¶ط¹ظ‡ ظƒظ€ VITE_** |
| `SUPABASE_URL` | ظ†ظپط³ ظ‚ظٹظ…ط© `VITE_SUPABASE_URL` â€” ظ„ظ„ط®ط§ط¯ظ… | ظٹط³طھط®ط¯ظ…ظ‡ط§ `requireAdmin` ظ„ظ„طھط­ظ‚ظ‚ ظ…ظ† JWT ط§ظ„ظ…ط§ظ„ظƒ |
| `SUPABASE_ANON_KEY` | ظ†ظپط³ ظ‚ظٹظ…ط© `VITE_SUPABASE_ANON_KEY` â€” ظ„ظ„ط®ط§ط¯ظ… | apikey ظ„ط·ظ„ط¨ `/auth/v1/user` ظپظٹ `requireAdmin` |

> **طھط­ط°ظٹط± ط£ظ…ظ†ظٹ**: ظ„ط§ طھط¶ط¹ `SUPABASE_SERVICE_ROLE_KEY` ظپظٹ ط£ظٹ ظ…طھط؛ظٹط± ظٹط¨ط¯ط£ ط¨ظ€ `VITE_`. ظ‡ط°ط§ ط§ظ„ظ…طھط؛ظٹط± ظٹظڈط¯ظ…ط¬ ظپظٹ bundle ط§ظ„ظˆط§ط¬ظ‡ط© ظˆظٹطµط¨ط­ ط¹ط§ظ…ط§ظ‹ ظ„ظ„ط¬ظ…ظٹط¹. ط§ط³طھط®ط¯ظ…ظ‡ ظپظٹ `api-server` ظپظ‚ط·.
>
> **ط­ظ…ط§ظٹط© ط§ظ„ط¥ط¯ط§ط±ط© (server-side)**: ط§ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„ط¥ط¯ط§ط±ظٹط© ظپظٹ Express (`/api/admin/stats`طŒ `/api/audit-logs`طŒ `PUT /api/settings/default-theme`طŒ `PATCH /api/themes/:id`) ظ…ط­ظ…ظٹط© ط¨ظ€ middleware `requireAdmin`. ظٹطھط­ظ‚ظ‚ ظ…ظ† Bearer JWT ط¹ط¨ط± `${SUPABASE_URL}/auth/v1/user` ظˆظٹط³ظ…ط­ ظپظ‚ط· ط¨ط§ظ„ط£ط¯ظˆط§ط± `admin` / `super_admin`. ط¨ط¯ظˆظ† `SUPABASE_URL` + `SUPABASE_ANON_KEY` ظپظٹ ط§ظ„ط®ط§ط¯ظ… ظٹط±ط¬ط¹ 503.

## Data Source Mode (Phase 12)

| ط§ظ„ظ…طھط؛ظٹط± | ط§ظ„ظ‚ظٹظ… | ط§ظ„ظˆطµظپ |
|---|---|---|
| `VITE_DATA_SOURCE_MODE` | `api` (ط§ظپطھط±ط§ط¶ظٹ) | PostgreSQL/Express |
| `VITE_DATA_SOURCE_MODE` | `supabase_shadow` | API ظ„ظ„ط¹ط±ط¶ + Supabase ظ„ظ„ظ…ظ‚ط§ط±ظ†ط© |
| `VITE_DATA_SOURCE_MODE` | `supabase` | Supabase ظ…طµط¯ط± ط§ظ„ط­ظ‚ظٹظ‚ط© (ط¥ظ†طھط§ط¬) |

**ظ„ظ„ط¥ظ†طھط§ط¬ ظ…ط¹ Supabase:**
```
VITE_DATA_SOURCE_MODE=supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**ظ…ظ„ط§ط­ط¸ط©:** ط§ظ„ط§ظپطھط±ط§ط¶ظٹ `api` ظ„ظ„ط³ظ„ط§ظ…ط© â€” ظ„ط§ ظٹطھط؛ظٹط± ط¯ط§ط®ظ„ ط§ظ„ظƒظˆط¯. ظٹظڈط¶ط¨ط· ظپظ‚ط· ط¹ط¨ط± env.

## Firebase (ظ…ط³طھظ‚ط¨ظ„ظٹ â€” ط§ط®طھظٹط§ط±ظٹ ظ„ظ„ظ€ Push Notifications)

| ط§ظ„ظ…طھط؛ظٹط± | ط§ظ„ظˆطµظپ |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_VAPID_KEY` | VAPID key ظ„ظ„ظ€ Push |

## ظ…ظ„ط§ط­ط¸ط§طھ

- `PORT` ظٹظڈظˆظپظژظ‘ط± طھظ„ظ‚ط§ط¦ظٹط§ظ‹ ظ…ظ† workflow â€” ظ„ط§ طھط­طھط§ط¬ طھط¹ظٹظٹظ†ظ‡ ظپظٹ `.env`
- `BASE_PATH` ظƒط°ظ„ظƒ ظٹظڈظˆظپظژظ‘ط± ظ…ظ† workflow
- ط§ظ†ط¸ط± `.env.example` ظ„ظ†ظ…ظˆط°ط¬ ظƒط§ظ…ظ„
- ط£ظٹ ظ‚ظٹظ…ط© ط؛ظٹط± طµط­ظٹط­ط© ظ„ظ€ `VITE_DATA_SOURCE_MODE` طھظڈط¹ظٹط¯ `api` طھظ„ظ‚ط§ط¦ظٹط§ظ‹

