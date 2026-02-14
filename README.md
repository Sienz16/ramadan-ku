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

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion

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

- Prayer times and Hijri conversion use [Aladhan API](https://aladhan.com/prayer-times-api).
- Ramadan date windows are currently hardcoded for 2025-2028 in `app/hooks/useCountdown.ts`.
- No backend is required; app behavior is primarily client-side.

## Localization

The interface is primarily in Bahasa Melayu with Arabic and English support in selected UI labels and content.

## Deployment

This app can be deployed to Vercel or any Node-compatible hosting that supports Next.js.
