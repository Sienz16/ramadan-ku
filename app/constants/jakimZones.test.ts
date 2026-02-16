import { describe, expect, test } from "bun:test";
import { AUTO_DETECT_LOCATIONS, JAKIM_LOCATIONS } from "./jakimZones";

describe("JAKIM_LOCATIONS", () => {
  test("contains full published JAKIM zone coverage", () => {
    expect(JAKIM_LOCATIONS.length).toBe(60);
  });

  test("keeps unique zone codes", () => {
    const codes = JAKIM_LOCATIONS.map((item) => item.zone);
    const uniqueCodes = new Set(codes);

    expect(uniqueCodes.size).toBe(codes.length);
    expect(uniqueCodes.has("SBH07")).toBe(true);
    expect(uniqueCodes.has("WLY01")).toBe(true);
  });
});

describe("AUTO_DETECT_LOCATIONS", () => {
  test("contains representative zones for accurate nearest matching", () => {
    expect(AUTO_DETECT_LOCATIONS.length).toBeGreaterThanOrEqual(14);
    expect(AUTO_DETECT_LOCATIONS.some((item) => item.zone === "SBH07")).toBe(true);
    expect(AUTO_DETECT_LOCATIONS.some((item) => item.zone === "WLY01")).toBe(true);
  });

  test("keeps unique zones", () => {
    const zones = AUTO_DETECT_LOCATIONS.map((item) => item.zone);
    expect(new Set(zones).size).toBe(zones.length);
  });
});
