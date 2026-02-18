export const KUALA_LUMPUR_TIMEZONE = "Asia/Kuala_Lumpur";

const KUALA_LUMPUR_UTC_OFFSET_HOURS = 8;

export interface KualaLumpurDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const kualaLumpurFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: KUALA_LUMPUR_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function parsePart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): number {
  const part = parts.find((item) => item.type === type);
  return Number(part?.value ?? "0");
}

export function getKualaLumpurDateParts(value: Date): KualaLumpurDateParts {
  const parts = kualaLumpurFormatter.formatToParts(value);

  return {
    year: parsePart(parts, "year"),
    month: parsePart(parts, "month"),
    day: parsePart(parts, "day"),
    hour: parsePart(parts, "hour"),
    minute: parsePart(parts, "minute"),
    second: parsePart(parts, "second"),
  };
}

export function getKualaLumpurClock(value: Date): { hour: number; minute: number } {
  const parts = getKualaLumpurDateParts(value);
  return { hour: parts.hour, minute: parts.minute };
}

export function getKualaLumpurYear(value: Date): number {
  return getKualaLumpurDateParts(value).year;
}

export function toKualaLumpurMidnightUtc(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day, -KUALA_LUMPUR_UTC_OFFSET_HOURS, 0, 0, 0));
}

export function getKualaLumpurDateKey(value: Date): string {
  const parts = getKualaLumpurDateParts(value);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function getKualaLumpurTimeKey(value: Date): string {
  const parts = getKualaLumpurDateParts(value);
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}
