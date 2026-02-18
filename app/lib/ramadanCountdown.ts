import { getKualaLumpurDateParts, toKualaLumpurMidnightUtc } from "./timezone";

export interface HijriInfo {
  month: number;
  day: number;
  year: string;
  label: string;
}

export interface JakimCalendarEntry {
  hijri: string;
  date: string;
}

interface DerivedRamadanStatus {
  isRamadan: boolean;
  daysUntilRamadan: number;
  daysInRamadan: number;
  targetDate: Date | null;
}

const MONTHS: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseJakimDate(value: string): Date | null {
  const parts = value.split("-");
  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const month = MONTHS[parts[1]];
  const year = Number(parts[2]);

  if (!Number.isFinite(day) || month === undefined || !Number.isFinite(year)) {
    return null;
  }

  return toKualaLumpurMidnightUtc(year, month + 1, day);
}

function parseHijri(value: string): { month: number; day: number } | null {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3) {
    return null;
  }

  const month = parts[1];
  const day = parts[2];

  if (!Number.isFinite(month) || !Number.isFinite(day)) {
    return null;
  }

  return { month, day };
}

function startOfKualaLumpurDay(value: Date): Date {
  const parts = getKualaLumpurDateParts(value);
  return toKualaLumpurMidnightUtc(parts.year, parts.month, parts.day);
}

function findNextHijriDate(
  entries: JakimCalendarEntry[],
  now: Date,
  targetMonth: number,
  targetDay: number
): Date | null {
  const nowDay = startOfKualaLumpurDay(now).getTime();

  const candidates = entries
    .map((entry) => {
      const hijri = parseHijri(entry.hijri);
      const gregorian = parseJakimDate(entry.date);

      if (!hijri || !gregorian) {
        return null;
      }

      if (hijri.month !== targetMonth || hijri.day !== targetDay) {
        return null;
      }

      return gregorian;
    })
    .filter((value): value is Date => value !== null)
    .filter((date) => date.getTime() >= nowDay)
    .sort((a, b) => a.getTime() - b.getTime());

  return candidates[0] ?? null;
}

export function deriveRamadanStatus(
  now: Date,
  hijriInfo: HijriInfo | null,
  entries: JakimCalendarEntry[]
): DerivedRamadanStatus {
  const todayKualaLumpur = startOfKualaLumpurDay(now);
  const isRamadan = hijriInfo?.month === 9;

  if (isRamadan) {
    const syawalStart = findNextHijriDate(entries, now, 10, 1);
    return {
      isRamadan: true,
      daysUntilRamadan: 0,
      daysInRamadan: hijriInfo?.day ?? 0,
      targetDate: syawalStart,
    };
  }

  const nextRamadan = findNextHijriDate(entries, now, 9, 1);
  if (!nextRamadan) {
    return {
      isRamadan: false,
      daysUntilRamadan: 0,
      daysInRamadan: 0,
      targetDate: null,
    };
  }

  const diff = nextRamadan.getTime() - todayKualaLumpur.getTime();
  const daysUntilRamadan = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));

  return {
    isRamadan: false,
    daysUntilRamadan,
    daysInRamadan: 0,
    targetDate: nextRamadan,
  };
}
