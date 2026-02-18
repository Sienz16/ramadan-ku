import { describe, expect, test } from "bun:test";
import { buildDeliveryKey, findDuePrayerName, resolveRamadanEventFromHijri } from "./pushScheduler";

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

describe("resolveRamadanEventFromHijri", () => {
  test("returns RAMADAN_START for 1 Ramadan", () => {
    const event = resolveRamadanEventFromHijri("1447-09-01");

    expect(event).toBe("RAMADAN_START");
  });

  test("returns EID_START for 1 Syawal", () => {
    const event = resolveRamadanEventFromHijri("1447-10-01");

    expect(event).toBe("EID_START");
  });

  test("returns null for non-boundary Hijri date", () => {
    const event = resolveRamadanEventFromHijri("1447-09-12");

    expect(event).toBeNull();
  });
});
