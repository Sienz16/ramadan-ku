"use client";

import { useState, useEffect, useCallback } from "react";
import { formatHijriDateFromJakim } from "../lib/prayerTimesSource";
import { deriveRamadanStatus, type HijriInfo, type JakimCalendarEntry } from "../lib/ramadanCountdown";

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

async function fetchYearCalendar(zone: string, year: number): Promise<JakimCalendarEntry[]> {
  try {
    const response = await fetch(
      `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=year&zone=${zone}&year=${year}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    if (data?.status !== "OK!" || !Array.isArray(data?.prayerTime)) {
      return [];
    }

    return data.prayerTime.map((item: { hijri?: string; date?: string }) => ({
      hijri: String(item.hijri ?? ""),
      date: String(item.date ?? ""),
    }));
  } catch {
    return [];
  }
}

export function useCountdown(zone?: string): CountdownResult {
  const [now, setNow] = useState<Date | null>(null);
  const [hijriInfo, setHijriInfo] = useState<{
    month: number;
    label: string;
    day: number;
    year: string;
  } | null>(null);
  const [calendarEntries, setCalendarEntries] = useState<JakimCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Hijri date on mount
  useEffect(() => {
    let cancelled = false;

    const fetchHijri = async () => {
      try {
        const activeZone = zone ?? DEFAULT_ZONE;
        const currentYear = new Date().getUTCFullYear();

        const [hijriData, thisYearEntries, nextYearEntries] = await Promise.all([
          fetchHijriDate(activeZone),
          fetchYearCalendar(activeZone, currentYear),
          fetchYearCalendar(activeZone, currentYear + 1),
        ]);

        if (cancelled) {
          return;
        }

        if (hijriData) {
          setHijriInfo(hijriData as HijriInfo);
        }

        setCalendarEntries([...thisYearEntries, ...nextYearEntries]);
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
        targetDate: null as Date | null,
      };
    }

    const derived = deriveRamadanStatus(now, hijriInfo, calendarEntries);
    const targetDate = derived.targetDate;
    if (!targetDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isRamadan: derived.isRamadan,
        daysUntilRamadan: derived.daysUntilRamadan,
        daysInRamadan: derived.daysInRamadan,
        totalRamadanDays: 30,
        targetDate: null,
      };
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
      isRamadan: derived.isRamadan,
      daysUntilRamadan: derived.daysUntilRamadan,
      daysInRamadan: derived.daysInRamadan,
      totalRamadanDays: 30,
      targetDate,
    };
  }, [calendarEntries, hijriInfo, now]);

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
