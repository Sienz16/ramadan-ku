const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export type PushPrayerName = (typeof PRAYER_ORDER)[number];
export type RamadanEventName = "RAMADAN_START" | "EID_START";

export interface DayPrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function findDuePrayerName(times: DayPrayerTimes, currentHourMinute: string): PushPrayerName | null {
  for (const prayerName of PRAYER_ORDER) {
    if (times[prayerName] === currentHourMinute) {
      return prayerName;
    }
  }

  return null;
}

export function buildDeliveryKey(dateKey: string, zone: string, prayerName: PushPrayerName): string {
  return `${dateKey}|${zone}|${prayerName}`;
}

export function resolveRamadanEventFromHijri(hijri: string): RamadanEventName | null {
  const parts = hijri.split("-");
  if (parts.length !== 3) {
    return null;
  }

  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (month === 9 && day === 1) {
    return "RAMADAN_START";
  }

  if (month === 10 && day === 1) {
    return "EID_START";
  }

  return null;
}
