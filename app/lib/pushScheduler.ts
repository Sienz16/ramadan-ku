const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export type PushPrayerName = (typeof PRAYER_ORDER)[number];

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
