"use client";

import { useCallback, useMemo, useState } from "react";
import { getKualaLumpurDateKey } from "../lib/timezone";
import {
  calculateGamificationMetrics,
  getUnlockedBadges,
  normalizeHabitState,
  toggleChecklistItem,
  type ChecklistItemId,
  type HabitGamificationState,
} from "../lib/habitGamification";

const STORAGE_KEY = "ramadanku:habit-gamification-v1";

function loadInitialState(): HabitGamificationState {
  if (typeof window === "undefined") {
    return { entries: [], bestStreak: 0 };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { entries: [], bestStreak: 0 };
    }
    return normalizeHabitState(JSON.parse(raw));
  } catch {
    return { entries: [], bestStreak: 0 };
  }
}

export function useHabitGamification() {
  const [state, setState] = useState<HabitGamificationState>(() => loadInitialState());
  const todayDateKey = getKualaLumpurDateKey(new Date());

  const metrics = useMemo(() => calculateGamificationMetrics(state, todayDateKey), [state, todayDateKey]);

  const withBestStreak = useMemo(() => ({ ...state, bestStreak: Math.max(state.bestStreak, metrics.bestStreak) }), [metrics.bestStreak, state]);

  const todayEntry = useMemo(
    () => withBestStreak.entries.find((entry) => entry.dateKey === todayDateKey) ?? { dateKey: todayDateKey, completed: [] },
    [todayDateKey, withBestStreak.entries]
  );

  const unlockedBadges = useMemo(() => getUnlockedBadges(metrics), [metrics]);

  const updateState = useCallback((next: HabitGamificationState) => {
    const normalized = normalizeHabitState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    setState(normalized);
  }, []);

  const toggleItem = useCallback((itemId: ChecklistItemId) => {
    const next = toggleChecklistItem(withBestStreak, todayDateKey, itemId);
    const nextMetrics = calculateGamificationMetrics(next, todayDateKey);
    updateState({
      ...next,
      bestStreak: Math.max(next.bestStreak, nextMetrics.bestStreak),
    });
  }, [todayDateKey, updateState, withBestStreak]);

  return {
    todayDateKey,
    todayCompleted: todayEntry.completed,
    metrics,
    unlockedBadges,
    toggleItem,
  };
}
