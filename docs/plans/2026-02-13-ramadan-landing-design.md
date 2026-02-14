# Ramadan-Ku Landing Page Design

## Overview
A beautiful, spiritually-focused landing page for Ramadan featuring prayer times, countdowns, daily duas, and Quran verses.

## Visual Direction: Celestial Night

### Color Palette
- **Background**: Deep midnight gradient `#0a1628` → `#1a2744` → `#0f172a`
- **Primary Accent**: Luminous Gold `#ffd700`, `#c9a227`, `#f4e4ba`
- **Secondary**: Soft Moonlight `#e2e8f0`, `#94a3b8`
- **Accent Glow**: Starlight White `#ffffff` with opacity layers

### Typography
- **Display/Arabic**: "Amiri" or "Scheherazade New" for Arabic calligraphy and headers
- **Body**: "Cinzel" for elegant headings; "Lato" for readable body text

### Visual Elements
- Animated starfield background with twinkling stars
- Glowing crescent moon as hero centerpiece
- Subtle light rays emanating from key elements
- Geometric Islamic patterns as decorative borders (subtle, not overwhelming)

## Sections

### 1. Hero Section
- Large animated crescent moon with soft glow
- Arabic calligraphy "رمضان كريم" (Ramadan Kareem)
- Dual countdown: "Days until Ramadan" + "Days of Ramadan passed" (when active)
- Animated starfield background

### 2. Prayer Times Section
- Card displaying Fajr, Dhuhr, Asr, Maghrib, Isha times
- Highlight current/next prayer with glowing indicator
- Countdown to next prayer

### 3. Suhoor & Iftar Section
- Visual timeline showing Suhoor ends / Iftar begins
- Local timezone support
- Current fasting status indicator

### 4. Daily Dua Section
- Beautifully presented dua of the day
- Arabic text + transliteration + translation
- Swipe/click to see previous duas

### 5. Daily Quran Verse Section
- Ayah of the day with elegant presentation
- Reference (Surah:Ayah)
- Arabic + Translation

### 6. Tasbeeh Counter (Bonus Feature)
- Digital tasbeeh with SubhanAllah, Alhamdulillah, AllahuAkbar, La ilaha illallah
- Animated bead counter

### 7. Footer
- Simple attribution, Islamic pattern border

## Animations (Framer Motion)

- **Page Load**: Staggered reveal of sections with subtle fade-up
- **Stars**: Continuous twinkling animation
- **Crescent Moon**: Gentle pulsing glow
- **Countdown Numbers**: Smooth number transitions
- **Cards**: Subtle hover lift with glow effect
- **Prayer Times**: Current prayer has animated "active" pulse

## Features

1. Countdown to Ramadan (before it starts) / Days passed (during Ramadan)
2. Prayer times (5 daily prayers)
3. Suhoor & Iftar times
4. Daily Dua
5. Daily Quran verse
6. Tasbeeh counter
7. Responsive design
8. Dark theme optimized

## Technical Stack

- Next.js 16 with App Router
- React 19
- Tailwind CSS 4
- Framer Motion for animations
- Google Fonts (Amiri, Cinzel, Lato)
