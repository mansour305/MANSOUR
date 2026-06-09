# Full Repository Inventory — مواعيدك

**تاريخ الفحص:** 2026-06-09
**الفاحص:** Codex Agent
**عدد الملفات المصدرية:** 266 ملف

---

## ملخص عام

| البند | العدد |
|---|---|
| إجمالي الملفات المصدرية | 266 |
| مجلدات المستوى الأول | 12 |
| workspaces في pnpm | 8 |
| جداول SQL | 17 |
| workflows CI/CD | ~10 |
| ملفات توثيق | ~30 |

---

## 1. بنية Monorepo

```
mawaeedak/
├── artifacts/              # تطبيقات قابلة للنشر
│   ├── mawaeedak/          # Web/PWA (React + Vite)
│   └── api-server/          # Backend (Express + TypeScript)
├── lib/                    # مكتبات مشتركة
│   ├── api-spec/            # OpenAPI 3.1 YAML
│   ├── api-client-react/    # React Query hooks (Orval)
│   ├── api-zod/             # Zod schemas (Orval)
│   └── db/                  # Drizzle ORM
├── mobile/                 # تطبيق Expo/React Native
├── scripts/                # أدوات وscripts
├── docs/                   # توثيق المشروع
├── .github/                # GitHub Actions
└── package.json            # pnpm workspace root
```

---

## 2. الملفات حسب المجلد

### / (Root)

| الملف | النوع | الغرض | مستخدم؟ | إنتاج؟ | الحالة |
|---|---|---|---|---|---|
| package.json | config | تعريف workspace | ✅ | ✅ | سليمة |
| pnpm-workspace.yaml | config | تعريف workspaces | ✅ | ✅ | سليمة |
| pnpm-lock.yaml | lock | قفل الاعتماديات | ✅ | ✅ | محدث |
| tsconfig.json | config | TypeScript root | ✅ | ✅ | سليمة |
| tsconfig.base.json | config | إعدادات TypeScript | ✅ | ✅ | سليمة |
| vercel.json | config | إعدادات Vercel | ✅ | ✅ | سليمة |
| README.md | doc | توثيق المشروع | ✅ | ✅ | محدث |
| AGENTS.md | doc | تعليمات Codex | ✅ | ❌ | سليمة |
| ARCHITECTURE.md | doc | البنية التقنية | ✅ | ✅ | سليمة |
| DATA_SOURCE_MAP.md | doc | خريطة البيانات | ✅ | ✅ | سليمة |
| ENV_EXAMPLE.md | doc | متغيرات البيئة | ✅ | ✅ | سليمة |
| DESIGN_GUIDELINES.md | doc | إرشادات التصميم | ✅ | ❌ | سليمة |
| FALLBACK_SERVICES.md | doc | خدمات fallback | ✅ | ✅ | سليمة |
| MISSING_SECRETS.md | doc | الأسرار المفقودة | ✅ | ❌ | سليمة |
| QA_REPORT.md | doc | تقرير QA | ✅ | ❌ | سليمة |
| VISUAL_MATCH_REPORT.md | doc | تقرير المطابقة البصرية | ✅ | ❌ | سليمة |
| SMOKE_CHECKLIST.md | doc | قائمة الاختبار | ✅ | ✅ | سليمة |
| TEST_PLAN.md | doc | خطة الاختبار | ✅ | ❌ | سليمة |
| MAWAEEDAK_PROJECT_CONTROL_LEDGER.md | doc | سجل التحكم | ✅ | ❌ | سليمة |
| SUPABASE_ID_MAPPING_STRATEGY.md | doc | استراتيجية ID | ✅ | ✅ | سليمة |
| SUPABASE_MIGRATION_PLAN.md | doc | خطة migration | ✅ | ✅ | سليمة |
| SUPABASE_MIGRATION_CHECKLIST.md | doc | قائمة migration | ✅ | ✅ | سليمة |
| SUPABASE_SCHEMA.sql | SQL | مخطط Supabase | ✅ | ✅ | سليمة |
| RLS_POLICIES.sql | SQL | سياسات RLS | ✅ | ✅ | سليمة |
| SUPABASE_ADMIN_BOOTSTRAP.sql | SQL | تهيئة Admin | ✅ | ✅ | سليمة |
| SUPABASE_USER_CORE_MIGRATION.sql | SQL | migration للمستخدمين | ✅ | ✅ | سليمة |
| SUPABASE_SUPPORT_DATA_MIGRATION.sql | SQL | migration البيانات | ✅ | ✅ | سليمة |
| RLS_POLICIES_FIX.sql | SQL | إصلاح RLS | ✅ | ✅ | سليمة |
| SUPABASE_SCHEMA_ALIGNMENT.sql | SQL | محاذاة schema | ✅ | ✅ | سليمة |
| SUPABASE_MISSING_TABLES_FIX.sql | SQL | إصلاح الجداول | ✅ | ✅ | سليمة |
| README_FIX.md | doc | إصلاح README | ❌ | ❌ | قديمة |
| SUPABASE_ADMIN_SEED_*.md | doc | إحصائيات seed | ✅ | ✅ | سليمة |
| SUPABASE_USER_CORE_*.md | doc | إحصائيات users | ✅ | ✅ | سليمة |
| SUPABASE_SUPPORT_DATA_*.md | doc | إحصائيات support | ✅ | ✅ | سليمة |

### /artifacts/mawaeedak (Web/PWA)

| المسار | النوع | الغرض | مستخدم؟ | إنتاج؟ | الحالة |
|---|---|---|---|---|---|
| package.json | config | تعريف الحزمة | ✅ | ✅ | سليمة |
| tsconfig.json | config | TypeScript | ✅ | ✅ | سليمة |
| vite.config.ts | config | إعدادات Vite | ✅ | ✅ | سليمة |
| index.html | HTML | نقطة الدخول | ✅ | ✅ | سليمة |
| src/App.tsx | component | المكون الرئيسي | ✅ | ✅ | سليمة |
| src/main.tsx | entry | نقطة البداية | ✅ | ✅ | سليمة |
| src/pages/ | dir | صفحات المسارات | ✅ | ✅ | سليمة |
| src/features/ | dir | مكونات الميزات | ✅ | ✅ | سليمة |
| src/components/ | dir | مكونات UI | ✅ | ✅ | سليمة |
| src/hooks/ | dir | React hooks | ✅ | ✅ | سليمة |
| src/lib/ | dir | أدوات مساعدة | ✅ | ✅ | سليمة |
| src/services/ | dir | خدمات API | ✅ | ✅ | سليمة |
| public/manifest.json | PWA | manifest | ✅ | ✅ | سليمة |
| public/favicon.svg | icon | أيقونة الموقع | ✅ | ✅ | سليمة |
| dist/ | dir | مخرجات البناء | ✅ | ✅ | مولّد |

### /artifacts/api-server (Backend)

| المسار | النوع | الغرض | مستخدم؟ | إنتاج؟ | الحالة |
|---|---|---|---|---|---|
| package.json | config | تعريف الحزمة | ✅ | ✅ | سليمة |
| tsconfig.json | config | TypeScript | ✅ | ✅ | سليمة |
| build.mjs | script | سكريبت البناء | ✅ | ✅ | سليمة |
| src/index.ts | entry | نقطة البداية | ✅ | ✅ | سليمة |
| src/routes/ | dir | مسارات API | ✅ | ✅ | سليمة |
| src/middlewares/ | dir | middleware | ✅ | ✅ | سليمة |
| src/lib/ | dir | أدوات مساعدة | ✅ | ✅ | سليمة |
| vercel.json | config | إعدادات Vercel | ✅ | ✅ | سليمة |
| dist/ | dir | مخرجات البناء | ✅ | ✅ | مولّد |

### /lib

| المسار | النوع | الغرض | مستخدم؟ | إنتاج؟ | الحالة |
|---|---|---|---|---|---|
| api-spec/openapi.yaml | API | مواصفات OpenAPI | ✅ | ✅ | سليمة |
| api-spec/orval.config.ts | config | إعدادات Orval | ✅ | ✅ | سليمة |
| api-client-react/src/ | lib | React Query hooks | ✅ | ✅ | سليمة |
| api-zod/src/ | lib | Zod schemas | ✅ | ✅ | سليمة |
| db/src/schema/ | lib | Drizzle schema | ✅ | ✅ | سليمة |

### /mobile (Expo/React Native)

| المسار | النوع | الغرض | مستخدم؟ | إنتاج؟ | الحالة |
|---|---|---|---|---|---|
| package.json | config | تعريف الحزمة | ✅ | ⚠️ | shell فقط |
| app.json | config | إعدادات Expo | ✅ | ⚠️ | shell فقط |
| eas.json | config | إعدادات EAS | ✅ | ⚠️ | shell فقط |
| tsconfig.json | config | TypeScript | ✅ | ⚠️ | shell فقط |
| app/index.tsx | component | الشاشة الرئيسية | ⚠️ | ❌ | **فارغ return null** |
| app/_layout.tsx | layout | تخطيط الجذر | ✅ | ⚠️ | shell فقط |

### /scripts

| المسار | النوع | الغرض | مستخدم؟ | إنتاج؟ | الحالة |
|---|---|---|---|---|---|
| package.json | config | تعريف الحزمة | ✅ | ✅ | سليمة |
| tsconfig.json | config | TypeScript | ✅ | ✅ | سليمة |
| src/ | dir | أكواد السكربتات | ✅ | ✅ | سليمة |
| test-results/ | dir | نتائج الاختبار | ✅ | ❌ | سليمة |

### /.github/workflows

| الملف | الغرض | الحالة |
|---|---|---|
| ci.yml | CI الرئيسي | ✅ |
| production-readiness-final-gate.yml | بوابة الإنتاج | ✅ |
| [codex/*] | workflows للمشاريع | ✅ |

### /docs

| الملف | الغرض | الحالة |
|---|---|---|
| CODEX_START_HERE.md | دليل البدء | ✅ |
| PROJECT_PHASES_STATUS.md | حالة المراحل | ✅ |
| OPEN_ISSUES_LEDGER.md | سجل المشاكل | ✅ |
| API_AUDIT_REPORT.md | تقرير API | ✅ |
| SECURITY_RISK_REGISTER.md | سجل المخاطر | ✅ |
| PRODUCTION_READINESS_*.md | بوابات الإنتاج | ✅ |
| MAWAEEDAK_VISUAL_IDENTITY_*.md | الهوية البصرية | ✅ |
| BUG_HUNTER_QA_REPAIR_REPORT.md | تقرير Bug Hunter | ✅ |
| DEEP_RUNTIME_AUDIT_REPORT.md | تقرير runtime | ✅ |
| RUNTIME_FIX_LOG.md | سجل الإصلاحات | ✅ |
| EXECUTION_ROADMAP.md | خارطة التنفيذ | ✅ |
| admin-*.md | ملفات Admin | ✅ |
| api-server-status.md | حالة API | ✅ |
| production-data-source.md | مصدر البيانات | ✅ |
| SUPABASE_RLS_READINESS.md | جاهزية RLS | ✅ |

---

## 3. جداول قاعدة البيانات (17 جدول)

| الجدول | النوع | user_id | RLS | Migration | Seed |
|---|---|---|---|---|---|
| appointments | user-owned | ✅ مخطط | ✅ مطبق | ✅ | ❌ |
| financial_events | user-owned | ✅ مخطط | ✅ مطبق | ✅ | ❌ |
| notifications | user-owned | ✅ مخطط | ✅ مطبق | ✅ | ❌ |
| daily_messages | admin-managed | ❌ | ❌ عام | ✅ | ✅ |
| themes | admin-managed | ❌ | ❌ عام | ✅ | ✅ |
| news | admin-managed | ❌ | ❌ عام | ✅ | ✅ |
| jobs | admin-managed | ❌ | ❌ عام | ✅ | ✅ |
| story_templates | admin-managed | ❌ | ❌ عام | ✅ | ✅ |
| complaints | shared | اختياري | ✅ | ✅ | ❌ |
| audit_logs | admin-managed | ❌ | ✅ admin | ✅ | ❌ |
| prayer_times | cache | ❌ | ❌ عام | ❌ | ❌ |
| official_financial_dates | admin-managed | ❌ | ❌ عام | ✅ | ❌ |
| official_prayer_times | admin-managed | ❌ | ❌ عام | ✅ | ❌ |
| public_events | admin-managed | ❌ | ❌ عام | ✅ | ❌ |
| app_settings | admin-managed | ❌ | ❌ عام | ✅ | ❌ |
| automation_logs | admin-managed | ❌ | ✅ admin | ✅ | ❌ |
| social_automation | admin-managed | ❌ | ✅ admin | ✅ | ❌ |

---

## 4. ملفات SQL

| الملف | الغرض | الحالة |
|---|---|---|
| SUPABASE_SCHEMA.sql | إنشاء الجداول | ✅ |
| RLS_POLICIES.sql | سياسات RLS | ✅ |
| SUPABASE_ADMIN_BOOTSTRAP.sql | تهيئة Admin | ✅ |
| SUPABASE_USER_CORE_MIGRATION.sql | migration users | ✅ |
| SUPABASE_SUPPORT_DATA_MIGRATION.sql | migration support | ✅ |
| RLS_POLICIES_FIX.sql | إصلاح RLS | ✅ |
| SUPABASE_SCHEMA_ALIGNMENT.sql | محاذاة schema | ✅ |
| SUPABASE_MISSING_TABLES_FIX.sql | إصلاح الجداول | ✅ |
| migration_add_user_id_and_official_tables.sql | إضافة user_id | ✅ |
| supabase_migration_steps.sql | خطوات migration | ✅ |
| roles_permissions.sql | تعريف الأدوار | ✅ |
| rls_policies.sql | RLS policies | ✅ |

---

## 5. ملفات Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - 'artifacts/*'
  - 'lib/*'
  - 'scripts'
```

### vercel.json (Root)

```json
{
  "framework": "vite",
  "buildCommand": "pnpm run build",
  "outputDirectory": "artifacts/mawaeedak/dist"
}
```

### vercel.json (api-server)

```json
{
  "framework": null,
  "buildCommand": "cd ../.. && pnpm --filter @workspace/api-server run build",
  "outputDirectory": "dist"
}
```

---

## 6. مخرجات البناء

### Web (artifacts/mawaeedak/dist)

| الملف | الحجم | ملاحظة |
|---|---|---|
| index.html | 1.45 KB | gzip: 0.61 KB |
| assets/index-*.js | 856 KB | gzip: 238 KB ⚠️ كبير |
| assets/index-*.css | 148 KB | gzip: 25 KB |
| assets/html2canvas-*.js | 201 KB | gzip: 47 KB |

### API Server (artifacts/api-server/dist)

| الملف | الحجم |
|---|---|
| index.mjs | كبير (3.9 MB map) |
| pinoworker files | ~150 KB each |

---

## 7. الملفات المهملة/القديمة

| الملف | السبب |
|---|---|
| README_FIX.md | تم إصلاحه في README.md الفعلي |
| test.txt (mobile) | ملف تجريبي يجب حذفه |

---

## 8. ملاحظات Critical

### 🚨 Mobile Shell فقط

- `mobile/app/index.tsx` = `return null` فقط
- لا يوجد شاشة حقيقية
- لا يوجد navigation
- لا يوجد bottom tabs
- لا يوجد routing

### ⚠️ ملفات ضخمة

- `index-*.js` = 856 KB (تحتاج code-splitting)
- `index.mjs.map` = 3.9 MB (ESM build map)

---

## 9. أوامر الفحص

```bash
# تم تنفيذها بنجاح
pnpm install --frozen-lockfile ✅
pnpm run typecheck ✅
pnpm run build ✅

# لم يتم تنفيذها (mobile shell)
cd mobile && npm run typecheck ❌ (لا معنى)
cd mobile && npm run doctor ❌ (لا معنى)
```

---

## الحكم

| المعيار | التقييم |
|---|---|
| الملفات المسجلة | ✅ 266 ملف مصدري |
| الملفات المستخدمة | ✅ ~264 |
| الملفات المهملة | ⚠️ 2 |
| ملفات Production | ✅ ~260 |
| Mobile Reality | ❌ Shell فقط |

**الحالة: NEEDS FIXES** — Mobile shell غير جاهز للإنتاج

---

*تم إنشاء هذا التقرير بواسطة Codex Agent — 2026-06-09*