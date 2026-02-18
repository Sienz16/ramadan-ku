import { getKualaLumpurDateKey, getKualaLumpurTimeKey } from "./timezone";

export interface NotificationPrayer {
  name: string;
  time: string;
  time12h: string;
}

interface ShouldTriggerInput {
  enabled: boolean;
  permission: NotificationPermission;
  prayers: NotificationPrayer[];
  now: Date;
  lastSentKey: string | null;
}

const NON_SOLAT_NAMES = new Set(["Sunrise"]);

export function buildPrayerNotificationKey(now: Date, prayerName: string): string {
  return `${getKualaLumpurDateKey(now)}|${prayerName}`;
}

export function findPrayerToNotify(prayers: NotificationPrayer[], now: Date): NotificationPrayer | null {
  const currentTime = getKualaLumpurTimeKey(now);

  const prayer = prayers.find((item) => item.time === currentTime && !NON_SOLAT_NAMES.has(item.name));
  return prayer ?? null;
}

export function shouldTriggerPrayerNotification(input: ShouldTriggerInput) {
  if (!input.enabled || input.permission !== "granted") {
    return null;
  }

  const prayer = findPrayerToNotify(input.prayers, input.now);
  if (!prayer) {
    return null;
  }

  const key = buildPrayerNotificationKey(input.now, prayer.name);
  if (input.lastSentKey === key) {
    return null;
  }

  return { prayer, key };
}
