# Mawaeedak (مواعيدك)

تطبيق ويب عربي لتنظيم المواعيد والصلاة.

## نظرة عامة

- **النوع**: Progressive Web App (PWA) مع لوحة تحكم إدارية
- **اللغة**: TypeScript, React, Node.js
- **التصميم**: RTL-first, Arabic-native
- **التكامل**: Supabase, Vercel, Railway

## هيكل المشروع

```
mawaeedak/
├── artifacts/
│   ├── mawaeedak/          # تطبيق الويب الأمامي (React + Vite)
│   └── api-server/         # خادم API (Express)
├── lib/                    # مكتبات مشتركة
│   ├── api-client-react/   # عميل API للـ React
│   ├── api-spec/           # مواصفات OpenAPI
│   ├── api-zod/            # مخططات Zod للتحقق
│   ├── db/                 # مخططات قاعدة البيانات (Drizzle)
│   └── shared/             # أدوات مشتركة
├── supabase/               # Supabase Edge Functions و Migrations
├── scripts/                # سكريبتات البناء والاختبار
└── package.json            # Workspace root
```

## تشغيل المشروع

```bash
# تثبيت الاعتماديات
pnpm install

# تشغيل تطبيق الويب (التطوير)
cd artifacts/mawaeedak
pnpm run dev

# تشغيل خادم API (التطوير)
cd artifacts/api-server
pnpm run dev

# فحص TypeScript
pnpm run typecheck

# فحص شامل
pnpm run build
```

## المتغيرات البيئية

انظر `.env.example` للمتغيرات المطلوبة.

### متغيرات الـ Frontend (Vite)
- `VITE_SUPABASE_URL` - رابط Supabase
- `VITE_SUPABASE_ANON_KEY` - مفتاح Anon العام
- `VITE_API_BASE_URL` - رابط API (اختياري)
- `VITE_VAPID_PUBLIC_KEY` - مفتاح VAPID للإشعارات

### متغيرات الـ API Server
- `PORT` - منفذ الخادم
- `SUPABASE_URL` - رابط Supabase (للخادم)
- `SUPABASE_ANON_KEY` - مفتاح Anon (للخادم)
- `ALLOWED_ORIGINS` -_origins المسموحة (للإنتاج)

## قواعد الكود

1. **الأمان أولاً**: لا تلتزم أسرار في الكود، استخدم `.env`
2. **RTL**: جميع المكونات تكون RTL بشكل افتراضي
3. **TypeScript صارم**: لا تستخدم `any`
4. **التحقق من المدخلات**: استخدم Zod لجميع المدخلات
5. **RLS في Supabase**: جميع الجداول يجب أن يكون لها RLS مفعّل

## قواعد CSL

1. استخدم `any` فقط عند الضرورة القصوى
2. لا تستخدم `console.log` في الكود الإنتاجي
3. جميع الـ API routes يجب أن يكون لها rate limiting
4. استخدم error boundaries للـ React components

## ملاحظات تقنية

- **Prayer Engine**: يستخدم AlAdhan API مع Supabase كـ fallback
- **Authentication**: Supabase Auth مع JWT
- **Database**: PostgreSQL عبر Supabase
- **Deployment**: Vercel للـ Frontend، Railway للـ API
- **Monitoring**: Pino logger مع audit logs

