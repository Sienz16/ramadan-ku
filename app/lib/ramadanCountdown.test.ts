import { describe, expect, test } from "bun:test";
import {
  deriveRamadanStatus,
  type HijriInfo,
  type JakimCalendarEntry,
} from "./ramadanCountdown";

function buildEntry(date: string, hijri: string): JakimCalendarEntry {
  return { date, hijri };
}

describe("deriveRamadanStatus", () => {
  test("uses next Ramadan date from JAKIM calendar before Ramadan", () => {
    const now = new Date("2026-02-16T12:00:00+08:00");
    const hijriInfo: HijriInfo = { month: 8, day: 28, year: "1447", label: "28 Sya'ban 1447" };
    const calendar = [
      buildEntry("16-Feb-2026", "1447-08-28"),
      buildEntry("18-Feb-2026", "1447-09-01"),
      buildEntry("20-Mar-2026", "1447-10-01"),
    ];

    const status = deriveRamadanStatus(now, hijriInfo, calendar);

    expect(status.isRamadan).toBe(false);
    expect(status.daysUntilRamadan).toBe(2);
    expect(status.targetDate?.toISOString()).toBe("2026-02-18T00:00:00.000Z");
  });

  test("uses Syawal start from JAKIM calendar during Ramadan", () => {
    const now = new Date("2026-03-01T12:00:00+08:00");
    const hijriInfo: HijriInfo = { month: 9, day: 12, year: "1447", label: "12 Ramadan 1447" };
    const calendar = [
      buildEntry("18-Feb-2026", "1447-09-01"),
      buildEntry("20-Mar-2026", "1447-10-01"),
    ];

    const status = deriveRamadanStatus(now, hijriInfo, calendar);

    expect(status.isRamadan).toBe(true);
    expect(status.daysInRamadan).toBe(12);
    expect(status.targetDate?.toISOString()).toBe("2026-03-20T00:00:00.000Z");
  });

  test("uses next-year Ramadan when current year Ramadan already passed", () => {
    const now = new Date("2026-10-01T12:00:00+08:00");
    const hijriInfo: HijriInfo = { month: 4, day: 20, year: "1448", label: "20 Rabiulakhir 1448" };
    const calendar = [
      buildEntry("18-Feb-2026", "1447-09-01"),
      buildEntry("07-Feb-2027", "1448-09-01"),
    ];

    const status = deriveRamadanStatus(now, hijriInfo, calendar);

    expect(status.isRamadan).toBe(false);
    expect(status.targetDate?.toISOString()).toBe("2027-02-07T00:00:00.000Z");
    expect(status.daysUntilRamadan).toBeGreaterThan(0);
  });
});
