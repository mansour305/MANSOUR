# 🟦 مواعيدك (Mawaeedak) - Saudi Appointments System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Flutter](https://img.shields.io/badge/Flutter-3.24.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

**نظام سعودي متكامل لإدارة المواعيد والرواتب والدعوم**

[English](#english) • [العربية](#العربية)

---

## 🌍 English

**Mawaeedak** is a comprehensive Saudi Arabian appointments and payroll management system built with Flutter and Node.js.

### Features

- 📅 **Appointments Management** - Full CRUD for calendar events
- 💰 **Salaries & Supports** - Track payment schedules and government support
- 🔔 **Notifications System** - Real-time push notifications
- 🕌 **Prayer Times** - Automatic prayer time calculations for Saudi Arabia
- 📱 **Cross-Platform** - Works on iOS, Android, and Web

### Tech Stack

- **Frontend**: Flutter 3.24.0 (Dart)
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT + bcrypt

---

## العربية

### حول المشروع

**مواعيدك** هو نظام متكامل لإدارة المواعيد والرواتب والدعوم في المملكة العربية السعودية.

### الميزات

- ✅ نظام مواعيد كامل (CRUD)
- ✅ إدارة الرواتب والدعوم الحكومية
- ✅ نظام إشعارات متكامل
- ✅ مواقيت الصلاة (الرياض)
- ✅ واجهة عربية RTL
- ✅ لوحة تحكم للمشرفين
- ✅ جاهز للنشر الإنتاجي

---

## 🏗️ المكونات

```
mawaeedak/
├── mawaeedak_api/          # Backend API (Node.js)
├── mawaeedak_app/          # User Mobile App (Flutter)
├── mawaeedak_admin/        # Admin Dashboard (Flutter)
└── .github/workflows/      # CI/CD Pipelines
```

### 1. API Backend (`mawaeedak_api`)

- **التقنية**: Node.js + Express
- **قاعدة البيانات**: SQLite
- **المصادقة**: JWT + bcrypt
- **المنفذ**: 3000

### 2. تطبيق المستخدم (`mawaeedak_app`)

- **التقنية**: Flutter 3.24.0
- **المنصات**: iOS, Android, Web
- **الحالة**: Production Ready

### 3. لوحة التحكم (`mawaeedak_admin`)

- **التقنية**: Flutter Web
- **الوظائف**: إدارة كاملة للنظام
- **الحالة**: Production Ready

---

## 🚀 البدء السريع

### المتطلبات

- Node.js 20+
- Flutter 3.24.0
- Git

### 1. استنساخ المشروع

```bash
git clone https://github.com/mansour305/mawaeedak.git
cd mawaeedak
```

### 2. إعداد API

```bash
cd mawaeedak_api

# تثبيت التبعيات
npm install

# تشغيل سيرفر التطوير
npm run dev
```

### 3. إعداد تطبيق المستخدم

```bash
cd mawaeedak_app

# تثبيت التبعيات
flutter pub get

# تشغيل التطبيق
flutter run
```

---

## 🌐 النشر

### API Deployment

#### Render (موصى به)

1. أنشئ حساب على [Render](https://render.com)
2. اربط مستودع GitHub
3. أنشئ Web Service جديد
4. الإعدادات:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### User App Deployment

#### Vercel (Web)

```bash
cd mawaeedak_app
vercel --prod
```

---

## 📡 الـ API

### Base URL

```
Production: https://api.mawaeedak.com/api
Development: http://localhost:3000/api
```

### بيانات تسجيل الدخول

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| Admin | admin@mawaeedak.com | admin123 |

---

## 🔐 الأمان

- ✅ JWT Authentication
- ✅ bcrypt Password Hashing
- ✅ CORS Configuration
- ✅ Input Validation

---

## 🤝 المساهمة

1. Fork المشروع
2. أنشئ فرع للميزة
3. Commit التغييرات
4. افتح Pull Request

---

## 📄 الرخصة

MIT License

---

**صُنع بـ ❤️ في المملكة العربية السعودية 🇸🇦**