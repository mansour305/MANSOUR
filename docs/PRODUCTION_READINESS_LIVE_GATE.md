# Production Readiness Live Gate — مواعيدك

## الهدف

هذه البوابة هي آخر بوابة قبل اعتبار مشروع **مواعيدك** Production Ready.

لا يجوز اعتبار المشروع Production Ready بمجرد نجاح build أو GitHub Actions العادي. يجب أن تنجح هذه البوابة الحية بعد ضبط أسرار الإنتاج وتشغيل الفحوصات على البيئة الفعلية.

## ما الذي تختبره البوابة؟

تعمل البوابة اليدوية:

```text
.github/workflows/production-readiness-live-gate.yml
```

وتشغّل السكربت:

```bash
pnpm run production-readiness-gate
```

السكربت موجود في:

```text
scripts/src/production-readiness-gate.ts
```

## الأسرار المطلوبة في GitHub Actions Secrets

يجب ضبط الأسرار التالية قبل تشغيل البوابة:

| Secret | مطلوب | الغرض |
|---|---:|---|
| `PRODUCTION_API_BASE_URL` | نعم | رابط API الإنتاجي بدون slash نهائي |
| `DATABASE_URL` | نعم | قاعدة بيانات الإنتاج |
| `SUPABASE_URL` | نعم | رابط مشروع Supabase من جهة السيرفر |
| `SUPABASE_ANON_KEY` | نعم | مفتاح anon من جهة السيرفر |
| `VITE_SUPABASE_URL` | نعم | رابط Supabase للواجهة |
| `VITE_SUPABASE_ANON_KEY` | نعم | مفتاح anon للواجهة |
| `PRODUCTION_WEB_BASE_URL` | اختياري | رابط الواجهة الإنتاجية لفحص الصفحة الرئيسية |
| `LIVE_ADMIN_BEARER_TOKEN` | اختياري لكن مهم | توكن مالك حقيقي لاختبار `/api/admin/stats` بصلاحية admin |

## الفحوصات المنفذة

| الفحص | النتيجة المطلوبة |
|---|---:|
| وجود أسرار الإنتاج المطلوبة | Pass |
| صحة روابط API/Supabase/Web | Pass |
| تطابق `SUPABASE_URL` مع `VITE_SUPABASE_URL` | Pass |
| تطابق `SUPABASE_ANON_KEY` مع `VITE_SUPABASE_ANON_KEY` | Pass |
| `GET /api/healthz` | HTTP 200 |
| Supabase Auth بدون جلسة مستخدم | HTTP 401 أو 403 |
| `GET /api/admin/stats` بدون توكن | HTTP 401 |
| `GET /api/admin/stats` بتوكن مالك حي | HTTP 200 عند توفر `LIVE_ADMIN_BEARER_TOKEN` |
| رابط الواجهة الإنتاجية | HTTP 200 عند توفر `PRODUCTION_WEB_BASE_URL` |

## طريقة التشغيل

من GitHub:

1. افتح تبويب **Actions**.
2. اختر **Production Readiness Live Gate**.
3. اضغط **Run workflow**.
4. شغّلها على `main`.

## معيار القبول النهائي

الحكم يكون:

```text
PRODUCTION READY
```

فقط إذا تحقق كل ما يلي:

- CI ناجح.
- Phase 4 GitHub Actions Gate ناجح.
- Production Readiness Live Gate ناجح على `main`.
- Supabase schema مطبق.
- RLS policies مطبقة.
- Admin smoke بتوكن مالك حقيقي ناجح.
- لا أسرار مكشوفة في الكود.
- لا صفحات فارغة أو أزرار غير عاملة في المسار الإنتاجي.
- تم اجتياز التحقق البصري النهائي للهوية المرجعية.

## الحكم الحالي قبل تشغيل البوابة الحية

```text
Publishable Preview / Stabilized Web-PWA baseline
```

وليس:

```text
Production Ready
```

السبب: الأسرار الحية وRLS/Supabase/Auth/Admin live smoke والتغليف الجوال والتحقق البصري النهائي تحتاج تنفيذ أو إثبات خارج الكود الحالي.
