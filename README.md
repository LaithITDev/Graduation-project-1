<picture>
 <source media="(prefers-color-scheme: light)" srcset="https://github.com/rogersi9/NeuroNote/blob/main/client2/public/logo-black.svg">
 <img alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://github.com/rogersi9/NeuroNote/blob/main/client2/public/logo-white.svg">
</picture>

**Our app aims to simulate taking input from an EEG device to convert brain signals into music, allowing users to choose their preferred instrument from a list of options.**

## Live demo

[Open NeuroNote](https://dapper-begonia-40055b.netlify.app/register)

# Setting up the project

## Prerequisites

- Node.js 22.12 or higher and npm

## Install dependencies

Run these commands from the repository root:

```powershell
cd backend
npm.cmd ci
cd ..\client2
npm.cmd ci
```

In PowerShell, use `npm.cmd` if the `npm` command is blocked by the script execution policy. In Command Prompt or other shells, use `npm`.

## Run locally

Start each app in a separate terminal:

```powershell
cd backend
npm.cmd run start:dev
```

```powershell
cd client2
$env:REACT_APP_API_URL = "http://localhost:7070"
npm.cmd start
```

Open the frontend at [http://localhost:3000](http://localhost:3000) and the API documentation at [http://localhost:7070/api](http://localhost:7070/api). The backend uses a local SQLite database; no separate database service is required.

If another application is already using port 7070, choose a free port for the backend in its terminal:

```powershell
$env:PORT = "7071"
npm.cmd run start:dev
```

Then open the API documentation at [http://localhost:7071/api](http://localhost:7071/api).

## Deploy authentication on Netlify

The Netlify Functions provide `/api/auth/login`, `/api/auth/register`, and `/api/auth/me` using Netlify Database. To enable them:

1. In your Netlify site, create or enable a database under **Data & Storage → Database**.
2. Add a `JWT_SECRET` environment variable with at least 32 random bytes. You can generate one locally with:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

3. Keep the Netlify build base set to `client2` and redeploy. Netlify applies the users-table migration from `client2/netlify/database/migrations`.

The authentication functions obtain the database connection string from `@netlify/database`; you do not need to add a separate database URL environment variable.

The deployed frontend calls the same-origin `/api/auth/...` routes; no `REACT_APP_API_URL` or CORS configuration is needed in production. Existing accounts in the local SQLite database are not copied to Netlify Database and will need to register again.

# النسخة العربية

# إعداد المشروع

## المتطلبات الأساسية

- Node.js الإصدار 22.12 أو أحدث وnpm

## تثبيت الاعتماديات

نفّذ الأوامر التالية من المجلد الرئيسي للمستودع:

```powershell
cd backend
npm.cmd ci
cd ..\client2
npm.cmd ci
```

في PowerShell استخدم `npm.cmd` إذا منع إعداد تنفيذ البرامج النصية تشغيل أمر `npm`. في موجه الأوامر أو الطرفيات الأخرى استخدم `npm`.

## التشغيل محلياً

شغّل كل تطبيق في نافذة طرفية منفصلة:

```powershell
cd backend
npm.cmd run start:dev
```

```powershell
cd client2
$env:REACT_APP_API_URL = "http://localhost:7070"
npm.cmd start
```

افتح الواجهة الأمامية على [http://localhost:3000](http://localhost:3000) وتوثيق الواجهة البرمجية على [http://localhost:7070/api](http://localhost:7070/api). يستخدم الخادم قاعدة بيانات SQLite محلية ولا يتطلب تشغيل خدمة قاعدة بيانات منفصلة.

إذا كان تطبيق آخر يستخدم المنفذ 7070، اختر منفذاً متاحاً للخادم في نافذته:

```powershell
$env:PORT = "7071"
npm.cmd run start:dev
```

ثم افتح توثيق الواجهة البرمجية على [http://localhost:7071/api](http://localhost:7071/api).

## نشر المصادقة على Netlify

توفر Netlify Functions المسارات `/api/auth/login` و`/api/auth/register` و`/api/auth/me` باستخدام قاعدة بيانات Netlify. لتفعيلها:

1. أنشئ قاعدة بيانات أو فعّلها من موقع Netlify ضمن **Data & Storage → Database**.
2. أضف متغير البيئة `JWT_SECRET` بقيمة عشوائية لا تقل عن 32 بايت. يمكن توليدها محلياً باستخدام الأمر:

   ```powershell
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

3. اترك مجلد البناء الأساسي في Netlify مضبوطاً على `client2` ثم أعد النشر. ستطبّق Netlify ترحيل جدول المستخدمين من `client2/netlify/database/migrations`.

تحصل دوال المصادقة على رابط قاعدة البيانات من `@netlify/database`، ولا يلزم إضافة متغير بيئة منفصل لرابط قاعدة البيانات.

تتصل الواجهة المنشورة بمسارات `/api/auth/...` على النطاق نفسه، ولا تحتاج في الإنتاج إلى `REACT_APP_API_URL` أو إعداد CORS. لن تُنسخ الحسابات الموجودة في قاعدة SQLite المحلية إلى قاعدة Netlify، لذا سيحتاج المستخدمون إلى التسجيل مجدداً.
