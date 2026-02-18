import { describe, expect, test } from "bun:test";
import { buildDeliveryKey, findDuePrayerName } from "./pushScheduler";

describe("findDuePrayerName", () => {
  test("returns prayer when current Kuala Lumpur minute matches", () => {
    const result = findDuePrayerName(
      {
        Fajr: "05:55",
        Sunrise: "07:00",
        Dhuhr: "13:15",
        Asr: "16:40",
        Maghrib: "19:23",
        Isha: "20:34",
      },
      "13:15"
    );

    expect(result).toBe("Dhuhr");
  });

  test("never returns Sunrise", () => {
    const result = findDuePrayerName(
      {
        Fajr: "05:55",
        Sunrise: "07:00",
        Dhuhr: "13:15",
        Asr: "16:40",
        Maghrib: "19:23",
        Isha: "20:34",
      },
      "07:00"
    );

    expect(result).toBeNull();
  });
});

describe("buildDeliveryKey", () => {
  test("builds stable key by date, zone, and prayer", () => {
    const key = buildDeliveryKey("2026-03-01", "WLY01", "Maghrib");

    expect(key).toBe("2026-03-01|WLY01|Maghrib");
  });
});
