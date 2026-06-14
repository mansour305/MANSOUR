# Local-Only Services Documentation

**Last Updated**: 2026-06-12

---

## Overview

Some features in Mawaeedak currently store data locally (browser localStorage) rather than syncing to Supabase cloud. This document explains the current state, limitations, and sync path.

**UI Indicator**: Services that store locally show the banner: "ًں’¾ ظ…ظ„ط§ط­ط¸ط©: ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·"

---

## Current Local-Only Services

### 1. Goals (ط§ط­ط³ط¨ ظ‡ط¯ظپظƒ)

**Page**: `/services/goals`
**Storage Key**: `mawaeedak_goals_v1`
**File**: `artifacts/mawaeedak/src/features/services/GoalsPage.tsx`

**Data Structure**:
```typescript
interface Goal {
  id: string;
  name: string;
  type: "financial" | "non-financial";
  targetAmount: number | null;
  requirements: string;
  currentProgress: number;
  deadline: string | null;
  createdAt: string;
  completedAt: string | null;
}
```

**Limitations**:
- â‌Œ Data not synced across devices
- â‌Œ Data lost on browser cache clear
- â‌Œ No cloud backup
- â‌Œ No offline access on other devices

**Cloud Sync Status**:
- âœ… Supabase schema created (`goals` table)
- âœ… RLS policies defined
- âڈ³ Sync integration pending

---

### 2. Cost Projects (ط­ط³ط§ط¨ ط§ظ„طھظƒط§ظ„ظٹظپ)

**Page**: `/services/costs`
**Storage Key**: `mawaeedak_cost_projects_v1`
**File**: `artifacts/mawaeedak/src/features/services/CostsPage.tsx`

**Data Structure**:
```typescript
interface CostProject {
  id: string;
  name: string;
  items: CostItem[];
  createdAt: string;
  updatedAt: string;
}

interface CostItem {
  id: string;
  name: string;
  amount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "partial" | "fully_paid" | "scheduled";
  scheduledDate: string | null;
  notes: string;
  createdAt: string;
}
```

**Limitations**:
- â‌Œ Data not synced across devices
- â‌Œ Data lost on browser cache clear
- â‌Œ No cloud backup
- â‌Œ No export/import between devices

**Cloud Sync Status**:
- âœ… Supabase schema created (`cost_projects`, `cost_items` tables)
- âœ… RLS policies defined
- âڈ³ Sync integration pending

---

### 3. Reminders (ط°ظƒط±ظ†ظٹ)

**Page**: `/services/reminders`
**Storage Key**: `mawaeedak_reminders_v1`
**File**: `artifacts/mawaeedak/src/features/services/RemindersPage.tsx`

**Data Structure**:
```typescript
interface Reminder {
  id: string;
  title: string;
  dateType: "hijri" | "gregorian";
  date: string;
  time: string;
  remindBeforeValue: number;
  remindBeforeUnit: "minutes" | "hours" | "days";
  note: string;
  isActive: boolean;
  createdAt: string;
}
```

**Limitations**:
- â‌Œ Data not synced across devices
- â‌Œ Push notifications require deployment setup
- â‌Œ In-app notifications only (for now)

**Cloud Sync Status**:
- âœ… Supabase schema created (`reminders` table)
- âœ… RLS policies defined
- âڈ³ Sync integration pending
- âڈ³ Push notification deployment required

---

## Cloud-Synced Services

### Services with Supabase Sync

| Service | Status | Notes |
|---------|--------|-------|
| User Profile | âœ… Synced | Auto-created on signup |
| Financial Events | âœ… Synced | Salaries, aids, etc. |
| Appointments | âœ… Synced | Calendar events |
| Complaints | âœ… Synced | Supports guest submission |
| Notifications | âœ… Synced | In-app notifications |
| Daily Messages | âœ… Synced | Read-only for users |
| Official Prayer Times | âœ… Synced | Admin-managed |
| Push Subscriptions | âœ… Synced | Web Push setup |

---

## Local-to-Cloud Migration Path

### When User Logs In

```typescript
// Pseudocode for migration flow
async function migrateLocalToCloud(userId: string) {
  // 1. Check for local data
  const localGoals = loadGoalsFromLocalStorage();
  const localProjects = loadCostProjectsFromLocalStorage();
  const localReminders = loadRemindersFromLocalStorage();
  
  // 2. If user is logged in and cloud is available
  if (userId && isSupabaseEnabled) {
    // 3. Push local data to cloud
    for (const goal of localGoals) {
      await supabase.from('goals').upsert({ ...goal, user_id: userId });
    }
    
    // 4. Keep local copy as backup
    // (Or remove if sync is confirmed)
  }
}
```

### Implementation Status

- [ ] Migration trigger on login
- [ ] Conflict resolution strategy
- [ ] Progress indicator
- [ ] Error handling and retry
- [ ] Confirmation dialog

---

## Future Sync Implementation

### Phase 1: Basic Sync
- Save new data to Supabase when logged in
- Load from Supabase when available
- Keep localStorage as fallback

### Phase 2: Bidirectional Sync
- Sync changes in both directions
- Handle conflicts gracefully
- Real-time updates

### Phase 3: Offline Support
- Queue changes when offline
- Sync when connection restored
- Conflict resolution UI

---

## User Communication

### Current UI Banners

**Goals**:
> ًں’¾ ظ…ظ„ط§ط­ط¸ط©: ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·. ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظ…ط¹ ط§ظ„ط³ط­ط§ط¨ط© ظ‚ط§ط¯ظ…ط© ظ‚ط±ظٹط¨ط§ظ‹.

**Costs**:
> ًں’¾ ظ…ظ„ط§ط­ط¸ط©: ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·. ط§ظ„ظ…ط²ط§ظ…ظ†ط© ظ…ط¹ ط§ظ„ط³ط­ط§ط¨ط© ظ‚ط§ط¯ظ…ط© ظ‚ط±ظٹط¨ط§ظ‹.

**Reminders**:
> ًں’¾ ظ…ظ„ط§ط­ط¸ط©: ظ…ط­ظپظˆط¸ ط¹ظ„ظ‰ ظ‡ط°ط§ ط§ظ„ط¬ظ‡ط§ط² ظپظ‚ط·. ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ط¯ط§ط®ظ„ظٹط© ظپظ‚ط· ط­ط§ظ„ظٹط§ظ‹. ط¥ط¹ط¯ط§ط¯ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ ط§ظ„ظپظˆط±ظٹط© ظ‚ظٹط¯ ط§ظ„طھط·ظˆظٹط±.

---

## Migration Strategy

### For New Users
1. Create account â†’ Cloud storage from start
2. LocalStorage not used for primary data

### For Existing Users
1. Detect localStorage data on login
2. Show migration prompt: "ظ‡ظ„ طھط±ظٹط¯ ظ†ظ‚ظ„ ط¨ظٹط§ظ†ط§طھظƒ ظ„ظ„ط³ط­ط§ط¨ط©طں"
3. If yes: Migrate data to Supabase
4. If no: Keep localStorage, sync new data only

### For Guest Users
1. Use localStorage freely
2. On signup: Prompt to migrate
3. On login: Sync with existing cloud data

---

## Technical Details

### Storage Keys

| Service | localStorage Key | Version |
|---------|------------------|---------|
| Goals | `mawaeedak_goals_v1` | 1 |
| Costs | `mawaeedak_cost_projects_v1` | 1 |
| Reminders | `mawaeedak_reminders_v1` | 1 |

### Data Format

All localStorage data is stored as JSON strings:
```json
// Example: Goals
[
  {
    "id": "goal_1234567890_abc123",
    "name": "ط´ط±ط§ط، ط³ظٹط§ط±ط©",
    "type": "financial",
    "targetAmount": 100000,
    "currentProgress": 25000,
    "deadline": "2026-12-31",
    "createdAt": "2026-06-12T00:00:00.000Z",
    "completedAt": null
  }
]
```

### Cleanup Strategy

When migrating to cloud:
1. Keep localStorage for 7 days as backup
2. Show confirmation that data is synced
3. Clear localStorage after confirmation
4. If errors, restore from localStorage

---

## Backup Recommendations

### For Users (Before Clearing Browser Data)

1. **Export Data**:
   - Navigate to each service (Goals, Costs, Reminders)
   - Copy the displayed data
   - Save to a safe location

2. **Take Screenshots**:
   - Screenshot of each service page
   - Include all important data

3. **Account Sync**:
   - Log in to sync data to cloud
   - Data will be available after re-login

---

## Status Summary

| Feature | Local Only | Cloud Sync | Migration Ready |
|---------|-----------|------------|-----------------|
| Goals | âœ… Yes | âڈ³ Pending | âڈ³ Pending |
| Costs | âœ… Yes | âڈ³ Pending | âڈ³ Pending |
| Reminders | âœ… Yes | âڈ³ Pending | âڈ³ Pending |
| Financial Events | â‌Œ No | âœ… Done | âœ… Done |
| Appointments | â‌Œ No | âœ… Done | âœ… Done |
| Complaints | â‌Œ No | âœ… Done | âœ… Done |

---

## Next Steps

1. **Implement sync hook** for Goals, Costs, Reminders
2. **Add migration prompt UI** on login
3. **Add export functionality** for backup
4. **Implement conflict resolution** for duplicates
5. **Add sync status indicator** in UI
