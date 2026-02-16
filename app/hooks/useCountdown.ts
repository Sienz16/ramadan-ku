"use client";

import { useState, useEffect, useCallback } from "react";
import { formatHijriDateFromJakim } from "../lib/prayerTimesSource";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isRamadan: boolean;
  daysUntilRamadan: number;
  daysInRamadan: number;
  totalRamadanDays: number;
  hijriDate: string;
  loading: boolean;
}

const DEFAULT_ZONE = "WLY01";

async function fetchHijriDate(zone: string): Promise<{ month: number; day: number; year: string; label: string } | null> {
  try {
    const response = await fetch(
      `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${zone}`
    );

    if (!response.ok) {
      // Silently fail - return null instead of throwing
      return null;
    }

    const data = await response.json();

    if (data?.status !== "OK!" || !data?.prayerTime?.[0]?.hijri) {
      return null;
    }

    const hijriValue = String(data.prayerTime[0].hijri);
    const [year, month, day] = hijriValue.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return {
      month,
      day,
      year: String(year),
      label: formatHijriDateFromJakim(hijriValue),
    };
  } catch {
    // Silently fail - don't log error to console
    return null;
  }
}

// Ramadan 2025-2028 dates (approximate - should be verified with local moon sighting)
const ramadanDates: Record<number, { start: string; end: string }> = {
  2025: { start: "2025-03-01", end: "2025-03-30" },
  2026: { start: "2026-02-18", end: "2026-03-19" },
  2027: { start: "2027-02-08", end: "2027-03-09" },
  2028: { start: "2028-01-28", end: "2028-02-26" },
};

export function useCountdown(zone?: string): CountdownResult {
  const [now, setNow] = useState<Date | null>(null);
  const [hijriInfo, setHijriInfo] = useState<{
    month: number;
    label: string;
    day: number;
    year: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Hijri date on mount
  useEffect(() => {
    let cancelled = false;

    const fetchHijri = async () => {
      try {
        const data = await fetchHijriDate(zone ?? DEFAULT_ZONE);
        if (!cancelled && data) {
          setHijriInfo(data);
        }
      } catch {
        // Don't show error to user, just don't show Hijri date
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchHijri();
    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [zone]);

  // Calculate Ramadan status
  const calculateRamadanStatus = useCallback(() => {
    if (!now) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isRamadan: false,
        daysUntilRamadan: 0,
        daysInRamadan: 0,
        totalRamadanDays: 30,
        targetDate: new Date(),
      };
    }

    const currentYear = now.getFullYear();
    const thisYearRamadan = ramadanDates[currentYear];
    const nextYearRamadan = ramadanDates[currentYear + 1];

    if (!thisYearRamadan) {
      // Fallback if year not in our data
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isRamadan: false,
        daysUntilRamadan: 0,
        daysInRamadan: 0,
        totalRamadanDays: 30,
        targetDate: now,
      };
    }

    const ramadanStart = new Date(thisYearRamadan.start);
    const ramadanEnd = new Date(thisYearRamadan.end);

    // Approximation based on Gregorian date windows
    const isRamadanByGregorian = now >= ramadanStart && now <= ramadanEnd;
    // Malaysia-suitable source of truth using Hijri month from JAKIM
    const isRamadanByHijri = hijriInfo?.month === 9;
    const isRamadan = hijriInfo ? Boolean(isRamadanByHijri) : isRamadanByGregorian;

    let targetDate: Date;
    let daysUntilRamadan = 0;
    let daysInRamadan = 0;

    if (isRamadan) {
      // Countdown to Eid
      targetDate = new Date(ramadanEnd);
      targetDate.setDate(targetDate.getDate() + 1); // Day after last day of Ramadan
      const diffFromStart = now.getTime() - ramadanStart.getTime();
      daysInRamadan = isRamadanByHijri
        ? (hijriInfo?.day ?? 1)
        : Math.floor(diffFromStart / (1000 * 60 * 60 * 24)) + 1;
    } else if (now < ramadanStart) {
      // Before Ramadan
      targetDate = ramadanStart;
      const diff = ramadanStart.getTime() - now.getTime();
      daysUntilRamadan = Math.ceil(diff / (1000 * 60 * 60 * 24));
    } else {
      // After Ramadan, countdown to next year
      if (nextYearRamadan) {
        targetDate = new Date(nextYearRamadan.start);
        const diff = targetDate.getTime() - now.getTime();
        daysUntilRamadan = Math.ceil(diff / (1000 * 60 * 60 * 24));
      } else {
        targetDate = now;
      }
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
      totalRamadanDays: 30,
      targetDate,
    };
  }, [hijriInfo, now]);

  const status = calculateRamadanStatus();

  return {
    days: status.days,
    hours: status.hours,
    minutes: status.minutes,
    seconds: status.seconds,
    isRamadan: status.isRamadan,
    daysUntilRamadan: status.daysUntilRamadan,
    daysInRamadan: status.daysInRamadan,
    totalRamadanDays: status.totalRamadanDays,
    hijriDate: hijriInfo
      ? hijriInfo.label
      : "",
    loading,
  };
}
