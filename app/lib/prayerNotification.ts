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

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTimeKey(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function buildPrayerNotificationKey(now: Date, prayerName: string): string {
  return `${formatDateKey(now)}|${prayerName}`;
}

export function findPrayerToNotify(prayers: NotificationPrayer[], now: Date): NotificationPrayer | null {
  const currentTime = formatTimeKey(now);

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
