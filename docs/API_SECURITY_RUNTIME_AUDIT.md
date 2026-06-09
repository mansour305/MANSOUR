# API Security Runtime Audit — مواعيدك

**تاريخ الفحص:** 2026-06-09

---

## Routes Summary

| المسار | Methods | Auth | Admin | Status |
|---|---|---|---|---|
| /api/healthz | GET | ❌ | ❌ | ✅ |
| /api/appointments | CRUD | ✅ | ✅ | ✅ |
| /api/financial-events | CRUD | ✅ | ✅ | ✅ |
| /api/notifications | CRUD | ✅ | ✅ | ✅ |
| /api/daily-messages | CRUD | ✅ | ✅ | ✅ |
| /api/themes | CRUD | ✅ | ✅ | ✅ |
| /api/news | CRUD | ✅ | ✅ | ✅ |
| /api/jobs | CRUD | ✅ | ✅ | ✅ |
| /api/complaints | GET/POST | ✅ | ❌ | ✅ |
| /api/story-templates | CRUD | ✅ | ✅ | ✅ |
| /api/audit-logs | GET/POST | ✅ | ✅ | ✅ |
| /api/public-events | CRUD | ✅ | ✅ | ✅ |
| /api/admin/* | GET | ✅ | ✅ | ✅ |
| /api/prayer | GET | ❌ | ❌ | ✅ |
| /api/settings | GET/PUT | ✅ | ✅ | ✅ |
| /api/social | GET/PUT | ✅ | ✅ | ✅ |
| /api/automation | GET/PUT | ✅ | ✅ | ✅ |

---

## Security Analysis

### 1. requireAdmin Middleware

```typescript
// artifacts/api-server/src/middlewares/requireAdmin.ts
// ✅ موجود ومحمي
// يتحقق من:
// - Bearer JWT
// - Supabase /auth/v1/user
// - app_metadata.role in [admin, super_admin]
```

### 2. Auth Protection

| البند | الحالة |
|---|---|
| JWT verification | ✅ |
| Token expiration | ✅ |
| Role check | ✅ |
| 401 for missing token | ✅ |
| 403 for wrong role | ✅ |
| 503 for missing Supabase | ✅ |

### 3. Mutation Protection

| Endpoint | Admin Required | Status |
|---|---|---|
| POST /api/appointments | ✅ | ✅ محمي |
| PUT /api/appointments/:id | ✅ | ✅ محمي |
| DELETE /api/appointments/:id | ✅ | ✅ محمي |
| POST /api/financial-events | ✅ | ✅ محمي |
| PUT /api/financial-events/:id | ✅ | ✅ محمي |
| DELETE /api/financial-events/:id | ✅ | ✅ محمي |
| POST /api/notifications | ✅ | ✅ محمي |
| PUT /api/notifications/:id/read | ✅ | ✅ محمي |
| DELETE /api/notifications/:id | ✅ | ✅ محمي |

---

## API Routes Files

```
src/routes/
├── index.ts        # تسجيل المسارات
├── appointments.ts # CRUD + requireAdmin
├── financial.ts    # CRUD + requireAdmin
├── notifications.ts # CRUD + requireAdmin
├── messages.ts    # CRUD + requireAdmin
├── themes.ts      # CRUD + requireAdmin
├── news.ts        # CRUD + requireAdmin
├── jobs.ts        # CRUD + requireAdmin
├── story.ts       # CRUD + requireAdmin
├── complaints.ts  # GET/POST (user allowed)
├── admin.ts       # إحصائيات + requireAdmin
├── public_events.ts # CRUD + requireAdmin
├── health.ts      # healthz
├── prayer.ts      # مواقيت الصلاة (عام)
├── settings.ts    # إعدادات (admin)
├── social.ts      # روابط اجتماعية (admin)
├── automation.ts  # أتمتة (admin)
```

---

## Verdict

```
VERDICT: PASSED ✅

API Security محمي بشكل صحيح:
- requireAdmin على جميع mutation endpoints
- JWT verification
- Role-based access
- No service_role exposure
```

---

*تم إنشاء هذا التقرير بواسطة Codex Agent — 2026-06-09*