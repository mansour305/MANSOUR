# Push Notifications Implementation

**Last Updated**: 2026-06-12
**Status**: Code Ready â€” Deployment Setup Required

---

## Overview

Mawaeedak implements Web Push Notifications using the Push API and Web Push protocol. This allows notifications to be delivered to users even when the app is closed.

**Important**: This is Web Push only. No native mobile code (Flutter, React Native, etc.) is used.

---

## Architecture

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚                        Browser                                   â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ    â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ   â”‚
â”‚  â”‚  Service    â”‚    â”‚  Push       â”‚    â”‚  Notification    â”‚   â”‚
â”‚  â”‚  Worker     â”‚â—„â”€â”€â”€â”‚  Manager    â”‚â”€â”€â”€â–؛â”‚  API             â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک    â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک   â”‚
â”‚         â”‚                                        â”‚              â”‚
â”‚         â”‚ Push Event                            â”‚ Display      â”‚
â”‚         â–¼                                        â–¼              â”‚
â”‚  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ   â”‚
â”‚  â”‚                  Mawaeedak App                          â”‚   â”‚
â”‚  â”‚  - pushNotificationService.ts                          â”‚   â”‚
â”‚  â”‚  - Subscription management                              â”‚   â”‚
â”‚  â”‚  - VAPID authentication                                 â”‚   â”‚
â”‚  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک   â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
          â”‚                                      â”‚
          â”‚ Subscription Data                   â”‚ Push Payload
          â–¼                                      â–¼
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
â”‚    Supabase         â”‚              â”‚   Supabase Edge          â”‚
â”‚  push_subscriptions â”‚              â”‚   Function (send-push)   â”‚
â”‚  table              â”‚              â”‚                         â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
                                              â”‚
                                              â”‚ Web Push Protocol
                                              â–¼
                                      â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”گ
                                      â”‚  Push Service   â”‚
                                      â”‚  (Browser's     â”‚
                                      â”‚   Push Service) â”‚
                                      â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”ک
```

---

## Implementation Files

### 1. Frontend: pushNotificationService.ts

**Location**: `artifacts/mawaeedak/src/lib/push/pushNotificationService.ts`

**Functions**:
- `isPushSupported()` â€” Check browser support
- `requestNotificationPermission()` â€” Request browser permission
- `subscribeToPush()` â€” Subscribe to push
- `savePushSubscription()` â€” Store in Supabase
- `enablePushNotifications()` â€” Full subscription flow
- `disablePushNotifications()` â€” Unsubscribe
- `setupNotificationClickHandler()` â€” Handle notification clicks

### 2. Backend: Supabase Edge Function

**Location**: `supabase/functions/send-push/index.ts`

**Features**:
- Sends push notifications to user subscriptions
- VAPID authentication
- Expired subscription cleanup
- Error handling

### 3. Database: push_subscriptions Table

**Location**: `supabase/migrations/20250612000001_create_push_subscriptions.sql`

**Schema**:
```sql
CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS**:
- Users can only manage their own subscriptions
- No public access

---

## VAPID Key Generation

**Important**: Never commit VAPID private keys to the repository.

### Generate Keys

```bash
npx web-push generate-vapid-keys
```

**Output**:
```json
{
  "publicKey": "BGx123...",
  "privateKey": "Yx456..."
}
```

### Configure Keys

#### 1. Vercel (Frontend)

Add to Vercel Environment Variables:
```
VITE_VAPID_PUBLIC_KEY=BGx123...
```

#### 2. Supabase Edge Function

Set in Supabase Edge Function settings:
```
VAPID_PRIVATE_KEY=Yx456...
VAPID_PUBLIC_KEY=BGx123...
VAPID_SUBJECT=mailto:notifications@mawaeedak.app
```

---

## Deployment Steps

### 1. Apply Supabase Migration

Run in Supabase SQL Editor:
```bash
cat supabase/migrations/20250612000001_create_push_subscriptions.sql
```

### 2. Deploy Edge Function

```bash
supabase functions deploy send-push
```

### 3. Configure Edge Function Environment

In Supabase dashboard:
1. Go to Edge Functions
2. Select `send-push`
3. Add environment variables:
   - `VAPID_PRIVATE_KEY`
   - `VAPID_PUBLIC_KEY`
   - `VAPID_SUBJECT`

### 4. Add VITE_VAPID_PUBLIC_KEY to Vercel

In Vercel dashboard:
1. Go to Project Settings
2. Add Environment Variable:
   - Name: `VITE_VAPID_PUBLIC_KEY`
   - Value: (public key from step above)

### 5. Set Up Scheduler/Cron

For reminder notifications, set up a cron job:
- Option 1: Supabase Cron (pg_cron)
- Option 2: Vercel Cron
- Option 3: External scheduler (e.g., GitHub Actions scheduled)

Example Vercel `vercel.json` cron:
```json
{
  "crons": [{
    "path": "/api/cron/reminders",
    "schedule": "*/10 * * * *"
  }]
}
```

---

## Testing Push Notifications

### 1. Browser Testing

1. Open app in Chrome/Edge
2. Open DevTools â†’ Application â†’ Service Workers
3. Check "Update on reload"
4. Go to Settings â†’ Enable notifications
5. Check browser notification permission

### 2. Manual Push Test

```bash
# Get subscription from Supabase
supabase db select "SELECT * FROM push_subscriptions WHERE user_id = 'your-user-id'"

# Send test push (requires Edge Function deployed)
curl -X POST https://your-project.supabase.co/functions/v1/send-push \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id", "payload": {"title": "Test", "body": "Test notification"}}'
```

---

## Security Considerations

1. **No Private Keys in Frontend**: Only `VITE_VAPID_PUBLIC_KEY` is exposed to frontend
2. **RLS Policy**: Users can only manage their own subscriptions
3. **Edge Function Authentication**: Requires authenticated user or admin
4. **Expired Subscription Cleanup**: Automatically removes invalid subscriptions
5. **No Sensitive Data in Notifications**: Keep notification content minimal

---

## Browser Support

| Browser | Push Support |
|---------|-------------|
| Chrome 50+ | âœ… Full |
| Edge 79+ | âœ… Full |
| Firefox 44+ | âœ… Full |
| Safari 16+ | âڑ ï¸ڈ Limited (no background push) |
| Samsung Internet | âœ… Full |
| Opera 36+ | âœ… Full |

**Note**: iOS Safari has limited Push API support. For iOS, consider:
- Web App Banner prompt
- Alternative notification methods (in-app, email)

---

## Current Limitations

1. **iOS Safari**: Push notifications don't work reliably on iOS
2. **Background Sync**: Not implemented (requires more infrastructure)
3. **Scheduled Notifications**: Requires external cron setup
4. **Email Fallback**: Not implemented

---

## Next Steps for Full Push

1. âœ… Code implemented
2. âڈ³ Deploy Edge Function
3. âڈ³ Configure VAPID keys
4. âڈ³ Set up scheduler
5. âڈ³ Test end-to-end
6. âڈ³ Monitor delivery rates
