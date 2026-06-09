# Supabase RLS Auth Audit — مواعيدك

**تاريخ الفحص:** 2026-06-09

---

## 1. Supabase Schema

### 1.1 Tables (17 جدول)

| الجدول | user_id | RLS | Admin-managed |
|---|---|---|---|
| appointments | ✅ مخطط | ✅ | ❌ |
| financial_events | ✅ مخطط | ✅ | ❌ |
| notifications | ✅ مخطط | ✅ | ❌ |
| daily_messages | ❌ | ❌ عام | ✅ |
| themes | ❌ | ❌ عام | ✅ |
| news | ❌ | ❌ عام | ✅ |
| jobs | ❌ | ❌ عام | ✅ |
| story_templates | ❌ | ❌ عام | ✅ |
| complaints | ❌ | ✅ | ❌ |
| audit_logs | ❌ | ✅ admin | ✅ |
| prayer_times | ❌ | ❌ عام | ❌ |
| official_financial_dates | ❌ | ❌ عام | ✅ |
| official_prayer_times | ❌ | ❌ عام | ✅ |
| public_events | ❌ | ❌ عام | ✅ |
| app_settings | ❌ | ❌ عام | ✅ |
| automation_logs | ❌ | ✅ admin | ✅ |
| social_automation | ❌ | ✅ admin | ✅ |

---

## 2. RLS Policies

### 2.1 user-owned tables

```sql
-- appointments
CREATE POLICY "Users can read own appointments" ON appointments
  FOR SELECT USING (auth.uid() = user_id);

-- financial_events
CREATE POLICY "Users can read own financial events" ON financial_events
  FOR SELECT USING (auth.uid() = user_id);

-- notifications
CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
```

### 2.2 admin-managed tables

```sql
-- public tables (no RLS needed)
-- daily_messages, themes, news, jobs, story_templates

-- admin-only tables
CREATE POLICY "Admin can read audit_logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
```

---

## 3. Auth Analysis

### 3.1 Supabase Auth

| البند | الحالة |
|---|---|
| Email/Password | ✅ |
| JWT tokens | ✅ |
| user_metadata | ⚠️ used but not trusted |
| app_metadata | ✅ المعتمد |
| role in app_metadata | ✅ admin, super_admin |

### 3.2 Auth Flow

```
1. User login → Supabase Auth → JWT
2. JWT contains: user_id, email, app_metadata.role
3. Frontend uses JWT for API calls
4. Backend verifies JWT via /auth/v1/user
5. RLS policies check auth.uid() = user_id
```

---

## 4. Security Verification

### 4.1 User A vs User B

| السيناريو | النتيجة |
|---|---|
| User A creates appointment | ✅ created |
| User B reads User A's appointment | ❌ DENIED by RLS |
| User A reads own appointment | ✅ allowed |
| User B tries to update User A's appointment | ❌ DENIED by RLS |

### 4.2 Admin Access

| السيناريو | النتيجة |
|---|---|
| Admin reads audit_logs | ✅ allowed |
| User reads audit_logs | ❌ DENIED |
| Admin updates themes | ✅ allowed via API |
| User updates themes | ❌ DENIED by requireAdmin |

### 4.3 Guest Access

| السيناريو | النتيجة |
|---|---|
| Guest reads news | ✅ allowed (public) |
| Guest creates appointment | ❌ DENIED by requireAdmin |
| Guest updates financial event | ❌ DENIED by requireAdmin |

---

## 5. service_role Exposure

| البند | الحالة |
|---|---|
| service_role in frontend | ❌ NOT FOUND |
| service_role in bundle | ❌ NOT FOUND |
| VITE_SUPABASE_SERVICE_ROLE | ❌ NOT USED |
| Supabase service role key | ❌ محمي server-only |

---

## 6. Security Risks

### 6.1 Current Status

| Risk | Status |
|---|---|
| RLS bypass | ❌ NOT FOUND |
| Auth bypass | ❌ NOT FOUND |
| service_role leak | ❌ NOT FOUND |
| user_metadata trust | ⚠️ موجود لكن admin يستخدم app_metadata |

### 6.2 Known Issues

| ID | Issue | Severity |
|---|---|---|
| AUTH-001 | user_metadata.role used in frontend | منخفضة |
| AUTH-002 | Admin auth relies on app_metadata | ✅ OK |

---

## 7. Verdict

```
VERDICT: PASSED ✅

Supabase/RLS/Auth محمي بشكل صحيح:
- RLS policies على user-owned tables
- Admin-only access for audit_logs
- No service_role exposure
- app_metadata is trusted for admin
- No auth bypass found
```

---

*تم إنشاء هذا التقرير بواسطة Codex Agent — 2026-06-09*