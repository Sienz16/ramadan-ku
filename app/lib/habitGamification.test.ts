import { describe, expect, test } from "bun:test";
import {
  CHECKLIST_ITEMS,
  calculateGamificationMetrics,
  getUnlockedBadges,
  toggleChecklistItem,
  type HabitGamificationState,
} from "./habitGamification";

describe("toggleChecklistItem", () => {
  test("adds and removes checklist item for current date", () => {
    const dateKey = "2026-03-05";
    const initial: HabitGamificationState = {
      entries: [],
      bestStreak: 0,
    };

    const withItem = toggleChecklistItem(initial, dateKey, "sahur");
    expect(withItem.entries[0]?.completed).toEqual(["sahur"]);

    const withoutItem = toggleChecklistItem(withItem, dateKey, "sahur");
    expect(withoutItem.entries[0]?.completed).toEqual([]);
  });
});

describe("calculateGamificationMetrics", () => {
  test("calculates streak, weekly score, and pet xp", () => {
    const allDone = CHECKLIST_ITEMS.map((item) => item.id);
    const state: HabitGamificationState = {
      entries: [
        { dateKey: "2026-03-03", completed: allDone },
        { dateKey: "2026-03-04", completed: allDone },
        { dateKey: "2026-03-05", completed: allDone },
      ],
      bestStreak: 0,
    };

    const metrics = calculateGamificationMetrics(state, "2026-03-05");

    expect(metrics.currentStreak).toBe(3);
    expect(metrics.bestStreak).toBe(3);
    expect(metrics.weeklyConsistencyScore).toBeGreaterThan(0);
    expect(metrics.pet.totalXp).toBeGreaterThan(0);
  });

  test("resets current streak when today is incomplete", () => {
    const allDone = CHECKLIST_ITEMS.map((item) => item.id);
    const state: HabitGamificationState = {
      entries: [
        { dateKey: "2026-03-04", completed: allDone },
        { dateKey: "2026-03-05", completed: ["sahur", "solat5"] },
      ],
      bestStreak: 5,
    };

    const metrics = calculateGamificationMetrics(state, "2026-03-05");

    expect(metrics.currentStreak).toBe(0);
    expect(metrics.bestStreak).toBe(5);
  });

  test("uses consistent Hilal pet evolution names", () => {
    const base: HabitGamificationState = {
      entries: [],
      bestStreak: 0,
    };

    const stageOne = calculateGamificationMetrics(base, "2026-03-05");
    expect(stageOne.pet.label).toBe("Permata Hilal");
    expect(stageOne.pet.emoji).toBe("🥚");

    const allDone = CHECKLIST_ITEMS.map((item) => item.id);
    const stageTwo = calculateGamificationMetrics(
      {
        entries: [
          { dateKey: "2026-03-03", completed: allDone },
          { dateKey: "2026-03-04", completed: allDone },
          { dateKey: "2026-03-05", completed: allDone },
          { dateKey: "2026-03-06", completed: allDone },
        ],
        bestStreak: 0,
      },
      "2026-03-06"
    );

    expect(stageTwo.pet.label).toBe("Anak Hilal");
    expect(stageTwo.pet.emoji).toBe("🐣");

    const stageFour = calculateGamificationMetrics(
      {
        entries: [
          ...Array.from({ length: 12 }).map((_, index) => ({
            dateKey: `2026-03-${String(index + 1).padStart(2, "0")}`,
            completed: allDone,
          })),
        ],
        bestStreak: 0,
      },
      "2026-03-12"
    );

    expect(stageFour.pet.label).toBe("Panglima Hilal");
    expect(stageFour.pet.emoji).toBe("🦅");
  });
});

describe("getUnlockedBadges", () => {
  test("returns unlocked badges based on metrics", () => {
    const badges = getUnlockedBadges({
      currentStreak: 8,
      bestStreak: 8,
      weeklyConsistencyScore: 92,
      perfectDaysCount: 12,
      totalCompletedActions: 100,
      pet: {
        stage: "guardian",
        label: "Penjaga Hilal",
        emoji: "🦉",
        totalXp: 500,
        progressToNextPercent: 100,
      },
    });

    expect(badges.length).toBeGreaterThanOrEqual(3);
  });
});
