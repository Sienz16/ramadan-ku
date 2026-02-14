# Ramadan-Ku Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Build a beautiful Celestial Night themed Ramadan landing page with prayer times, countdowns, daily duas, and Quran verses.

**Architecture:** Single-page Next.js app with component-based architecture. Uses client components for interactivity and animations via Framer Motion. Data (duas, verses) stored in TypeScript constants.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Google Fonts (Amiri, Cinzel)

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install framer-motion**

```bash
npm install framer-motion
```

**Step 2: Verify installation**

Run: `npm list framer-motion`
Expected: Shows installed version

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add framer-motion for animations"
```

---

## Task 2: Setup Global Styles and Fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Step 1: Update global CSS with Celestial Night theme**

Replace entire content of `app/globals.css`:

```css
@import "tailwindcss";

:root {
  --background-start: #0a1628;
  --background-mid: #1a2744;
  --background-end: #0f172a;
  --gold-primary: #ffd700;
  --gold-secondary: #c9a227;
  --gold-soft: #f4e4ba;
  --moonlight: #e2e8f0;
  --starlight: rgba(255, 255, 255, 0.9);
}

@theme inline {
  --color-background-start: var(--background-start);
  --color-background-mid: var(--background-mid);
  --color-background-end: var(--background-end);
  --color-gold-primary: var(--gold-primary);
  --color-gold-secondary: var(--gold-secondary);
  --color-gold-soft: var(--gold-soft);
  --color-moonlight: var(--moonlight);
  --color-starlight: var(--starlight);
  --font-amiri: "Amiri", serif;
  --font-cinzel: "Cinzel", serif;
  --font-lato: "Lato", sans-serif;
}

body {
  background: linear-gradient(180deg, var(--background-start) 0%, var(--background-mid) 50%, var(--background-end) 100%);
  min-height: 100vh;
  color: var(--moonlight);
  font-family: "Lato", sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-start);
}

::-webkit-scrollbar-thumb {
  background: var(--gold-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gold-primary);
}
```

**Step 2: Update layout.tsx with fonts**

Replace entire content of `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Amiri, Cinzel, Lato } from "next/font/google";
import "./globals.css";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Ramadan Ku - Your Spiritual Companion",
  description: "Prayer times, daily duas, Quran verses, and Ramadan countdown for Muslims worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${amiri.variable} ${cinzel.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "style: setup Celestial Night theme and fonts"
```

---

## Task 3: Create Starfield Background Component

**Files:**
- Create: `app/components/Starfield.tsx`

**Step 1: Create the Starfield component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Starfield() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generatedStars: Star[] = [];
    for (let i = 0; i < 100; i++) {
      generatedStars.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      });
    }
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add app/components/Starfield.tsx
git commit -m "feat: add animated starfield background component"
```

---

## Task 4: Create Crescent Moon Component

**Files:**
- Create: `app/components/CrescentMoon.tsx`

**Step 1: Create the CrescentMoon component**

```tsx
"use client";

import { motion } from "framer-motion";

export default function CrescentMoon() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: "scale(1.5)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Moon SVG */}
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#f4e4ba" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M100 20C58.5786 20 25 53.5786 25 95C25 136.421 58.5786 170 100 170C128.5 170 153.5 155.5 167 133.5C154.5 148.5 135.5 157.5 114.5 157.5C74.5 157.5 42.5 125.5 42.5 85.5C42.5 58.5 57.5 35.5 79.5 23C86.5 21 93 20 100 20Z"
          fill="url(#moonGradient)"
          filter="url(#glow)"
        />
      </svg>
    </motion.div>
  );
}
```

**Step 2: Commit**

```bash
git add app/components/CrescentMoon.tsx
git commit -m "feat: add animated crescent moon component"
```

---

## Task 5: Create Countdown Hook

**Files:**
- Create: `app/hooks/useCountdown.ts`

**Step 1: Create the useCountdown hook**

```tsx
"use client";

import { useState, useEffect } from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isRamadan: boolean;
  daysUntilRamadan: number;
  daysInRamadan: number;
  totalRamadanDays: number;
}

// Ramadan 2026: February 17, 2026
// Ramadan 2027: February 7, 2027
const getRamadanDate = (year: number): Date => {
  const dates: Record<number, Date> = {
    2026: new Date("2026-02-17T00:00:00"),
    2027: new Date("2027-02-07T00:00:00"),
    2028: new Date("2028-01-27T00:00:00"),
  };
  return dates[year] || new Date(`${year}-02-17T00:00:00`);
};

const getEidDate = (year: number): Date => {
  const dates: Record<number, Date> = {
    2026: new Date("2026-03-18T00:00:00"),
    2027: new Date("2027-03-09T00:00:00"),
    2028: new Date("2028-02-26T00:00:00"),
  };
  return dates[year] || new Date(`${year}-03-18T00:00:00`);
};

export function useCountdown(): CountdownResult {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isRamadan: false,
      daysUntilRamadan: 0,
      daysInRamadan: 0,
      totalRamadanDays: 29,
    };
  }

  const currentYear = now.getFullYear();
  const ramadanStart = getRamadanDate(currentYear);
  const eidDate = getEidDate(currentYear);

  // Check if we're in Ramadan
  const isRamadan = now >= ramadanStart && now < eidDate;

  let targetDate: Date;
  let daysUntilRamadan = 0;
  let daysInRamadan = 0;

  if (isRamadan) {
    // Countdown to Eid
    targetDate = eidDate;
    const diffFromStart = now.getTime() - ramadanStart.getTime();
    daysInRamadan = Math.floor(diffFromStart / (1000 * 60 * 60 * 24)) + 1;
  } else if (now < ramadanStart) {
    // Before Ramadan
    targetDate = ramadanStart;
    const diff = ramadanStart.getTime() - now.getTime();
    daysUntilRamadan = Math.ceil(diff / (1000 * 60 * 60 * 24));
  } else {
    // After Ramadan, countdown to next year
    const nextYear = currentYear + 1;
    targetDate = getRamadanDate(nextYear);
    const diff = targetDate.getTime() - now.getTime();
    daysUntilRamadan = Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  const diff = targetDate.getTime() - now.getTime();

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isRamadan,
    daysUntilRamadan,
    daysInRamadan,
    totalRamadanDays: 29,
  };
}
```

**Step 2: Commit**

```bash
git add app/hooks/useCountdown.ts
git commit -m "feat: add countdown hook for Ramadan timing"
```

---

## Task 6: Create Hero Section with Countdown

**Files:**
- Create: `app/sections/HeroSection.tsx`

**Step 1: Create the HeroSection component**

```tsx
"use client";

import { motion } from "framer-motion";
import CrescentMoon from "../components/CrescentMoon";
import { useCountdown } from "../hooks/useCountdown";

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)]"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <span className="text-sm md:text-base text-[#94a3b8] mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export default function HeroSection() {
  const { days, hours, minutes, seconds, isRamadan, daysUntilRamadan, daysInRamadan } = useCountdown();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Arabic Calligraphy */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8"
      >
        <h1
          className="text-5xl md:text-7xl text-[#ffd700] font-bold text-center font-[family-name:var(--font-amiri)]"
          dir="rtl"
        >
          رمضان كريم
        </h1>
        <p className="text-xl md:text-2xl text-[#c9a227] text-center mt-4 font-[family-name:var(--font-cinzel)]">
          Ramadan Kareem
        </p>
      </motion.div>

      {/* Crescent Moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mb-12"
      >
        <CrescentMoon />
      </motion.div>

      {/* Status Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mb-8"
      >
        {isRamadan ? (
          <>
            <p className="text-2xl md:text-3xl text-[#e2e8f0] font-[family-name:var(--font-cinzel)]">
              Day {daysInRamadan} of Ramadan
            </p>
            <p className="text-[#94a3b8] mt-2">
              {days} days until Eid
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl md:text-3xl text-[#e2e8f0] font-[family-name:var(--font-cinzel)]">
              {daysUntilRamadan} Days Until Ramadan
            </p>
            <p className="text-[#94a3b8] mt-2">
              May Allah bless us to reach it
            </p>
          </>
        )}
      </motion.div>

      {/* Countdown Timer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex gap-6 md:gap-12"
      >
        <CountdownUnit value={days} label="Days" />
        <CountdownUnit value={hours} label="Hours" />
        <CountdownUnit value={minutes} label="Minutes" />
        <CountdownUnit value={seconds} label="Seconds" />
      </motion.div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="w-32 h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent mt-16"
      />
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add app/sections/HeroSection.tsx
git commit -m "feat: add hero section with countdown"
```

---

## Task 7: Create Prayer Times Hook

**Files:**
- Create: `app/hooks/usePrayerTimes.ts`

**Step 1: Create the usePrayerTimes hook**

```tsx
"use client";

import { useState, useEffect, useMemo } from "react";

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  isNext: boolean;
  isCurrent: boolean;
}

// Simplified prayer times calculation
// In production, use a proper prayer times library like adhan-js
const calculatePrayerTimes = (date: Date): PrayerTime[] => {
  // These are example times - in real app, calculate based on location
  const times = [
    { name: "Fajr", arabicName: "الفجر", hour: 5, minute: 30 },
    { name: "Sunrise", arabicName: "الشروق", hour: 6, minute: 45 },
    { name: "Dhuhr", arabicName: "الظهر", hour: 12, minute: 30 },
    { name: "Asr", arabicName: "العصر", hour: 15, minute: 45 },
    { name: "Maghrib", arabicName: "المغرب", hour: 18, minute: 30 },
    { name: "Isha", arabicName: "العشاء", hour: 19, minute: 45 },
  ];

  const currentHour = date.getHours();
  const currentMinute = date.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  let nextPrayerIndex = 0;
  let currentPrayerIndex = -1;

  times.forEach((prayer, index) => {
    const prayerTime = prayer.hour * 60 + prayer.minute;
    if (currentTime >= prayerTime - 30 && currentTime < prayerTime + 30) {
      currentPrayerIndex = index;
    }
    if (prayerTime > currentTime && nextPrayerIndex === 0 && prayerTime > currentTime) {
      nextPrayerIndex = index;
    }
  });

  if (nextPrayerIndex === 0 && currentTime > times[times.length - 1].hour * 60 + times[times.length - 1].minute) {
    nextPrayerIndex = 0; // Next prayer is Fajr tomorrow
  }

  return times.map((prayer, index) => ({
    name: prayer.name,
    arabicName: prayer.arabicName,
    time: `${prayer.hour.toString().padStart(2, "0")}:${prayer.minute.toString().padStart(2, "0")}`,
    isNext: index === nextPrayerIndex,
    isCurrent: index === currentPrayerIndex,
  }));
};

export function usePrayerTimes(): {
  prayers: PrayerTime[];
  nextPrayer: PrayerTime | null;
  timeUntilNext: string;
} {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const prayers = useMemo(() => {
    if (!now) return [];
    return calculatePrayerTimes(now);
  }, [now]);

  const nextPrayer = useMemo(() => {
    return prayers.find((p) => p.isNext) || null;
  }, [prayers]);

  const timeUntilNext = useMemo(() => {
    if (!now || !nextPrayer) return "";

    const [hour, minute] = nextPrayer.time.split(":").map(Number);
    const nextTime = new Date(now);
    nextTime.setHours(hour, minute, 0, 0);

    if (nextTime < now) {
      nextTime.setDate(nextTime.getDate() + 1);
    }

    const diff = nextTime.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }, [now, nextPrayer]);

  return { prayers, nextPrayer, timeUntilNext };
}
```

**Step 2: Commit**

```bash
git add app/hooks/usePrayerTimes.ts
git commit -m "feat: add prayer times hook"
```

---

## Task 8: Create Prayer Times Section

**Files:**
- Create: `app/sections/PrayerTimesSection.tsx`

**Step 1: Create the PrayerTimesSection component**

```tsx
"use client";

import { motion } from "framer-motion";
import { usePrayerTimes } from "../hooks/usePrayerTimes";

export default function PrayerTimesSection() {
  const { prayers, nextPrayer, timeUntilNext } = usePrayerTimes();

  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)] mb-4">
            Prayer Times
          </h2>
          <p className="text-[#94a3b8]" dir="rtl">
            مواقيت الصلاة
          </p>
          {nextPrayer && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#c9a227] mt-4"
            >
              Next prayer: {nextPrayer.name} in {timeUntilNext}
            </motion.p>
          )}
        </div>

        {/* Prayer Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {prayers.map((prayer, index) => (
            <motion.div
              key={prayer.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative p-6 rounded-xl border transition-all duration-300 ${
                prayer.isNext
                  ? "bg-[#ffd700]/10 border-[#ffd700] shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                  : "bg-white/5 border-[#c9a227]/20 hover:border-[#c9a227]/50"
              }`}
            >
              {/* Active indicator */}
              {prayer.isNext && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-[#ffd700] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              <div className="text-center">
                <p className="text-[#94a3b8] text-sm mb-1" dir="rtl">
                  {prayer.arabicName}
                </p>
                <h3 className="text-xl font-semibold text-[#e2e8f0] mb-2 font-[family-name:var(--font-cinzel)]">
                  {prayer.name}
                </h3>
                <p className="text-2xl font-bold text-[#ffd700]">{prayer.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add app/sections/PrayerTimesSection.tsx
git commit -m "feat: add prayer times section"
```

---

## Task 9: Create Suhoor & Iftar Section

**Files:**
- Create: `app/sections/SuhoorIftarSection.tsx`

**Step 1: Create the SuhoorIftarSection component**

```tsx
"use client";

import { motion } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";

export default function SuhoorIftarSection() {
  const { isRamadan } = useCountdown();

  // Example times - in production, calculate based on location and date
  const suhoorEnd = "05:20";
  const iftarTime = "18:30";

  if (!isRamadan) {
    return (
      <section className="relative py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)] mb-4">
            Suhoor & Iftar
          </h2>
          <p className="text-[#94a3b8]">
            Times will be available when Ramadan begins
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)] mb-4">
            Suhoor & Iftar
          </h2>
          <p className="text-[#94a3b8]" dir="rtl">
            السحور والإفطار
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#c9a227]/50 via-[#ffd700] to-[#c9a227]/50" />

          {/* Suhoor Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-end mb-12"
          >
            <div className="w-5/12 text-right pr-8">
              <div className="bg-white/5 border border-[#c9a227]/20 rounded-xl p-6 hover:border-[#c9a227]/50 transition-colors">
                <p className="text-[#94a3b8] mb-1">Ends at</p>
                <h3 className="text-2xl font-bold text-[#e2e8f0] font-[family-name:var(--font-cinzel)] mb-2">
                  Suhoor
                </h3>
                <p className="text-3xl font-bold text-[#ffd700]">{suhoorEnd}</p>
                <p className="text-sm text-[#94a3b8] mt-2" dir="rtl">
                  السحور
                </p>
                <p className="text-sm text-[#94a3b8] mt-1">
                  "Eat suhoor, for in suhoor there is blessing."
                </p>
              </div>
            </div>
            <div className="w-2/12 flex justify-center">
              <motion.div
                className="w-4 h-4 bg-[#ffd700] rounded-full shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            <div className="w-5/12" />
          </motion.div>

          {/* Iftar Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-start"
          >
            <div className="w-5/12" />
            <div className="w-2/12 flex justify-center">
              <motion.div
                className="w-4 h-4 bg-[#ffd700] rounded-full shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              />
            </div>
            <div className="w-5/12 pl-8">
              <div className="bg-gradient-to-br from-[#ffd700]/20 to-[#c9a227]/10 border border-[#ffd700]/30 rounded-xl p-6 shadow-[0_0_30px_rgba(255,215,0,0.15)]">
                <p className="text-[#94a3b8] mb-1">Begins at</p>
                <h3 className="text-2xl font-bold text-[#e2e8f0] font-[family-name:var(--font-cinzel)] mb-2">
                  Iftar
                </h3>
                <p className="text-3xl font-bold text-[#ffd700]">{iftarTime}</p>
                <p className="text-sm text-[#94a3b8] mt-2" dir="rtl">
                  الإفطار
                </p>
                <p className="text-sm text-[#94a3b8] mt-1">
                  "The fasting person has two moments of joy..."
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add app/sections/SuhoorIftarSection.tsx
git commit -m "feat: add suhoor and iftar section"
```

---

## Task 10: Create Dua Data and Daily Dua Section

**Files:**
- Create: `app/data/duas.ts`
- Create: `app/sections/DailyDuaSection.tsx`

**Step 1: Create dua data file**

```ts
export interface Dua {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  reference?: string;
}

export const dailyDuas: Dua[] = [
  {
    id: 1,
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى صِيَامِهِ وَقِيَامِهِ",
    transliteration: "Allahumma a'innii 'alaa siyaamihi wa qiyaamih",
    translation: "O Allah, assist me in fasting it (Ramadan) and standing in prayer during it",
    reference: "Ibn Majah",
  },
  {
    id: 2,
    arabic: "اللَّهُمَّ بَارِكْ لَنَا فِي رَجَبٍ وَشَعْبَانَ وَبَلِّغْنَا رَمَضَانَ",
    transliteration: "Allahumma baarik lana fi Rajab wa Sha'ban wa ballighna Ramadan",
    translation: "O Allah, bless us in Rajab and Sha'ban and enable us to reach Ramadan",
  },
  {
    id: 3,
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'anni",
    translation: "O Allah, You are the One who pardons, and You love to pardon, so pardon me",
    reference: "Tirmidhi",
  },
  {
    id: 4,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "SubhanAllahi wa bihamdihi, SubhanAllahil 'Adheem",
    translation: "Glory be to Allah and praise be to Him, glory be to Allah the Magnificent",
  },
  {
    id: 5,
    arabic: "اللَّهُمَّ اجْعَلْ صِيَامِي فِيهِ صِيَامَ الصَّائِمِينَ",
    transliteration: "Allahumma-j'al siyaami fihi siyaamas-saa'imeen",
    translation: "O Allah, make my fast in it the fast of those who fast sincerely",
  },
  {
    id: 6,
    arabic: "رَبِّ اغْفِرْ وَارْحَمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ",
    transliteration: "Rabbighfir warham wa tajawaz 'amma ta'lam",
    translation: "My Lord, forgive, have mercy, and overlook what You know",
  },
  {
    id: 7,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    transliteration: "Allahumma inni as'alukal Jannata wa a'udhu bika minan-Naar",
    translation: "O Allah, I ask You for Paradise and seek refuge from the Fire",
  },
  {
    id: 8,
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    transliteration: "La ilaha illAllahu wahdahu la sharika lahu",
    translation: "There is no god but Allah alone, with no partner",
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    transliteration: "Allahumma salli 'ala Muhammadin wa 'ala aali Muhammad",
    translation: "O Allah, send blessings upon Muhammad and upon the family of Muhammad",
  },
  {
    id: 10,
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "HasbunAllahu wa ni'mal Wakeel",
    translation: "Allah is sufficient for us, and He is the best Disposer of affairs",
    reference: "Quran 3:173",
  },
  {
    id: 11,
    arabic: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ",
    transliteration: "Allahumma ajirni minan-Naar",
    translation: "O Allah, save me from the Fire",
  },
  {
    id: 12,
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan",
    translation: "Our Lord, give us good in this world and good in the Hereafter",
    reference: "Quran 2:201",
  },
  {
    id: 13,
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ",
    transliteration: "Astaghfirullahal-'Adheem alladhi la ilaha illa Huwa",
    translation: "I seek forgiveness from Allah the Magnificent, besides whom there is no god",
  },
  {
    id: 14,
    arabic: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلِّهُ دِقَّهُ وَجِلَّهُ",
    transliteration: "Allahummaghfir li dhanbi kullihi diqqahu wa jillahu",
    translation: "O Allah, forgive me all my sins, the small and the great",
  },
  {
    id: 15,
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ",
    transliteration: "SubhanakAllahumma wa bihamdika ashhadu an la ilaha illa Anta",
    translation: "Glory be to You, O Allah, and praise. I bear witness that there is no god but You",
  },
  {
    id: 16,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    translation: "O Allah, I seek refuge in You from worry and sorrow",
  },
  {
    id: 17,
    arabic: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no power and no strength except with Allah",
  },
  {
    id: 18,
    arabic: "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ",
    transliteration: "Allahummahdini fiman hadayt",
    translation: "O Allah, guide me among those whom You have guided",
  },
  {
    id: 19,
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا",
    transliteration: "Radeetu billahi Rabban wa bil-Islami deena",
    translation: "I am pleased with Allah as Lord, and with Islam as religion",
  },
  {
    id: 20,
    arabic: "اللَّهُمَّ يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
    transliteration: "Allahumma ya Muqallibal-quloob thabbit qalbi 'ala deenik",
    translation: "O Allah, O Turner of hearts, make my heart firm upon Your religion",
  },
  {
    id: 21,
    arabic: "مَا شَاءَ اللَّهُ لَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Masha'Allahu la quwwata illa billah",
    translation: "What Allah wills, there is no power except with Allah",
  },
  {
    id: 22,
    arabic: "اللَّهُمَّ اغْفِرْ لِوَالِدَيَّ وَارْحَمْهُمَا",
    transliteration: "Allahummaghfir liwalidayya warhamhuma",
    translation: "O Allah, forgive my parents and have mercy upon them",
  },
  {
    id: 23,
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un",
    translation: "In the name of Allah, with whose name nothing can harm",
  },
  {
    id: 24,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا",
    transliteration: "Allahumma inni as'aluka 'ilman naafi'an wa rizqan tayyiban",
    translation: "O Allah, I ask You for beneficial knowledge and good provision",
  },
  {
    id: 25,
    arabic: "تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    transliteration: "Tawakkaltu 'alAllahi wa la hawla wa la quwwata illa billah",
    translation: "I put my trust in Allah, and there is no power nor strength except with Allah",
  },
  {
    id: 26,
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ",
    transliteration: "Allahumma inni a'udhu bika minal-kufri wal-faqri",
    translation: "O Allah, I seek refuge in You from disbelief and poverty",
  },
  {
    id: 27,
    arabic: "اللَّهُمَّ أَعْطِنَا فِي الدُّنْيَا زُهْدًا وَفِي الْآخِرَةِ تَوْفِيقًا",
    transliteration: "Allahumma a'tina fid-dunya zuhdan wa fil-akhirati tawfeeqan",
    translation: "O Allah, grant us detachment in this world and success in the Hereafter",
  },
  {
    id: 28,
    arabic: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "SubhanAllah walhamdulillah wa la ilaha illAllah",
    translation: "Glory be to Allah, praise be to Allah, there is no god but Allah",
  },
  {
    id: 29,
    arabic: "اللَّهُمَّ ارْزُقْنَا تَوْفِيقَ الِاقْتِدَاءِ بِالنَّبِيِّ",
    transliteration: "Allahumma urzuqna tawfeeqal-iqtida'i bin-Nabiyy",
    translation: "O Allah, grant us the success of following the Prophet",
  },
  {
    id: 30,
    arabic: "أَللَّهُمَّ يَا فَتَّاحُ افْتَحْ لَنَا فَتْحًا مُبِينًا",
    transliteration: "Allahumma ya Fattahu iftah lana fathan mubeena",
    translation: "O Allah, O Opener, open for us a clear opening",
  },
];

export function getDailyDua(): Dua {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const index = (dayOfMonth - 1) % dailyDuas.length;
  return dailyDuas[index];
}
```

**Step 2: Create DailyDuaSection component**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyDuas, getDailyDua } from "../data/duas";

export default function DailyDuaSection() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = new Date();
    return (today.getDate() - 1) % dailyDuas.length;
  });

  const dua = dailyDuas[currentIndex];

  const nextDua = () => {
    setCurrentIndex((prev) => (prev + 1) % dailyDuas.length);
  };

  const prevDua = () => {
    setCurrentIndex((prev) => (prev - 1 + dailyDuas.length) % dailyDuas.length);
  };

  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)] mb-4">
            Daily Dua
          </h2>
          <p className="text-[#94a3b8]" dir="rtl">
            الدعاء اليومي
          </p>
        </div>

        {/* Dua Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dua.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#ffd700]/10 to-[#c9a227]/5 border border-[#c9a227]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,215,0,0.1)]"
          >
            {/* Arabic */}
            <div className="text-center mb-6">
              <p
                className="text-2xl md:text-3xl text-[#e2e8f0] leading-relaxed font-[family-name:var(--font-amiri)]"
                dir="rtl"
              >
                {dua.arabic}
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent mx-auto my-6" />

            {/* Transliteration */}
            <div className="mb-4">
              <p className="text-sm text-[#94a3b8] mb-2 uppercase tracking-wider">
                Transliteration
              </p>
              <p className="text-lg text-[#f4e4ba] italic">
                {dua.transliteration}
              </p>
            </div>

            {/* Translation */}
            <div className="mb-4">
              <p className="text-sm text-[#94a3b8] mb-2 uppercase tracking-wider">
                Translation
              </p>
              <p className="text-lg text-[#e2e8f0]">{dua.translation}</p>
            </div>

            {/* Reference */}
            {dua.reference && (
              <p className="text-sm text-[#c9a227] text-right">
                — {dua.reference}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevDua}
            className="px-6 py-3 rounded-full border border-[#c9a227]/50 text-[#c9a227] hover:bg-[#c9a227]/10 transition-colors font-[family-name:var(--font-cinzel)]"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextDua}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700] to-[#c9a227] text-[#0a1628] font-semibold hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-shadow font-[family-name:var(--font-cinzel)]"
          >
            Next Dua
          </motion.button>
        </div>

        {/* Dua Counter */}
        <p className="text-center text-[#94a3b8] text-sm mt-4">
          Dua {currentIndex + 1} of {dailyDuas.length}
        </p>
      </motion.div>
    </section>
  );
}
```

**Step 3: Commit**

```bash
git add app/data/duas.ts app/sections/DailyDuaSection.tsx
git commit -m "feat: add daily dua data and section"
```

---

## Task 11: Create Quran Verse Data and Section

**Files:**
- Create: `app/data/quran.ts`
- Create: `app/sections/DailyQuranSection.tsx`

**Step 1: Create quran data file**

```ts
export interface QuranVerse {
  id: number;
  surah: string;
  surahNumber: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
}

export const dailyVerses: QuranVerse[] = [
  {
    id: 1,
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 183,
    arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ كَمَا كُتِبَ عَلَى الَّذِينَ مِن قَبْلِكُمْ لَعَلَّكُمْ تَتَّقُونَ",
    translation: "O you who have believed, decreed upon you is fasting as it was decreed upon those before you that you may become righteous.",
  },
  {
    id: 2,
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 184,
    arabic: "أَيَّامًا مَّعْدُودَاتٍ ۚ فَمَن كَانَ مِنكُم مَّرِيضًا أَوْ عَلَىٰ سَفَرٍ فَعِدَّةٌ مِّنْ أَيَّامٍ أُخَرَ",
    translation: "[Fasting for] a limited number of days. So whoever among you is ill or on a journey [during them] - then an equal number of days [are to be made up].",
  },
  {
    id: 3,
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 185,
    arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ هُدًى لِّلنَّاسِ وَبَيِّنَاتٍ مِّنَ الْهُدَىٰ وَالْفُرْقَانِ",
    translation: "The month of Ramadan [is that] in which was revealed the Quran, a guidance for the people and clear proofs of guidance and criterion.",
  },
  {
    id: 4,
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 186,
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    translation: "And when My servants ask you, [O Muhammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
  },
  {
    id: 5,
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayahNumber: 286,
    arabic: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ",
    translation: "Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.",
  },
  {
    id: 6,
    surah: "Al-Fatiha",
    surahNumber: 1,
    ayahNumber: 1,
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  },
  {
    id: 7,
    surah: "Al-Fatiha",
    surahNumber: 1,
    ayahNumber: 2,
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    translation: "[All] praise is [due] to Allah, Lord of the worlds.",
  },
  {
    id: 8,
    surah: "Al-Fatiha",
    surahNumber: 1,
    ayahNumber: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    translation: "It is You we worship and You we ask for help.",
  },
  {
    id: 9,
    surah: "Ali 'Imran",
    surahNumber: 3,
    ayahNumber: 26,
    arabic: "قُلِ اللَّهُمَّ مَالِكَ الْمُلْكِ تُؤْتِي الْمُلْكَ مَن تَشَاءُ وَتَنزِعُ الْمُلْكَ مِمَّن تَشَاءُ",
    translation: "Say, 'O Allah, Owner of Sovereignty, You give sovereignty to whom You will and You take sovereignty away from whom You will.'",
  },
  {
    id: 10,
    surah: "Al-Mulk",
    surahNumber: 67,
    ayahNumber: 1,
    arabic: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    translation: "Blessed is He in whose hand is dominion, and He is over all things competent.",
  },
  {
    id: 11,
    surah: "Al-Hadid",
    surahNumber: 57,
    ayahNumber: 1,
    arabic: "سَبَّحَ لِلَّهِ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ ۖ وَهُوَ الْعَزِيزُ الْحَكِيمُ",
    translation: "Whatever is in the heavens and earth exalts Allah, and He is the Exalted in Might, the Wise.",
  },
  {
    id: 12,
    surah: "Al-Hashr",
    surahNumber: 59,
    ayahNumber: 22,
    arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ ۖ هُوَ الرَّحْمَٰنُ الرَّحِيمُ",
    translation: "He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed. He is the Entirely Merciful, the Especially Merciful.",
  },
  {
    id: 13,
    surah: "Al-Hashr",
    surahNumber: 59,
    ayahNumber: 23,
    arabic: "هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْمَلِكُ الْقُدُّوسُ السَّلَامُ الْمُؤْمِنُ الْمُهَيْمِنُ الْعَزِيزُ الْجَبَّارُ الْمُتَكَبِّرُ",
    translation: "He is Allah, other than whom there is no deity, the Sovereign, the Pure, the Perfection, the Bestower of Faith, the Overseer, the Exalted in Might, the Compeller, the Superior.",
  },
  {
    id: 14,
    surah: "Al-Hashr",
    surahNumber: 59,
    ayahNumber: 24,
    arabic: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ ۖ لَهُ الْأَسْمَاءُ الْحُسْنَىٰ",
    translation: "He is Allah, the Creator, the Inventor, the Fashioner; to Him belong the best names.",
  },
  {
    id: 15,
    surah: "Ibrahim",
    surahNumber: 14,
    ayahNumber: 7,
    arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِي لَشَدِيدٌ",
    translation: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor]; but if you deny, indeed, My punishment is severe.'",
  },
  {
    id: 16,
    surah: "Al-Isra",
    surahNumber: 17,
    ayahNumber: 80,
    arabic: "وَقُل رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَل لِّي مِن لَّدُنكَ سُلْطَانًا نَّصِيرًا",
    translation: "And say, 'My Lord, cause me to enter a sound entrance and to exit a sound exit and grant me from Yourself a supporting authority.'",
  },
  {
    id: 17,
    surah: "Al-Kahf",
    surahNumber: 18,
    ayahNumber: 10,
    arabic: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    translation: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
  },
  {
    id: 18,
    surah: "Ta-Ha",
    surahNumber: 20,
    ayahNumber: 114,
    arabic: "رَّبِّ زِدْنِي عِلْمًا",
    translation: "My Lord, increase me in knowledge.",
  },
  {
    id: 19,
    surah: "Al-Mu'minun",
    surahNumber: 23,
    ayahNumber: 118,
    arabic: "وَقُل رَّبِّ اغْفِرْ وَارْحَمْ وَأَنتَ خَيْرُ الرَّاحِمِينَ",
    translation: "And say, 'My Lord, forgive and have mercy, and You are the best of the merciful.'",
  },
  {
    id: 20,
    surah: "Al-Ankabut",
    surahNumber: 29,
    ayahNumber: 46,
    arabic: "وَلَا تُجَادِلُوا أَهْلَ الْكِتَابِ إِلَّا بِالَّتِي هِيَ أَحْسَنُ",
    translation: "And do not argue with the People of the Scripture except in a way that is best.",
  },
  {
    id: 21,
    surah: "Ar-Rum",
    surahNumber: 30,
    ayahNumber: 21,
    arabic: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
    translation: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them.",
  },
  {
    id: 22,
    surah: "Luqman",
    surahNumber: 31,
    ayahNumber: 27,
    arabic: "وَلَوْ أَنَّمَا فِي الْأَرْضِ مِن شَجَرَةٍ أَقْلَامٌ وَالْبَحْرُ يَمُدُّهُ مِن بَعْدِهِ سَبْعَةُ أَبْحُرٍ مَّا نَفِدَتْ كَلِمَاتُ اللَّهِ",
    translation: "And if whatever trees upon the earth were pens and the sea [was ink], replenished thereafter by seven [more] seas, the words of Allah would not be exhausted.",
  },
  {
    id: 23,
    surah: "As-Sajda",
    surahNumber: 32,
    ayahNumber: 7,
    arabic: "الَّذِي أَحْسَنَ كُلَّ شَيْءٍ خَلَقَهُ ۖ وَبَدَأَ خَلْقَ الْإِنسَانِ مِن طِينٍ",
    translation: "Who perfected everything which He created and began the creation of man from clay.",
  },
  {
    id: 24,
    surah: "Al-Ahzab",
    surahNumber: 33,
    ayahNumber: 35,
    arabic: "إِنَّ الْمُسْلِمِينَ وَالْمُسْلِمَاتِ وَالْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَالْقَانِتِينَ وَالْقَانِتَاتِ وَالصَّادِقِينَ وَالصَّادِقَاتِ",
    translation: "Indeed, the Muslim men and Muslim women, the believing men and believing women, the obedient men and obedient women, the truthful men and truthful women...",
  },
  {
    id: 25,
    surah: "Ya-Sin",
    surahNumber: 36,
    ayahNumber: 58,
    arabic: "سَلَامٌ قَوْلًا مِّن رَّبٍّ رَّحِيمٍ",
    translation: "[And] 'Peace,' a word from a Merciful Lord.",
  },
  {
    id: 26,
    surah: "Az-Zumar",
    surahNumber: 39,
    ayahNumber: 53,
    arabic: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
    translation: "Say, 'O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
  },
  {
    id: 27,
    surah: "Ghafir",
    surahNumber: 40,
    ayahNumber: 60,
    arabic: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    translation: "And your Lord says, 'Call upon Me; I will respond to you.'",
  },
  {
    id: 28,
    surah: "Ash-Shura",
    surahNumber: 42,
    ayahNumber: 25,
    arabic: "وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ وَيَعْفُو عَنِ السَّيِّئَاتِ",
    translation: "And it is He who accepts repentance from His servants and pardons misdeeds.",
  },
  {
    id: 29,
    surah: "Al-Hujurat",
    surahNumber: 49,
    ayahNumber: 13,
    arabic: "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
    translation: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another.",
  },
  {
    id: 30,
    surah: "Al-Fajr",
    surahNumber: 89,
    ayahNumber: 27,
    arabic: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
    translation: "[To the righteous it will be said], 'O reassured soul,'",
  },
];

export function getDailyVerse(): QuranVerse {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const index = (dayOfMonth - 1) % dailyVerses.length;
  return dailyVerses[index];
}
```

**Step 2: Create DailyQuranSection component**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyVerses } from "../data/quran";

export default function DailyQuranSection() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = new Date();
    return (today.getDate() - 1) % dailyVerses.length;
  });

  const verse = dailyVerses[currentIndex];

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % dailyVerses.length);
  };

  const prevVerse = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + dailyVerses.length) % dailyVerses.length
    );
  };

  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)] mb-4">
            Daily Quran Verse
          </h2>
          <p className="text-[#94a3b8]" dir="rtl">
            آية القرآن اليومية
          </p>
        </div>

        {/* Verse Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={verse.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#0f172a] to-[#1a2744] border border-[#c9a227]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,215,0,0.1)]"
          >
            {/* Surah Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)]">
                Surah {verse.surah}
              </h3>
              <p className="text-[#94a3b8] text-sm">
                {verse.surahNumber}:{verse.ayahNumber}
              </p>
            </div>

            {/* Arabic */}
            <div className="text-center mb-6">
              <p
                className="text-xl md:text-2xl text-[#e2e8f0] leading-relaxed font-[family-name:var(--font-amiri)]"
                dir="rtl"
              >
                {verse.arabic}
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent mx-auto my-6" />

            {/* Translation */}
            <div>
              <p className="text-sm text-[#94a3b8] mb-2 uppercase tracking-wider">
                Translation
              </p>
              <p className="text-lg text-[#f4e4ba] leading-relaxed">
                {verse.translation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevVerse}
            className="px-6 py-3 rounded-full border border-[#c9a227]/50 text-[#c9a227] hover:bg-[#c9a227]/10 transition-colors font-[family-name:var(--font-cinzel)]"
          >
            Previous
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextVerse}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ffd700] to-[#c9a227] text-[#0a1628] font-semibold hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-shadow font-[family-name:var(--font-cinzel)]"
          >
            Next Verse
          </motion.button>
        </div>

        {/* Verse Counter */}
        <p className="text-center text-[#94a3b8] text-sm mt-4">
          Verse {currentIndex + 1} of {dailyVerses.length}
        </p>
      </motion.div>
    </section>
  );
}
```

**Step 3: Commit**

```bash
git add app/data/quran.ts app/sections/DailyQuranSection.tsx
git commit -m "feat: add quran verse data and section"
```

---

## Task 12: Create Tasbeeh Counter Section

**Files:**
- Create: `app/sections/TasbeehSection.tsx`

**Step 1: Create the TasbeehSection component**

```tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Dhikr {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
}

const dhikrs: Dhikr[] = [
  {
    id: 1,
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    meaning: "Glory be to Allah",
  },
  {
    id: 2,
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    meaning: "Praise be to Allah",
  },
  {
    id: 3,
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is Greater",
  },
  {
    id: 4,
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illAllah",
    meaning: "There is no god but Allah",
  },
];

export default function TasbeehSection() {
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr>(dhikrs[0]);
  const [count, setCount] = useState(0);
  const [beads, setBeads] = useState<boolean[]>(new Array(33).fill(false));

  const handleCount = () => {
    const newCount = count + 1;
    setCount(newCount);

    // Update beads
    const newBeads = [...beads];
    const beadIndex = (newCount - 1) % 33;
    newBeads[beadIndex] = true;
    setBeads(newBeads);

    // Reset after 33
    if (newCount % 33 === 0) {
      setTimeout(() => {
        setBeads(new Array(33).fill(false));
      }, 500);
    }
  };

  const reset = () => {
    setCount(0);
    setBeads(new Array(33).fill(false));
  };

  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)] mb-4">
            Digital Tasbeeh
          </h2>
          <p className="text-[#94a3b8]" dir="rtl">
            التسبيح الإلكتروني
          </p>
        </div>

        {/* Dhikr Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {dhikrs.map((dhikr) => (
            <motion.button
              key={dhikr.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDhikr(dhikr);
                reset();
              }}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedDhikr.id === dhikr.id
                  ? "bg-[#ffd700] text-[#0a1628] font-semibold"
                  : "bg-white/5 border border-[#c9a227]/30 text-[#e2e8f0] hover:border-[#c9a227]/50"
              }`}
            >
              {dhikr.transliteration}
            </motion.button>
          ))}
        </div>

        {/* Current Dhikr Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDhikr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-8"
          >
            <p
              className="text-3xl md:text-4xl text-[#ffd700] mb-2 font-[family-name:var(--font-amiri)]"
              dir="rtl"
            >
              {selectedDhikr.arabic}
            </p>
            <p className="text-lg text-[#f4e4ba]">{selectedDhikr.transliteration}</p>
            <p className="text-sm text-[#94a3b8]">{selectedDhikr.meaning}</p>
          </motion.div>
        </AnimatePresence>

        {/* Counter Display */}
        <div className="flex justify-center mb-8">
          <motion.div
            key={count}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-6xl md:text-8xl font-bold text-[#ffd700] font-[family-name:var(--font-cinzel)]"
          >
            {count}
          </motion.div>
        </div>

        {/* Beads Visualization */}
        <div className="flex justify-center flex-wrap gap-1 mb-8 max-w-xs mx-auto">
          {beads.map((filled, index) => (
            <motion.div
              key={index}
              initial={false}
              animate={{
                backgroundColor: filled ? "#ffd700" : "rgba(255, 215, 0, 0.2)",
                scale: filled ? 1.2 : 1,
              }}
              className="w-3 h-3 rounded-full"
            />
          ))}
        </div>

        {/* Count Button */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCount}
            className="w-32 h-32 rounded-full bg-gradient-to-br from-[#ffd700] to-[#c9a227] text-[#0a1628] font-bold text-xl shadow-[0_0_40px_rgba(255,215,0,0.3)] hover:shadow-[0_0_60px_rgba(255,215,0,0.5)] transition-shadow font-[family-name:var(--font-cinzel)]"
          >
            Count
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-6 py-3 rounded-full border border-[#c9a227]/50 text-[#c9a227] hover:bg-[#c9a227]/10 transition-colors self-center"
          >
            Reset
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
```

**Step 2: Commit**

```bash
git add app/sections/TasbeehSection.tsx
git commit -m "feat: add digital tasbeeh counter section"
```

---

## Task 13: Create Footer Component

**Files:**
- Create: `app/components/Footer.tsx`

**Step 1: Create the Footer component**

```tsx
"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-[#c9a227]/20">
      {/* Decorative Pattern */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c9a227] to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Arabic Basmala */}
        <p
          className="text-xl text-[#c9a227] mb-4 font-[family-name:var(--font-amiri)]"
          dir="rtl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* Message */}
        <p className="text-[#94a3b8] mb-6 max-w-lg mx-auto">
          May Allah accept our fasting, prayers, and good deeds this Ramadan.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c9a227]" />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#c9a227]"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c9a227]" />
        </div>

        {/* Copyright */}
        <p className="text-sm text-[#64748b]">
          Made with devotion for the Ummah · Ramadan Ku
        </p>
      </motion.div>
    </footer>
  );
}
```

**Step 2: Commit**

```bash
git add app/components/Footer.tsx
git commit -m "feat: add footer component"
```

---

## Task 14: Assemble Main Page

**Files:**
- Modify: `app/page.tsx`

**Step 1: Replace page.tsx with complete landing page**

```tsx
import Starfield from "./components/Starfield";
import Footer from "./components/Footer";
import HeroSection from "./sections/HeroSection";
import PrayerTimesSection from "./sections/PrayerTimesSection";
import SuhoorIftarSection from "./sections/SuhoorIftarSection";
import DailyDuaSection from "./sections/DailyDuaSection";
import DailyQuranSection from "./sections/DailyQuranSection";
import TasbeehSection from "./sections/TasbeehSection";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <Starfield />

      {/* Content */}
      <div className="relative z-10">
        <HeroSection />
        <PrayerTimesSection />
        <SuhoorIftarSection />
        <DailyDuaSection />
        <DailyQuranSection />
        <TasbeehSection />
        <Footer />
      </div>
    </main>
  );
}
```

**Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble complete landing page"
```

---

## Task 15: Build and Verify

**Files:**
- All modified files

**Step 1: Run build**

```bash
npm run build
```

Expected: Build completes successfully with no errors.

**Step 2: Check for any TypeScript errors**

```bash
npx tsc --noEmit
```

Expected: No TypeScript errors.

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete ramadan landing page with all features"
```

---

## Summary

This plan creates a complete Ramadan landing page with:

1. **Starfield Background** — Animated twinkling stars
2. **Hero Section** — Crescent moon, Arabic calligraphy, countdown timer
3. **Prayer Times** — 5 daily prayers with next prayer indicator
4. **Suhoor & Iftar** — Visual timeline with times
5. **Daily Dua** — 30 duas with navigation
6. **Daily Quran Verse** — 30 verses with navigation
7. **Digital Tasbeeh** — Counter with bead visualization
8. **Footer** — Islamic decorative elements

All components use the Celestial Night theme with deep blues, gold accents, and smooth Framer Motion animations.
