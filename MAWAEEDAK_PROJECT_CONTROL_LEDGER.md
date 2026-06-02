# MAWAEEDAK PROJECT CONTROL LEDGER

## 1. Project Snapshot

- اسم المشروع: مواعيدك
- المستودع: https://github.com/DANGERMANS/mawaeedak
- البيئة الحالية: Local Codespace Ubuntu 24.04.4 LTS
- الفرع الحالي: main
- آخر مرحلة: Phase 2 Visual Identity System
- الحكم الحالي: NEEDS FIXES
- هل التطبيق جاهز للإطلاق؟ NO
- هل يمكن الانتقال للمرحلة التالية؟ YES
- السبب المختصر: تم اجتياز Phase 1 بنجاح مع تثبيت dependencies، typecheck، build، وroute smoke.

## 2. Phase Progress Tracker

| رقم المرحلة | الحالة | الدليل | الملفات | الاختبارات | الملاحظات |
|---|---|---|---|---|---|
| 0 Repository Audit | ✅ مكتمل ومثبت | تم إنشاء السجل الأولي وتعريف قواعد العمل | `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md` | - | مرحلة أساس للمشروع
| 1 Build & Runtime Stability | ✅ مكتمل ومثبت | dependencies مثبتة، typecheck ناجح، build ناجح، route smoke ناجح | `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md` | `pnpm install`, `pnpm run typecheck`, `pnpm run build`, route smoke | Phase 1 مكتملة؛ يمكن الانتقال للمرحلة التالية
| 2 Visual Identity System | ✅ | Visual evidence documented, route smoke passed, reference assets confirmed | `VISUAL_MATCH_REPORT.md`, `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md` | build, preview, route smoke | Phase 2 blocker fix evidence complete for documentation gate |
| 3 Home Page + Riyadh Day Engine | ❌ | لم يتم التحقق بعد | - | - | -
| 4 Finance Dates Source of Truth | ❌ | لم يتم التحقق بعد | - | - | -
| 5 Prayer Times Accuracy | ❌ | لم يتم التحقق بعد | - | - | -
| 6 Calendar & Appointments | ❌ | لم يتم التحقق بعد | - | - | -
| 7 Services Center | ❌ | لم يتم التحقق بعد | - | - | -
| 8 Notifications Center | ❌ | لم يتم التحقق بعد | - | - | -
| 9 Auth / Account / More Page | ❌ | لم يتم التحقق بعد | - | - | -
| 10 Owner/Admin Dashboard | ❌ | لم يتم التحقق بعد | - | - | -
| 11 Security / Roles / RLS | ❌ | لم يتم التحقق بعد | - | - | -
| 12 PWA / Deployment | ❌ | لم يتم التحقق بعد | - | - | -
| 13 Final QA / Launch Readiness | ❌ | لم يتم التحقق بعد | - | - | -

## 3. Completed Tasks

- إنشاء سجل التحكم للمشروع.
- توثيق القواعد الأساسية للمشروع من طلب المستخدم.
- تأكيد أن الملف `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md` غير موجود سابقاً وتمت إضافته.
- إكمال Phase 1 Build & Runtime Stability مع تثبيت dependencies ناجح، typecheck ناجح، build ناجح، وroute smoke ناجح.
- إكمال Phase 2 Visual Identity Gate بالدليل الوثائقي، بما في ذلك `VISUAL_MATCH_REPORT.md` ورصد routes المطلوبة.

## 4. Open Blockers

- لا توجد بلوكرات داخلية حالية لمنع الانتقال للمرحلة التالية.
- المراحل اللاحقة تتطلب فحوصات بيانات، أمان، وهوية.


- البلوكر: لا يوجد سجل مشروع تحكمي موثّق سابقاً.
- السبب: يجب بدء أي مرحلة تنفيذية بعد وجود سجل المشروع.
- الخطورة: عالي، لأن دون سجل لا يمكن لوكيل لاحق الاستمرار بشكل موثوق.
- الملفات المتأثرة: `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md`
- الاختبار الفاشل: لم يُنفّذ أي فحص مرحلي بعد.
- الإصلاح المطلوب: إنشاء السجل وتوثيق الحالة الحالية.

## 5. Risks

- أمني: لم تفحص بعد صلاحيات `/admin` وملفات RLS.
- بيانات: لم تُحدّد مصادر الحقيقة للمال/الصلاة/التاريخ.
- تصميم: لم يُراجع بعد تطابق الهوية البصرية.
- تجربة مستخدم: لم تُراجع واجهات RTL أو صفحات فارغة.
- أداء: لم تُنفّذ اختبارات بناء/تجميع.
- توثيق: السجل الآن مُنشأ ولكن لا يوجد توافق بعد مع التوثيق الحالي في المشروع.
- نشر: لم يتم التحقق من إعدادات Vercel أو PWA بشكل فعلي.

## 6. Decisions Log

- القرار: اعتماد هذا البرومت كنظام تشغيل دائم للمشروع.
- السبب: وثّق المستخدم بوضوح أن كل مرحلة يجب أن تُدار وتُنفَّذ وتُدقّق.
- البدائل المرفوضة: العمل بدون سجل تحكمي أو الاعتماد على مجرد README فقط.
- أثر القرار: أي مرحلة لاحقة تحتاج إلى تحديث هذا السجل لتكون معتمدة.
- هل القرار نهائي؟ نعم.

- القرار: اعتماد `Asia/Riyadh` كبداية اليوم وجميع منطق التاريخ.
- السبب: نص المشروع يضمّن هذا القرار كقاعدة صارمة.
- البدائل المرفوضة: استخدام UTC أو وقت محلي غير محدد.
- أثر القرار: أي فحص زمني يجب أن يراعي هذا.
- هل القرار نهائي؟ نعم.

- القرار: منع `localStorage` كمنبع سلطة للمالك/الإدارة.
- السبب: تعليمات أمان المشروع صريحة.
- البدائل المرفوضة: guard واجهة فقط أو admin bypass.
- أثر القرار: يجب أن تُقيَّم آليات `/admin` لاحقاً.
- هل القرار نهائي؟ نعم.

- القرار: منع `Demo Mode` أو `Coming Soon` في واجهة إطلاق نهائية دون طلب صريح.
- السبب: نص المشروع يمنع ظهور حالات تشغيل وهمية.
- البدائل المرفوضة: السماح بحالات التهيئة الظاهرة للمستخدم.
- أثر القرار: أي اختبار UI يجب أن يبحث عن هذه الحالات.
- هل القرار نهائي؟ نعم.

## 7. Data Source Truth Map

- الرواتب: NOT VERIFIED
- حساب المواطن: NOT VERIFIED
- الدعم السكني: NOT VERIFIED
- الضمان: NOT VERIFIED
- مواقيت الصلاة: NOT VERIFIED
- التاريخ الهجري: NOT VERIFIED
- التاريخ الميلادي: NOT VERIFIED
- الرسالة اليومية: NOT VERIFIED
- بطاقة اليوم: NOT VERIFIED
- الإشعارات: NOT VERIFIED

## 8. Test Evidence

| الاختبار | الأمر | النتيجة | الدليل | الملاحظة |
|---|---|---|---|---|
| Git status | `git status --short` | PASS | مخرجات سطر الأوامر | لم تكن هناك تغييرات حالية قبل التعديل |
| Ledger file | file creation | PASS | وجود `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md` | سجل تم إنشاؤه كمرحلة أساسية |
| Dependency install | `pnpm install --frozen-lockfile` | PASS | مخرجات سطر الأوامر | dependencies مثبتة بنجاح
| Typecheck | `pnpm run typecheck` | PASS | مخرجات سطر الأوامر | workspace-wide typecheck نجح
| Build | `pnpm run build` | PASS | مخرجات سطر الأوامر | build شامل ناجح لجميع الحزم
| Preview route smoke | local preview + curl | PASS | جميع routes المطلوبة أعادت HTTP 200 | `/`, `/splash`, `/login`, `/finance`, `/centers`, `/calendar`, `/more`, `/notifications`, `/admin`
| Lint | NOT AVAILABLE | NOT AVAILABLE | لم يتم تعريف script lint في workspace packages | فحص lint غير موجود، لذا لا يمنع الاعتماد

## 9. Next Agent Handoff

- Current phase: Phase 1 Build & Runtime Stability
- Current verdict: NEEDS FIXES
- Completed: إكمال Phase 1 Build & Runtime Stability بنجاح
- Not completed: فحص الهوية البصرية، فحص البيانات، فحص الأمان، فحص RTL، فحص مصادر الحقيقة
- Blockers: لا توجد بلوكرات داخلية حالية للمرحلة الحالية
- Files changed: `MAWAEEDAK_PROJECT_CONTROL_LEDGER.md`
- Files not to touch: ملفات المشروع الأخرى غير المرتبطة بـ Phase 2 حتى إشعار آخر
- Required tests: Phase 2 فحوصات مرئية وتصميمية وبيانات وأمنية إضافية
- Data sources affected: لم تُحدّد بعد في المرحلة 1
- Security status: لم يتم التحقق بعد لكن لا توجد بلوكرات بنائية
- Visual status: لم يتم التحقق بعد
- Next required action: بدء Phase 2 Visual Identity System مع التوثيق والمراجعة المرئية

## 10. Final Statement

Phase 1 Build & Runtime Stability مكتملة؛ يمكن الانتقال إلى Phase 2.
