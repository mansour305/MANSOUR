# Production Readiness Final Gate — مواعيدك

## الهدف

هذه المرحلة تضيف بوابة إنتاج نهائية لا تعلن أن التطبيق Production Ready إلا بعد إثبات حي من البيئة المنشورة، وليس مجرد نجاح build أو typecheck.

## الحالة الحالية

- Phase 4 GitHub Actions Gate: ✅ مثبت ومجتاز.
- Legacy CI: ✅ مثبت ومجتاز.
- Production Readiness Final Gate: 🟡 مثبت كـ workflow يدوي، ولا يمكن اعتباره Passed إلا بعد تهيئة الأسرار الحقيقية وتشغيله يدوياً.

## Workflow

الملف:

```text
.github/workflows/production-readiness-final-gate.yml
```

طريقة التشغيل:

```text
GitHub → Actions → Production Readiness Final Gate → Run workflow
```

## الأسرار المطلوبة في GitHub Actions Secrets

يجب ضبط القيم التالية قبل تشغيل البوابة:

```text
PRODUCTION_APP_URL
PRODUCTION_API_BASE_URL
SUPABASE_URL
SUPABASE_ANON_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
DATABASE_URL
SUPABASE_TEST_USER_A_EMAIL
SUPABASE_TEST_USER_A_PASSWORD
SUPABASE_TEST_USER_B_EMAIL
SUPABASE_TEST_USER_B_PASSWORD
SUPABASE_ADMIN_ACCESS_TOKEN
```

## معنى كل سر

| Secret | الغرض |
|---|---|
| PRODUCTION_APP_URL | رابط واجهة التطبيق المنشورة |
| PRODUCTION_API_BASE_URL | رابط API المنشور |
| SUPABASE_URL | رابط مشروع Supabase من جهة الخادم |
| SUPABASE_ANON_KEY | مفتاح Supabase anon من جهة الخادم |
| VITE_SUPABASE_URL | رابط Supabase المستخدم في الواجهة |
| VITE_SUPABASE_ANON_KEY | anon key المستخدم في الواجهة |
| DATABASE_URL | اتصال قاعدة البيانات الحقيقي |
| SUPABASE_TEST_USER_A_EMAIL | مستخدم اختبار أول لـ RLS |
| SUPABASE_TEST_USER_A_PASSWORD | كلمة مرور المستخدم الأول |
| SUPABASE_TEST_USER_B_EMAIL | مستخدم اختبار ثانٍ مختلف لـ RLS |
| SUPABASE_TEST_USER_B_PASSWORD | كلمة مرور المستخدم الثاني |
| SUPABASE_ADMIN_ACCESS_TOKEN | توكن مستخدم Admin حقيقي يحتوي role في app_metadata |

## ما الذي تفحصه البوابة؟

### 1. Static gates

- `pnpm install --frozen-lockfile`
- `pnpm run typecheck`
- `pnpm run build`

### 2. Secret preflight

يفشل workflow فوراً إذا لم تكن الأسرار المطلوبة موجودة.

### 3. Environment readiness smoke

يشغّل:

```bash
pnpm --filter @workspace/scripts run production-readiness-gate
```

ويتحقق من:

- وجود متغيرات البيئة الأساسية.
- توافق روابط Supabase بين server/client.
- صحة `/api/healthz`.
- رفض `/api/admin/stats` بدون token.
- قبول `/api/admin/stats` بتوكن Admin عند توفره.

### 4. Live Supabase/RLS/Admin smoke

يشغّل:

```bash
pnpm --filter @workspace/scripts run production-readiness-live-smoke
```

ويتحقق من:

- فتح رابط التطبيق المنشور.
- صحة API health.
- تسجيل دخول مستخدمين مختلفين عبر Supabase Auth.
- تحقق Supabase Auth من access token.
- إنشاء موعد بواسطة User A.
- منع User B من قراءة موعد User A عبر RLS.
- حذف سجل الاختبار بواسطة مالكه.
- نجاح Admin API smoke باستخدام توكن Admin حقيقي.

## شرط النجاح

لا تعتبر المرحلة Passed إلا إذا نجحت جميع الخطوات التالية في GitHub Actions:

```text
Install
Typecheck
Build
Required production secret preflight
production-readiness-gate
production-readiness-live-smoke
```

## حالات الفشل المقصودة

الفشل في هذه البوابة ليس خطأ في الكود دائماً. قد يكون الفشل صحيحاً إذا:

- لم تضف Secrets.
- لم تنفذ `SUPABASE_SCHEMA.sql` في Supabase.
- لم تنفذ `RLS_POLICIES.sql` في Supabase.
- لم تنشئ مستخدمَي اختبار مختلفين.
- لم تضبط role=admin أو super_admin في `app_metadata` لمستخدم Admin.
- رابط API أو التطبيق غير منشور أو غير مطابق.

## الحكم الحالي حتى تشغيل البوابة الحية

```text
Publishable Preview / Stabilized Web-PWA baseline
```

وليس:

```text
Production Ready
```

## الانتقال إلى Production Ready

للوصول إلى Production Ready فعلياً:

1. أضف الأسرار المطلوبة في GitHub Actions Secrets.
2. شغّل `SUPABASE_SCHEMA.sql` في Supabase SQL Editor.
3. شغّل `RLS_POLICIES.sql` في Supabase SQL Editor.
4. أنشئ مستخدمَي اختبار عاديين مختلفين.
5. أنشئ مستخدم Admin حقيقي واضبط دوره في `app_metadata`.
6. شغّل Workflow: `Production Readiness Final Gate`.
7. لا تعتمد Production Ready إلا إذا انتهى workflow بنتيجة Success.
