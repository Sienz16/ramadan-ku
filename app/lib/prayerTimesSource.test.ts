import { describe, expect, test } from "bun:test";
import {
  findNearestLocation,
  formatHijriDateFromJakim,
  mapJakimTimingsToCorePrayers,
  resolveZone,
  type BasicLocation,
} from "./prayerTimesSource";

describe("mapJakimTimingsToCorePrayers", () => {
  test("maps JAKIM keys and strips seconds", () => {
    const mapped = mapJakimTimingsToCorePrayers({
      fajr: "05:22:00",
      syuruk: "06:31:00",
      dhuhr: "12:32:00",
      asr: "15:51:00",
      maghrib: "18:29:00",
      isha: "19:40:00",
    });

    expect(mapped).toEqual({
      Fajr: "05:22",
      Sunrise: "06:31",
      Dhuhr: "12:32",
      Asr: "15:51",
      Maghrib: "18:29",
      Isha: "19:40",
    });
  });
});

describe("findNearestLocation", () => {
  test("returns the nearest preset city for auto geolocation", () => {
    const locations: BasicLocation[] = [
      { city: "Kota Kinabalu", latitude: 5.9804, longitude: 116.0735, zone: "SBH07" },
      { city: "Kuala Lumpur", latitude: 3.139, longitude: 101.6869, zone: "WLY01" },
    ];

    const nearest = findNearestLocation(5.99, 116.08, locations);

    expect(nearest?.city).toBe("Kota Kinabalu");
    expect(nearest?.zone).toBe("SBH07");
  });
});

describe("resolveZone", () => {
  test("prefers explicit selected zone", () => {
    const locations: BasicLocation[] = [
      { city: "Kota Kinabalu", latitude: 5.9804, longitude: 116.0735, zone: "SBH07" },
      { city: "Kuala Lumpur", latitude: 3.139, longitude: 101.6869, zone: "WLY01" },
    ];

    const zone = resolveZone(
      { latitude: 5.99, longitude: 116.08, zone: "WLY01" },
      locations
    );

    expect(zone).toBe("WLY01");
  });

  test("uses nearest mapped zone when zone missing", () => {
    const locations: BasicLocation[] = [
      { city: "Kota Kinabalu", latitude: 5.9804, longitude: 116.0735, zone: "SBH07" },
      { city: "Kuala Lumpur", latitude: 3.139, longitude: 101.6869, zone: "WLY01" },
    ];

    const zone = resolveZone({ latitude: 5.99, longitude: 116.08 }, locations);

    expect(zone).toBe("SBH07");
  });
});

describe("formatHijriDateFromJakim", () => {
  test("formats JAKIM hijri value into readable label", () => {
    const label = formatHijriDateFromJakim("1447-08-28");

    expect(label).toBe("28 Sya'ban 1447");
  });
});
