# Web/PWA Runtime Audit — مواعيدك

**تاريخ الفحص:** 2026-06-09
**الفاحص:** Codex Agent

---

## 1. ملخص الفحص

| البند | العدد |
|---|---|
| Pages | 13 |
| Features | 35 |
| Components | 50+ |
| Actions Handlers | 50+ |
| localStorage usage | 29 |

---

## 2. صفحات المشروع

### 2.1 Pages

| الصفحة | المسار | الحالة |
|---|---|---|
| AdminSelfTestPage | /admin/self-test | ✅ |
| AuthCallbackPage | /auth/callback | ✅ |
| AuthPage | /auth | ✅ |
| DisclaimerPage | /disclaimer | ✅ |
| MorePage | /more | ✅ |
| PrivacyPage | /privacy | ✅ |
| ReferenceClonePage | /reference | ✅ |
| ResetPasswordPage | /reset-password | ✅ |
| SplashScreen | /splash | ✅ |
| SupportPage | /support | ✅ |
| TermsPage | /terms | ✅ |
| WelcomePage | /welcome | ✅ |
| not-found | /* | ✅ |

### 2.2 Features

| الميزة | المجلد | الحالة |
|---|---|---|
| AccountPage | account/ | ✅ |
| AdminLayout + 23 admin pages | admin/ | ✅ |
| CalendarPage | calendar/ | ✅ |
| CentersComplaintsPage | centers/ | ✅ |
| CentersGreetingsPage | centers/ | ✅ |
| CentersJobsPage | centers/ | ✅ |
| CentersNewsPage | centers/ | ✅ |
| CentersPage | centers/ | ✅ |
| CentersStudyPage | centers/ | ✅ |
| CentersTravelPage | centers/ | ✅ |
| CentersWorkPage | centers/ | ✅ |
| DailyCardPage | daily-card/ | ✅ |
| DailyCardPreview | daily-card/ | ✅ |
| FinancePage | finance/ | ✅ |
| HomePage | home/ | ✅ |
| NotificationsPage | notifications/ | ✅ |
| StoryPage | story/ | ✅ |

---

## 3. فحص الأزرار والـ Handlers

### 3.1 الأزرار مع onClick

تم فحص 50+ onClick handlers — جميعها لها implementations حقيقية.

### 3.2 الأزرار الميتة (Dead Buttons)

| الزر | الحالة | ملاحظة |
|---|---|---|
| لا توجد أزرار بدون onClick | ✅ | جميع الأزرار لها handlers |

### 3.3 onClick فارغة

لم يتم العثور على onClick فارغة أو placeholder.

---

## 4. فحص localStorage

### 4.1 الاستخدامات في Features

| الملف | الاستخدام | الحكم |
|---|---|---|
| AccountPage.tsx | app-user, app-theme, preferences | ✅ user-only |
| StoryPage.tsx | mawaeedak_story_v1 | ✅ draft local |
| AdminReports.tsx | reports_log | ⚠️ admin local |
| AdminSettings.tsx | app_name, default_theme, etc | ⚠️ admin settings |
| AdminRuntimeBoundary.tsx | clear all keys | ⚠️ admin clear |
| CentersWorkPage.tsx | mawaeedak_work_tasks_v1 | ✅ user-only |
| CentersTravelPage.tsx | mawaeedak_travel_v1 | ✅ user-only |

### 4.2 Admin localStorage (مقلق للإنتاج)

| المفتاح | الغرض | المشكلة |
|---|---|---|
| admin_users | مستخدمين وهمية | ❌ ليس في production |
| admin_financial_events | أحداث مالية وهمية | ❌ ليس في production |
| admin_official_financial | تواريخ رسمية وهمية | ❌ ليس في production |
| admin_official_prayer | أوقات صلاة وهمية | ❌ ليس في production |
| admin_messages | رسائل وهمية | ❌ ليس في production |
| admin_story | قوالب وهمية | ❌ ليس في production |
| admin_themes | ثيمات وهمية | ❌ ليس في production |
| admin_notifications | إشعارات وهمية | ❌ ليس في production |
| admin_news | أخبار وهمية | ❌ ليس في production |
| admin_jobs | وظائف وهمية | ❌ ليس في production |
| admin_reports_log | سجل تقارير وهمية | ❌ ليس في production |
| admin_settings | إعدادات وهمية | ❌ ليس في production |
| admin_social | روابط اجتماعية وهمية | ❌ ليس في production |
| admin_support | تذاكر دعم وهمية | ❌ ليس في production |
| admin_session | جلسة وهمية | ❌ ليس في production |

---

## 5. فحص Services

### 5.1 API Services

| الخدمة | الحالة | ملاحظة |
|---|---|---|
| adminServices.ts | ⚠️ localStorage | admin-storage fallback |
| API hooks (Orval) | ✅ API/Supabase | Gateway |
| Supabase Data | ✅ Supabase | Phase 12 Gateway |

### 5.2 خدمات البيانات

| المسار | المصدر | الحكم |
|---|---|---|
| appointments | Gateway | ✅ Supabase/API |
| financial_events | Gateway | ✅ Supabase/API |
| notifications | Gateway | ✅ Supabase/API |
| news | Gateway | ✅ Supabase/API |
| jobs | Gateway | ✅ Supabase/API |
| themes | Gateway | ✅ Supabase/API |
| story_templates | Gateway | ✅ Supabase/API |
| daily_messages | Gateway | ✅ Supabase/API |

---

## 6. فحص Loading/Error States

### 6.1 TanStack Query Usage

| الصفحة | Loading State | Error State |
|---|---|---|
| HomePage | ✅ isLoading | ✅ isError |
| CalendarPage | ✅ savePending | ✅ error |
| FinancePage | ✅ loading | ✅ error |
| NotificationsPage | ✅ isLoading | ✅ isError |
| StoryPage | ✅ isLoading | ✅ error |
| AccountPage | ✅ isLoading | ✅ error |

---

## 7. فحص Toast/Notification

### 7.1 TopNotificationBanner

| الوظيفة | الحالة |
|---|---|
| showTopNotification | ✅ مطبق |
| Success toast | ✅ |
| Error toast | ✅ |
| Warning toast | ✅ |

---

## 8. فحص Data Persistence

### 8.1 بعد الحفظ (After Save)

| الوظيفة | الحالة | ملاحظة |
|---|---|---|
| Optimistic update | ✅ | Query invalidation |
| Supabase write | ✅ | Gateway |
| API write | ✅ | REST |
| localStorage (user) | ✅ | الستوري/العمل |
| localStorage (admin) | ⚠️ | admin-storage فقط dev |

### 8.2 بعد Refresh

| البيانات | البقاء؟ | الحكم |
|---|---|---|
| User profile | ✅ | localStorage |
| Theme preference | ✅ | localStorage |
| Work tasks | ✅ | localStorage |
| Travel trips | ✅ | localStorage |
| Story draft | ✅ | localStorage |
| Admin data | ❌ | admin-storage dev فقط |

---

## 9. المشاكل المكتشفة

### 9.1 Critical Issues

| ID | المشكلة | الخطورة | الملف |
|---|---|---|---|
| WEB-001 | admin-storage يستخدم localStorage فقط | عالية | admin-storage.ts |
| WEB-002 | admin-actions لا يتصل بـ Supabase | عالية | admin-actions.ts |
| WEB-003 | Admin dashboard يستخدم بيانات وهمية | عالية | features/admin/* |
| WEB-004 | لا يوجد switch لـ Supabase في Admin | عالية | features/admin/* |

### 9.2 High Issues

| ID | المشكلة | الخطورة | الملف |
|---|---|---|---|
| WEB-005 | admin-settings يحفظ في localStorage | متوسطة | AdminSettings.tsx |
| WEB-006 | admin-reports يحفظ في localStorage | متوسطة | AdminReports.tsx |

---

## 10. الحكم

### فحص UI/UX

| المعيار | التقييم |
|---|---|
| Buttons with handlers | ✅ 50+ |
| Dead buttons | ✅ لا يوجد |
| Loading states | ✅ مطبق |
| Error states | ✅ مطبق |
| Toast notifications | ✅ مطبق |
| Data persistence | ⚠️ Admin issue |

### فحص Production

| المعيار | التقييم |
|---|---|
| User data (localStorage) | ✅ OK |
| Admin data (localStorage) | ❌ NOT OK |
| API integration | ✅ Gateway |
| Supabase integration | ✅ Gateway |

---

## VERDICT: NEEDS FIXES

| السبب | الخطورة |
|---|---|
| Admin يستخدم localStorage فقط | عالية |
| Admin لا يتصل بـ Supabase | عالية |
| Admin dashboard بيانات وهمية | عالية |

---

*تم إنشاء هذا التقرير بواسطة Codex Agent — 2026-06-09*