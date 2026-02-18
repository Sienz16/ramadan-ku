import { describe, expect, test } from "bun:test";
import { dailyVerses, getDailyVerse } from "./quran";

describe("getDailyVerse", () => {
  test("uses Kuala Lumpur calendar day for verse rotation", () => {
    const verse = getDailyVerse(new Date("2026-02-17T16:30:00Z"));

    expect(verse).toBe(dailyVerses[17]);
  });
});
