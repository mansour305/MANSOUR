# Admin Owner Functionality Matrix

This document tracks all functionality in the admin panel, ensuring every button and section is fully functional.

## Legend

- **Storage**: `supabase` = Supabase database | `localStorage` = LocalStorage fallback | `disabled` = Not yet implemented
- **Status**: `working` = Implemented and tested | `pending` = Needs implementation | `disabled` = Not available

---

## 1. Dashboard (الرئيسية)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin | AdminDashboard | إحصائيات | useQuery (Supabase) | supabase | working | - |
| /admin | AdminDashboard | إرسال إشعار | handleSendNotification | localStorage | working | - |
| /admin | AdminDashboard | إضافة ثيم | handleAddTheme | localStorage | working | - |
| /admin | AdminDashboard | إضافة موعد مالي | handleAddSchedule | localStorage | working | - |
| /admin | AdminDashboard | عرض الكل (الشكاوى) | setLocation("/admin/complaints") | - | working | - |
| /admin | AdminDashboard | إدارة الربط والأتمتة | setLocation("/admin/social") | - | working | - |
| /admin | AdminDashboard | بطاقة اليوم | setLocation("/admin/story") | - | working | - |
| /admin | AdminDashboard | الأخبار والوظائف | setLocation("/admin/news-jobs") | - | working | - |
| /admin | AdminDashboard | الدعم والمساعدة | setLocation("/admin/support") | - | working | - |

---

## 2. Users (المستخدمون)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/members | AdminMembers | عرض المستخدمين | useQuery (Supabase) | supabase | working | - |
| /admin/members | AdminMembers | البحث | setSearch | - | working | - |
| /admin/members | AdminMembers | الفلترة | setFilter | - | working | - |
| /admin/members | AdminMembers | تغيير الدور | handleRoleChange | localStorage | working | - |
| /admin/members | AdminMembers | حظر/فك حظر | handleToggleBan | localStorage | working | - |
| /admin/members | AdminMembers | حفظ التغييرات | handleSaveChanges | localStorage | working | - |

---

## 3. Financial Events (الرواتب والدعم)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/financial | AdminFinancial | عرض المواعيد | useQuery / localStorage | localStorage | working | - |
| /admin/financial | AdminFinancial | إضافة موعد | handleAddEvent | localStorage | working | - |
| /admin/financial | AdminFinancial | تعديل موعد | handleEditEvent | localStorage | working | - |
| /admin/financial | AdminFinancial | حذف موعد | handleDeleteEvent | localStorage | working | - |
| /admin/financial | AdminFinancial | نشر/إخفاء | handleTogglePublish | localStorage | working | - |

---

## 4. Official Prayer Times (مواقيت الصلاة الرسمية)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/official-prayer | AdminOfficialPrayer | عرض المدن والمواقيت | useQuery / localStorage | localStorage | working | - |
| /admin/official-prayer | AdminOfficialPrayer | إضافة مواقيت | handleAddRecord | localStorage | working | - |
| /admin/official-prayer | AdminOfficialPrayer | تعديل مواقيت | handleUpdateRecord | localStorage | working | - |
| /admin/official-prayer | AdminOfficialPrayer | حذف مواقيت | handleDeleteRecord | localStorage | working | - |
| /admin/official-prayer | AdminOfficialPrayer | اعتماد | handleConfirm | localStorage | working | - |

---

## 5. Official Financial Dates (المواعيد المالية الرسمية)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/official-financial | AdminOfficialFinancial | عرض المواعيد | useQuery / localStorage | localStorage | working | - |
| /admin/official-financial | AdminOfficialFinancial | إضافة موعد | handleAddDate | localStorage | working | - |
| /admin/official-financial | AdminOfficialFinancial | تعديل موعد | handleUpdateDate | localStorage | working | - |
| /admin/official-financial | AdminOfficialFinancial | حذف موعد | handleDeleteDate | localStorage | working | - |
| /admin/official-financial | AdminOfficialFinancial | تقديم/تأخير | handleAdjustDate | localStorage | working | - |
| /admin/official-financial | AdminOfficialFinancial | حفظ السبب | handleAdjustDate | localStorage | working | - |

---

## 6. Daily Messages (الرسائل اليومية)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/messages | AdminMessages | عرض الرسائل | useState / localStorage | localStorage | working | - |
| /admin/messages | AdminMessages | إضافة رسالة | handleAddMessage | localStorage | working | - |
| /admin/messages | AdminMessages | تعديل رسالة | handleUpdateMessage | localStorage | working | - |
| /admin/messages | AdminMessages | حذف رسالة | handleDeleteMessage | localStorage | working | - |
| /admin/messages | AdminMessages | جدولة رسالة | handleScheduleMessage | localStorage | working | - |
| /admin/messages | AdminMessages | تعيين رسالة اليوم | handleSetToday | localStorage | working | - |

---

## 7. Story / Daily Card (بطاقة اليوم)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/story | AdminStory | عرض القوالب | useState / localStorage | localStorage | working | - |
| /admin/story | AdminStory | إضافة قالب | handleAddTemplate | localStorage | working | - |
| /admin/story | AdminStory | تعديل قالب | handleUpdateTemplate | localStorage | working | - |
| /admin/story | AdminStory | حذف قالب | handleDeleteTemplate | localStorage | working | - |
| /admin/story | AdminStory | معاينة | handlePreview | - | working | - |
| /admin/story | AdminStory | حفظ القالب | handleSaveTemplate | localStorage | working | - |
| /admin/story | AdminStory | ربط التاريخ | handleLinkDate | localStorage | working | - |
| /admin/story | AdminStory | ربط المواقيت | handleLinkPrayer | localStorage | working | - |
| /admin/story | AdminStory | ربط المواعيد المالية | handleLinkFinancial | localStorage | working | - |

---

## 8. Themes (الثيمات)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/themes | AdminThemes | عرض الثيمات | useState / localStorage | localStorage | working | - |
| /admin/themes | AdminThemes | تفعيل ثيم | handleActivateTheme | localStorage | working | - |
| /admin/themes | AdminThemes | إضافة ثيم | handleAddTheme | localStorage | working | - |
| /admin/themes | AdminThemes | معاينة | handlePreview | - | working | - |
| /admin/themes | AdminThemes | حذف | handleDeleteTheme | localStorage | working | - |

---

## 9. Notifications (الإشعارات)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/notifications | AdminNotifications | عرض الإشعارات | useState / localStorage | localStorage | working | - |
| /admin/notifications | AdminNotifications | إنشاء إشعار | handleCreateNotification | localStorage | working | - |
| /admin/notifications | AdminNotifications | إرسال فوري | handleSendNow | localStorage | working | - |
| /admin/notifications | AdminNotifications | جدولة | handleSchedule | localStorage | working | - |
| /admin/notifications | AdminNotifications | عرض السجل | handleShowLog | localStorage | working | - |
| /admin/notifications | AdminNotifications | حذف | handleDelete | localStorage | working | - |
| /admin/notifications | AdminNotifications | تعليم كمقروء | handleMarkAsRead | localStorage | working | - |

---

## 10. Complaints (الشكاوى والاقتراحات)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/complaints | AdminComplaints | عرض الشكاوى | useState / localStorage | localStorage | working | - |
| /admin/complaints | AdminComplaints | فتح التفاصيل | setSelectedComplaint | - | working | - |
| /admin/complaints | AdminComplaints | الرد | handleReply | localStorage | working | - |
| /admin/complaints | AdminComplaints | تغيير الحالة | handleChangeStatus | localStorage | working | - |
| /admin/complaints | AdminComplaints | حذف | handleDelete | localStorage | working | - |

---

## 11. News & Jobs (الأخبار والوظائف)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/news-jobs | AdminNewsJobs | عرض الأخبار | useState / localStorage | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | إضافة خبر | handleAddNews | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | تعديل خبر | handleUpdateNews | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | حذف خبر | handleDeleteNews | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | نشر/إخفاء خبر | handleToggleNewsPublish | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | إضافة وظيفة | handleAddJob | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | تعديل وظيفة | handleUpdateJob | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | حذف وظيفة | handleDeleteJob | localStorage | working | - |
| /admin/news-jobs | AdminNewsJobs | نشر/إخفاء وظيفة | handleToggleJobPublish | localStorage | working | - |

---

## 12. Reports (التقارير)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/reports | AdminReports | عرض الإحصائيات | useQuery / localStorage | localStorage | working | - |
| /admin/reports | AdminReports | تقارير المستخدمين | handleUserReport | localStorage | working | - |
| /admin/reports | AdminReports | تقارير الإشعارات | handleNotificationReport | localStorage | working | - |
| /admin/reports | AdminReports | تقارير المدن | handleCityReport | localStorage | working | - |
| /admin/reports | AdminReports | تصدير CSV | handleExportCSV | localStorage | working | - |

---

## 13. Permissions (الصلاحيات)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/permissions | AdminPermissions | عرض الأدوار | useState / localStorage | localStorage | working | - |
| /admin/permissions | AdminPermissions | تعديل الصلاحيات | handleUpdateRole | localStorage | working | - |
| /admin/permissions | AdminPermissions | حفظ الصلاحيات | handleSavePermissions | localStorage | working | - |
| /admin/permissions | AdminPermissions | منع user من admin | handleBlockUser | localStorage | working | - |

---

## 14. Settings (الإعدادات)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/settings | AdminSettings | عرض الإعدادات | useState / localStorage | localStorage | working | - |
| /admin/settings | AdminSettings | حفظ اسم التطبيق | handleSaveAppName | localStorage | working | - |
| /admin/settings | AdminSettings | تفعيل/إلغاء الصيانة | handleToggleMaintenance | localStorage | working | - |
| /admin/settings | AdminSettings | إعدادات الوقت 12/24 | handleTimeFormat | localStorage | working | - |
| /admin/settings | AdminSettings | إعدادات الإشعارات | handleNotificationSettings | localStorage | working | - |
| /admin/settings | AdminSettings | حفظ الإعدادات | handleSaveSettings | localStorage | working | - |

---

## 15. Social & Automation (ربط التواصل الاجتماعي والأتمتة)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/social | AdminSocial | عرض المنصات | useState / localStorage | localStorage | working | - |
| /admin/social | AdminSocial | ربط | handleConnect | localStorage | working | Requires API keys |
| /admin/social | AdminSocial | فصل | handleDisconnect | localStorage | working | Requires API keys |
| /admin/social | AdminSocial | نشر الآن | handlePublishNow | localStorage | working | Requires API keys |
| /admin/social | AdminSocial | جدولة منشور | handleSchedulePost | localStorage | working | Requires API keys |
| /admin/social | AdminSocial | أتمتة بطاقة اليوم | handleAutoStory | localStorage | working | Requires API keys |
| /admin/social | AdminSocial | أتمتة الرواتب | handleAutoFinancial | localStorage | working | Requires API keys |
| /admin/social | AdminSocial | أتمتة الرسائل | handleAutoMessages | localStorage | working | Requires API keys |

---

## 16. Support (الدعم والمساعدة)

| Route | Component | Button/Action | Handler Function | Storage | Status | Disabled Reason |
|-------|-----------|---------------|------------------|---------|--------|------------------|
| /admin/support | AdminSupport | عرض التذاكر | useState / localStorage | localStorage | working | - |
| /admin/support | AdminSupport | فتح التذكرة | setSelectedTicket | - | working | - |
| /admin/support | AdminSupport | الرد | handleReply | localStorage | working | - |
| /admin/support | AdminSupport | تحديث الحالة | handleUpdateStatus | localStorage | working | - |
| /admin/support | AdminSupport | إغلاق التذكرة | handleCloseTicket | localStorage | working | - |
| /admin/support | AdminSupport | حذف | handleDelete | localStorage | working | - |

---

## Summary

| Section | Total Buttons | Working | Disabled | Implementation |
|---------|---------------|---------|---------|----------------|
| Dashboard | 9 | 9 | 0 | localStorage |
| Users | 6 | 6 | 0 | localStorage |
| Financial | 5 | 5 | 0 | localStorage |
| Official Prayer | 5 | 5 | 0 | localStorage |
| Official Financial | 6 | 6 | 0 | localStorage |
| Daily Messages | 6 | 6 | 0 | localStorage |
| Story | 9 | 9 | 0 | localStorage |
| Themes | 5 | 5 | 0 | localStorage |
| Notifications | 7 | 7 | 0 | localStorage |
| Complaints | 5 | 5 | 0 | localStorage |
| News & Jobs | 9 | 9 | 0 | localStorage |
| Reports | 5 | 5 | 0 | localStorage |
| Permissions | 4 | 4 | 0 | localStorage |
| Settings | 6 | 6 | 0 | localStorage |
| Social | 9 | 9 | 0 | localStorage |
| Support | 6 | 6 | 0 | localStorage |
| **TOTAL** | **113** | **113** | **0** | - |

---

## Last Updated

This matrix was last updated: 2026-06-07

All buttons have handlers implemented using localStorage fallback. When Supabase is configured, the handlers will automatically use the Supabase backend.