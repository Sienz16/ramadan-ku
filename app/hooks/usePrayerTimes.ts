"use client";

import { useState, useEffect, useMemo } from "react";
import { mapJakimTimingsToCorePrayers, resolveZone } from "../lib/prayerTimesSource";
import { malaysianLocations } from "./useLocation";

export interface PrayerTime {
  name: string;
  arabicName: string;
  time: string;
  time12h: string;
  isNext: boolean;
  isCurrent: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zone?: string;
}

// Helper to convert 24h to 12h format
function to12Hour(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12;
  return `${h}:${minute} ${period}`;
}

type PrayerKey = "Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

function toPrayerTimes(timings: Record<PrayerKey, string>): PrayerTime[] {
  const prayerNames: Record<string, string> = {
    Fajr: "الفجر",
    Sunrise: "الشروق",
    Dhuhr: "الظهر",
    Asr: "العصر",
    Maghrib: "المغرب",
    Isha: "العشاء",
  };

  const prayers: PrayerKey[] = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

  return prayers.map((name) => ({
    name,
    arabicName: prayerNames[name],
    time: timings[name],
    time12h: to12Hour(timings[name]),
    isNext: false,
    isCurrent: false,
  }));
}

async function fetchJakimPrayerTimes(zone: string): Promise<PrayerTime[]> {
  const url = `https://www.e-solat.gov.my/index.php?r=esolatApi/takwimsolat&period=today&zone=${zone}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch JAKIM prayer times");
  }

  const data = await response.json();
  const timings = data?.prayerTime?.[0];

  if (!timings || data?.status !== "OK!") {
    throw new Error("JAKIM API returned no prayer data");
  }

  const coreTimings = mapJakimTimingsToCorePrayers(timings);

  return toPrayerTimes(coreTimings);
}

async function fetchPrayerTimes(zone: string): Promise<PrayerTime[]> {
  return fetchJakimPrayerTimes(zone);
}

export function usePrayerTimes(location: Location | null) {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<Date>(new Date());

  // Extract primitive values to avoid object reference issues
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const zone = location?.zone;

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch prayer times when location changes
  useEffect(() => {
    // Skip if no location or if lat/lng are undefined
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      setPrayerTimes([]);
      return;
    }

    let cancelled = false;

    const fetchTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const resolvedZone = resolveZone(
          {
            latitude,
            longitude,
            zone,
          },
          malaysianLocations
        );

        if (!resolvedZone) {
          throw new Error("Unable to resolve JAKIM zone for selected location");
        }

        const times = await fetchPrayerTimes(resolvedZone);
        if (!cancelled) {
          setPrayerTimes(times);
        }
      } catch {
        if (!cancelled) {
          setError("Gagal mendapatkan waktu solat. Sila cuba lagi.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchTimes();

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, zone]);

  // Calculate next prayer and current prayer
  const prayersWithStatus = useMemo(() => {
    if (prayerTimes.length === 0) return [];

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    let nextPrayerIndex = -1;
    let currentPrayerIndex = -1;

    prayerTimes.forEach((prayer, index) => {
      const [h, m] = prayer.time.split(":").map(Number);
      const prayerTime = h * 60 + m;

      // Current prayer is within 30 min window
      if (currentTime >= prayerTime - 30 && currentTime < prayerTime + 30) {
        currentPrayerIndex = index;
      }

      // Next prayer is the first one after current time
      if (prayerTime > currentTime && nextPrayerIndex === -1) {
        nextPrayerIndex = index;
      }
    });

    // If no next prayer found, next is Fajr tomorrow
    if (nextPrayerIndex === -1) {
      nextPrayerIndex = 0;
    }

    return prayerTimes.map((prayer, index) => ({
      ...prayer,
      isNext: index === nextPrayerIndex,
      isCurrent: index === currentPrayerIndex,
    }));
  }, [prayerTimes, now]);

  const nextPrayer = useMemo(() => {
    return prayersWithStatus.find((p) => p.isNext) || null;
  }, [prayersWithStatus]);

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

    return `${hours}j ${minutes}m`;
  }, [now, nextPrayer]);

  return {
    prayers: prayersWithStatus,
    nextPrayer,
    timeUntilNext,
    loading,
    error,
  };
}
