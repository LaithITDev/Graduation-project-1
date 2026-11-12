<picture>
 <source media="(prefers-color-scheme: light)" srcset="https://github.com/rogersi9/NeuroNote/blob/main/client2/public/logo-black.svg">
 <img alt="Shows an illustrated sun in light color mode and a moon with stars in dark color mode." src="https://github.com/rogersi9/NeuroNote/blob/main/client2/public/logo-white.svg">
</picture>

**Our app aims to simulate taking input from an EEG device to convert brain signals into music, allowing users to choose their preferred instrument from a list of options.**

## Live demo

[Open NeuroNote](https://6af5de18f07d15d072cd4c77--dapper-begonia-40055b.netlify.app/)

# Setting up the project

## Prerequisites

- Node.js 14 or higher and npm

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
npm.cmd start
```

Open the frontend at [http://localhost:3000](http://localhost:3000) and the API documentation at [http://localhost:7070/api](http://localhost:7070/api). The backend uses a local SQLite database; no separate database service is required.

If another application is already using port 7070, choose a free port for the backend in its terminal:

```powershell
$env:PORT = "7071"
npm.cmd run start:dev
```

Then open the API documentation at [http://localhost:7071/api](http://localhost:7071/api).

# النسخة العربية

# إعداد المشروع

## المتطلبات الأساسية

- Node.js الإصدار 14 أو أحدث وnpm

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
npm.cmd start
```

افتح الواجهة الأمامية على [http://localhost:3000](http://localhost:3000) وتوثيق الواجهة البرمجية على [http://localhost:7070/api](http://localhost:7070/api). يستخدم الخادم قاعدة بيانات SQLite محلية ولا يتطلب تشغيل خدمة قاعدة بيانات منفصلة.

إذا كان تطبيق آخر يستخدم المنفذ 7070، اختر منفذاً متاحاً للخادم في نافذته:

```powershell
$env:PORT = "7071"
npm.cmd run start:dev
```

ثم افتح توثيق الواجهة البرمجية على [http://localhost:7071/api](http://localhost:7071/api).
