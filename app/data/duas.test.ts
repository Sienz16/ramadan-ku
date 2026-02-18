import { describe, expect, test } from "bun:test";
import { dailyDuas, getDailyDua } from "./duas";

describe("getDailyDua", () => {
  test("uses Kuala Lumpur calendar day for dua rotation", () => {
    const dua = getDailyDua(new Date("2026-02-17T16:30:00Z"));

    expect(dua).toBe(dailyDuas[17]);
  });
});
