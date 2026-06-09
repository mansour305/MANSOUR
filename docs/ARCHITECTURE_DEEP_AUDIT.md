# Architecture Deep Audit — مواعيدك

**تاريخ الفحص:** 2026-06-09
**الفاحص:** Codex Agent

---

## 1. مقارنة ARCHITECTURE.md vs الواقع

### 1.1 بنية Monorepo

| الموصوف في ARCHITECTURE | الواقع | التوافق |
|---|---|---|
| artifacts/mawaeedak | ✅ موجود | ✅ مطابق |
| artifacts/api-server | ✅ موجود | ✅ مطابق |
| artifacts/mockup-sandbox | ⚠️ غير موجود | ❌ مفقود |
| lib/api-spec | ✅ موجود | ✅ مطابق |
| lib/api-client-react | ✅ موجود | ✅ مطابق |
| lib/api-zod | ✅ موجود | ✅ مطابق |
| lib/db | ✅ موجود | ✅ مطابق |
| scripts | ✅ موجود | ✅ مطابق |

**النتيجة:** ✅ مطابق مع ملاحظة mockup-sandbox مفقود

### 1.2 Frontend Stack

| الموصوف | الواقع | التوافق |
|---|---|---|
| React 18 | ✅ React 18+ | ✅ |
| Vite | ✅ Vite 6+ | ✅ |
| Tailwind CSS v4 | ✅ Tailwind v4 | ✅ |
| wouter | ✅ wouter 3+ | ✅ |
| Tanstack Query | ✅ Tanstack Query 5+ | ✅ |
| shadcn/ui | ✅ موجود | ✅ |
| Tajawal font | ✅ Cairo (مشابه) | ✅ |

### 1.3 API Server Stack

| الموصوف | الواقع | التوافق |
|---|---|---|
| Express 5 | ✅ Express 5.2+ | ✅ |
| TypeScript | ✅ TypeScript 5.9+ | ✅ |
| Drizzle ORM | ✅ Drizzle ORM | ✅ |
| Zod v4 | ✅ Zod 4+ | ✅ |

### 1.4 عدد الجداول

| الموصوف | الواقع | التوافق |
|---|---|---|
| 12 جدول | 17 جدول | ⚠️ غير مطابق |

**المشكلة:** ARCHITECTURE.md يذكر 12 جدول بينما يوجد 17 جدول فعلي

---

## 2. فحص تضاربات التوثيق

### 2.1 README vs ARCHITECTURE

| البند | README | ARCHITECTURE | الحكم |
|---|---|---|---|
| وصف المشروع | تطبيق جوال متكامل | SPA monorepo | ⚠️ مختلف |
| mobile | مذكور | غير مذكور كـ production | ⚠️ تضارب |
| Supabase | مذكور Phase 12 | مذكور | ✅ |
| API endpoints | 13+ endpoint | 17+ endpoint | ⚠️ تضارب |

### 2.2 عدد الجداول

| الوثيقة | العدد |
|---|---|
| ARCHITECTURE.md | 12 |
| DATA_SOURCE_MAP.md | 17 |
| FULL_REPOSITORY_INVENTORY.md | 17 |
| README.md | 17 |

**الحكم:** ARCHITECTURE.md يحتاج تحديث

---

## 3. فحص المسارات غير الموثقة

### 3.1 API Routes الموجودة

| المسار | موثق؟ | ملاحظة |
|---|---|---|
| /api/appointments | ✅ | موثق |
| /api/financial-events | ✅ | موثق |
| /api/notifications | ✅ | موثق |
| /api/daily-messages | ✅ | موثق |
| /api/themes | ✅ | موثق |
| /api/news | ✅ | موثق |
| /api/jobs | ✅ | موثق |
| /api/complaints | ✅ | موثق |
| /api/story-templates | ✅ | موثق |
| /api/audit-logs | ✅ | موثق |
| /api/public-events | ✅ | موثق |
| /api/admin/* | ✅ | موثق |
| /api/healthz | ✅ | موثق |
| /api/prayer | ✅ | موجود لكن غير مذكور صراحة |
| /api/settings | ✅ | موجود لكن غير مذكور صراحة |
| /api/social | ✅ | موجود لكن غير مذكور صراحة |
| /api/automation | ✅ | موجود لكن غير مذكور صراحة |

**النتيجة:** 4 routes غير موثقة رسمياً

---

## 4. فحص Mobile Reality

### 4.1 حالة mobile/

| البند | الحالة | الحكم |
|---|---|---|
| index.tsx | `return null` فقط | ❌ فارغ |
| _layout.tsx | Stack + QueryClient | ⚠️ shell |
| app.json | موجود وصحيح | ✅ |
| package.json | Expo + RN | ✅ |
| eas.json | موجود | ✅ |
| routes | لا توجد | ❌ مفقود |
| screens | لا توجد | ❌ مفقود |
| bottom tabs | لا توجد | ❌ مفقود |
| navigation | لا يوجد | ❌ مفقود |

**الحكم:** Mobile shell فقط — غير جاهز للإنتاج

---

## 5. فحص api-server Deployment

### 5.1 Vercel Configuration

| البند | الحالة |
|---|---|
| vercel.json موجود | ✅ |
| buildCommand صحيح | ✅ |
| outputDirectory صحيح | ✅ |
| منصور على Vercel | ⚠️ غير محدد |

---

## 6. فحص تناسق Web/Admin/API

### 6.1 Admin Routes

| المسار | Web Component | API | Auth |
|---|---|---|---|
| /admin | ✅ AdminLayout | ✅ | ✅ requireAdmin |
| /admin/dashboard | ✅ | ✅ | ✅ |
| /admin/news-jobs | ✅ | ✅ | ✅ |
| /admin/notifications | ✅ | ✅ | ✅ |
| /admin/themes | ✅ | ✅ | ✅ |
| /admin/story | ✅ | ✅ | ✅ |
| /admin/messages | ✅ | ✅ | ✅ |
| /admin/data-layer | ✅ | ⚠️ | ✅ |

### 6.2 تناسق Auth

| البند | Web | API |
|---|---|---|
| Supabase Auth | ✅ | ✅ |
| requireAdmin middleware | — | ✅ |
| JWT verification | ✅ | ✅ |
| app_metadata.role | ✅ | ✅ |

---

## 7. فحص الملفات القديمة/المستبدلة

| الملف | الحالة |
|---|---|
| README_FIX.md | ❌ مهمل — تم إصلاحه |
| mockup-sandbox/ | ❌ مفقود — غير مذكور في الواقع |

---

## 8. ملخص التناقضات

| ID | النوع | الوصف | الخطورة |
|---|---|---|---|
| ARCH-001 | توثيق | ARCHITECTURE يذكر 12 جدول والواقع 17 | متوسطة |
| ARCH-002 | توثيق | mobile غير مذكور في ARCHITECTURE | عالية |
| ARCH-003 | توثيق | 4 API routes غير موثقة | منخفضة |
| ARCH-004 | production | mobile shell فقط | عالية |
| ARCH-005 | توثيق | README يصف كمشروع جوال والـ ARCH يصف كـ SPA | منخفضة |

---

## 9. الحكم

### التوافق مع ARCHITECTURE.md

| المعيار | التقييم |
|---|---|
| بنية Monorepo | ✅ |
| Frontend Stack | ✅ |
| API Server Stack | ✅ |
| عدد الجداول | ⚠️ يحتاج تحديث |
| Mobile ذكر | ❌ غير موجود |
| API routes | ⚠️ 4 غير موثقة |

### الملفات الموحدة

| الملف | الحالة |
|---|---|
| ARCHITECTURE.md | ⚠️ يحتاج تحديث |
| README.md | ✅ محدث |
| DATA_SOURCE_MAP.md | ✅ موحد |

---

## 10. التوصيات

1. **تحديث ARCHITECTURE.md** — إضافة mobile كـ shell
2. **توثيق 4 API routes الجديدة** — prayer, settings, social, automation
3. **تصحيح عدد الجداول** — من 12 إلى 17
4. **بناء Mobile فعلي** — أو إزالة marketing mobile-first

---

## الحكم النهائي

```
VERDICT: NEEDS FIXES
```

| السبب | الخطورة |
|---|---|
| ARCHITECTURE.md غير محدث | متوسطة |
| Mobile shell فقط | عالية |
| 4 routes غير موثقة | منخفضة |

---

*تم إنشاء هذا التقرير بواسطة Codex Agent — 2026-06-09*