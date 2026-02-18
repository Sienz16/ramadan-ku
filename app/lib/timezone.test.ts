import { describe, expect, test } from "bun:test";
import {
  KUALA_LUMPUR_TIMEZONE,
  getKualaLumpurClock,
  getKualaLumpurDateParts,
  getKualaLumpurYear,
  toKualaLumpurMidnightUtc,
} from "./timezone";

describe("timezone helpers", () => {
  test("exports Kuala Lumpur timezone id", () => {
    expect(KUALA_LUMPUR_TIMEZONE).toBe("Asia/Kuala_Lumpur");
  });

  test("derives Kuala Lumpur date parts from UTC instant", () => {
    const parts = getKualaLumpurDateParts(new Date("2026-02-17T16:30:00Z"));

    expect(parts.year).toBe(2026);
    expect(parts.month).toBe(2);
    expect(parts.day).toBe(18);
    expect(parts.hour).toBe(0);
    expect(parts.minute).toBe(30);
  });

  test("derives Kuala Lumpur year near UTC year boundary", () => {
    expect(getKualaLumpurYear(new Date("2025-12-31T16:30:00Z"))).toBe(2026);
  });

  test("converts Kuala Lumpur calendar date to UTC midnight instant", () => {
    const utc = toKualaLumpurMidnightUtc(2026, 2, 18);

    expect(utc.toISOString()).toBe("2026-02-17T16:00:00.000Z");
  });

  test("returns Kuala Lumpur clock for instant", () => {
    const clock = getKualaLumpurClock(new Date("2026-02-17T22:45:00Z"));

    expect(clock.hour).toBe(6);
    expect(clock.minute).toBe(45);
  });
});
