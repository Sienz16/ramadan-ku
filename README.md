# Ramadan Ku

Ramadan Ku is a Malaysia-focused Ramadan companion web app built with Next.js. It helps users follow daily worship routines with location-aware prayer times, Ramadan countdowns, daily duas, Quran verses, and a digital tasbeeh.

## Highlights

- Malaysia-first experience with geolocation and manual city/state selection
- Prayer times powered by Aladhan API with next-prayer and time-remaining indicators
- Ramadan status panel with live countdown and Hijri date display
- Suhoor and iftar section based on Fajr and Maghrib timings
- Daily dua and daily Quran verse cards (Arabic, transliteration/translation)
- Built-in digital tasbeeh counter (33-count rounds)
- Mobile-first UI with animations and PWA metadata/manifest support
- Background prayer push notifications (Web Push + PostgreSQL + scheduled worker)

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- PostgreSQL (`pg`) for push subscriptions and delivery logs
- Web Push (`web-push`) for background notifications

## Project Structure

- `app/page.tsx` - Main page composition and location flow
- `app/sections/*` - Feature sections (Hero, Prayer Times, Suhoor/Iftar, Dua, Quran, Tasbeeh)
- `app/hooks/*` - Client hooks for location, prayer times, and Ramadan countdown logic
- `app/data/*` - Static dua and Quran verse datasets
- `public/manifest.json` - PWA manifest

## Getting Started

### Prerequisites

- Node.js 20+ (recommended)
- npm, pnpm, yarn, or bun

### Install dependencies

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Run production server
- `npm run lint` - Run ESLint

## Data Sources and Notes

- Prayer times and Hijri conversion use JAKIM e-Solat API.
- Ramadan date windows are currently hardcoded for 2025-2028 in `app/hooks/useCountdown.ts`.

## Push Notification Setup

### 1) Required environment variables

Set these in Dokploy (web service + worker service):

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - VAPID public key (build-time for browser)
- `PUSH_VAPID_PUBLIC_KEY` - VAPID public key (runtime for worker/API)
- `PUSH_VAPID_PRIVATE_KEY` - VAPID private key
- `PUSH_VAPID_SUBJECT` - mailto URL, e.g. `mailto:admin@example.com`

Generate VAPID keys once:

```bash
npx web-push generate-vapid-keys
```

### 2) Apply database schema

Run SQL in `docs/sql/push_notifications.sql` on your PostgreSQL database.

### 3) Run scheduled sender

Create a Dokploy worker/cron service that runs every minute:

```bash
npm run push:send-due
```

This checks current Kuala Lumpur minute and sends due prayer push notifications.

The same scheduled worker also sends special push messages on:
- 1 Ramadan (Ramadan start)
- 1 Syawal (Aidilfitri greeting)

### 4) Platform behavior

- Android: works after user grants push permission.
- iOS: user must install the PWA to Home Screen first (iOS 16.4+) and then allow notifications.

### Manual push test commands

You can send a manual push from the server terminal:

```bash
npm run push:test -- --all
```

Target specific zone:

```bash
npm run push:test -- --zone=WLY01
```

Target one endpoint:

```bash
npm run push:test -- --endpoint=https://example.push/abc
```

Optional custom message:

```bash
npm run push:test -- --zone=WLY01 --title="Ujian" --body="Ini notifikasi ujian"
```

## Localization

The interface is primarily in Bahasa Melayu with Arabic and English support in selected UI labels and content.

## Deployment

This app can be deployed to Vercel or any Node-compatible hosting that supports Next.js.
