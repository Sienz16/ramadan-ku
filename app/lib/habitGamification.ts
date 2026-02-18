export type ChecklistItemId = "sahur" | "solat5" | "quran" | "zikir" | "sedekah" | "tarawih";

export interface ChecklistItemDefinition {
  id: ChecklistItemId;
  label: string;
  icon: string;
}

export interface HabitEntry {
  dateKey: string;
  completed: ChecklistItemId[];
}

export interface HabitGamificationState {
  entries: HabitEntry[];
  bestStreak: number;
}

export interface PetProgress {
  stage: "seed" | "spark" | "guardian" | "commander";
  label: string;
  emoji: string;
  totalXp: number;
  progressToNextPercent: number;
}

export interface GamificationMetrics {
  currentStreak: number;
  bestStreak: number;
  weeklyConsistencyScore: number;
  perfectDaysCount: number;
  totalCompletedActions: number;
  pet: PetProgress;
}

export interface Badge {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export const CHECKLIST_ITEMS: ChecklistItemDefinition[] = [
  { id: "sahur", label: "Sahur", icon: "🍽️" },
  { id: "solat5", label: "5 Waktu Solat", icon: "🕌" },
  { id: "quran", label: "Tilawah Quran", icon: "📖" },
  { id: "zikir", label: "Zikir", icon: "🤲" },
  { id: "sedekah", label: "Sedekah", icon: "💛" },
  { id: "tarawih", label: "Tarawih", icon: "🌙" },
];

const PERFECT_DAY_MIN = CHECKLIST_ITEMS.length;
const XP_PER_ACTION = 10;
const XP_PER_PERFECT_DAY = 20;

function uniqueSortedChecklist(items: ChecklistItemId[]): ChecklistItemId[] {
  return Array.from(new Set(items)).sort();
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function addDays(dateKey: string, delta: number): string {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + delta);
  return formatDateKey(date);
}

export function normalizeHabitState(input: unknown): HabitGamificationState {
  if (!input || typeof input !== "object") {
    return { entries: [], bestStreak: 0 };
  }

  const candidate = input as Partial<HabitGamificationState>;
  const entries = Array.isArray(candidate.entries)
    ? candidate.entries
      .filter((entry): entry is HabitEntry => {
        if (!entry || typeof entry !== "object") {
          return false;
        }
        const row = entry as Partial<HabitEntry>;
        return typeof row.dateKey === "string" && Array.isArray(row.completed);
      })
      .map((entry) => ({
        dateKey: entry.dateKey,
        completed: uniqueSortedChecklist(
          entry.completed.filter((value): value is ChecklistItemId => CHECKLIST_ITEMS.some((item) => item.id === value))
        ),
      }))
    : [];

  return {
    entries,
    bestStreak: typeof candidate.bestStreak === "number" ? Math.max(0, candidate.bestStreak) : 0,
  };
}

export function toggleChecklistItem(
  state: HabitGamificationState,
  dateKey: string,
  itemId: ChecklistItemId
): HabitGamificationState {
  const existing = state.entries.find((entry) => entry.dateKey === dateKey);

  const nextCompleted = existing
    ? existing.completed.includes(itemId)
      ? existing.completed.filter((id) => id !== itemId)
      : [...existing.completed, itemId]
    : [itemId];

  const nextEntry: HabitEntry = {
    dateKey,
    completed: uniqueSortedChecklist(nextCompleted),
  };

  const mergedEntries = existing
    ? state.entries.map((entry) => (entry.dateKey === dateKey ? nextEntry : entry))
    : [...state.entries, nextEntry];

  return {
    ...state,
    entries: mergedEntries.sort((a, b) => a.dateKey.localeCompare(b.dateKey)),
  };
}

function isPerfectDay(entry: HabitEntry | undefined): boolean {
  return (entry?.completed.length ?? 0) >= PERFECT_DAY_MIN;
}

function calculateCurrentStreak(entries: HabitEntry[], todayKey: string): number {
  const byDate = new Map(entries.map((entry) => [entry.dateKey, entry]));
  let streak = 0;
  let cursor = todayKey;

  while (isPerfectDay(byDate.get(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function calculateWeeklyConsistency(entries: HabitEntry[], todayKey: string): number {
  const byDate = new Map(entries.map((entry) => [entry.dateKey, entry]));
  let completionTotal = 0;

  for (let index = 0; index < 7; index += 1) {
    const targetDateKey = addDays(todayKey, -index);
    const completedCount = byDate.get(targetDateKey)?.completed.length ?? 0;
    completionTotal += completedCount / PERFECT_DAY_MIN;
  }

  const ratio = completionTotal / 7;
  return Math.round(ratio * 100);
}

function calculatePetProgress(totalXp: number): PetProgress {
  if (totalXp >= 900) {
    return {
      stage: "commander",
      label: "Panglima Hilal",
      emoji: "🦅",
      totalXp,
      progressToNextPercent: 100,
    };
  }

  if (totalXp >= 600) {
    return {
      stage: "guardian",
      label: "Penjaga Hilal",
      emoji: "🦉",
      totalXp,
      progressToNextPercent: Math.round(((totalXp - 600) / 300) * 100),
    };
  }

  if (totalXp >= 250) {
    return {
      stage: "spark",
      label: "Anak Hilal",
      emoji: "🐣",
      totalXp,
      progressToNextPercent: Math.round(((totalXp - 250) / 350) * 100),
    };
  }

  return {
    stage: "seed",
    label: "Permata Hilal",
    emoji: "🥚",
    totalXp,
    progressToNextPercent: Math.round((totalXp / 250) * 100),
  };
}

export function calculateGamificationMetrics(state: HabitGamificationState, todayDateKey: string): GamificationMetrics {
  const normalized = normalizeHabitState(state);
  const currentStreak = calculateCurrentStreak(normalized.entries, todayDateKey);
  const perfectDaysCount = normalized.entries.filter((entry) => isPerfectDay(entry)).length;
  const totalCompletedActions = normalized.entries.reduce((sum, entry) => sum + entry.completed.length, 0);
  const bestStreak = Math.max(normalized.bestStreak, currentStreak);
  const weeklyConsistencyScore = calculateWeeklyConsistency(normalized.entries, todayDateKey);
  const totalXp = totalCompletedActions * XP_PER_ACTION + perfectDaysCount * XP_PER_PERFECT_DAY;

  return {
    currentStreak,
    bestStreak,
    weeklyConsistencyScore,
    perfectDaysCount,
    totalCompletedActions,
    pet: calculatePetProgress(totalXp),
  };
}

const BADGES: Badge[] = [
  { id: "streak-3", label: "Api Konsisten", description: "Streak 3 hari berturut", icon: "🔥" },
  { id: "streak-7", label: "Pejuang Ramadan", description: "Streak 7 hari berturut", icon: "🌙" },
  { id: "streak-14", label: "Legenda Istiqamah", description: "Streak 14 hari berturut", icon: "🏆" },
  { id: "weekly-85", label: "Minggu Emas", description: "Skor mingguan 85% ke atas", icon: "✨" },
  { id: "perfect-10", label: "10 Hari Sempurna", description: "Lengkap checklist penuh 10 hari", icon: "💎" },
];

export function getUnlockedBadges(metrics: GamificationMetrics): Badge[] {
  return BADGES.filter((badge) => {
    if (badge.id === "streak-3") return metrics.currentStreak >= 3;
    if (badge.id === "streak-7") return metrics.currentStreak >= 7;
    if (badge.id === "streak-14") return metrics.currentStreak >= 14;
    if (badge.id === "weekly-85") return metrics.weeklyConsistencyScore >= 85;
    if (badge.id === "perfect-10") return metrics.perfectDaysCount >= 10;
    return false;
  });
}
