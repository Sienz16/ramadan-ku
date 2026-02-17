import { describe, expect, test } from "bun:test";
import {
  buildPrayerNotificationKey,
  findPrayerToNotify,
  shouldTriggerPrayerNotification,
  type NotificationPrayer,
} from "./prayerNotification";

const prayers: NotificationPrayer[] = [
  { name: "Fajr", time: "05:55", time12h: "5:55 AM" },
  { name: "Sunrise", time: "07:00", time12h: "7:00 AM" },
  { name: "Dhuhr", time: "13:15", time12h: "1:15 PM" },
];

describe("findPrayerToNotify", () => {
  test("returns prayer when current minute matches prayer time", () => {
    const now = new Date(2026, 1, 17, 5, 55, 20);

    expect(findPrayerToNotify(prayers, now)?.name).toBe("Fajr");
  });

  test("skips non-solat entries like Sunrise", () => {
    const now = new Date(2026, 1, 17, 7, 0, 0);

    expect(findPrayerToNotify(prayers, now)).toBeNull();
  });
});

describe("shouldTriggerPrayerNotification", () => {
  test("triggers once when enabled and permission granted", () => {
    const now = new Date(2026, 1, 17, 13, 15, 10);

    const result = shouldTriggerPrayerNotification({
      enabled: true,
      permission: "granted",
      prayers,
      now,
      lastSentKey: null,
    });

    expect(result?.prayer.name).toBe("Dhuhr");
    expect(result?.key).toBe(buildPrayerNotificationKey(now, "Dhuhr"));
  });

  test("does not trigger again for same prayer/day key", () => {
    const now = new Date(2026, 1, 17, 13, 15, 50);
    const lastSentKey = buildPrayerNotificationKey(now, "Dhuhr");

    const result = shouldTriggerPrayerNotification({
      enabled: true,
      permission: "granted",
      prayers,
      now,
      lastSentKey,
    });

    expect(result).toBeNull();
  });

  test("does not trigger when permission is denied", () => {
    const now = new Date(2026, 1, 17, 5, 55, 0);

    const result = shouldTriggerPrayerNotification({
      enabled: true,
      permission: "denied",
      prayers,
      now,
      lastSentKey: null,
    });

    expect(result).toBeNull();
  });
});
