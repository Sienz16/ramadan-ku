export interface BasicLocation {
  city: string;
  state?: string;
  latitude: number;
  longitude: number;
  zone: string;
}

export interface CorePrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

const hijriMonthNames: Record<number, string> = {
  1: "Muharram",
  2: "Safar",
  3: "Rabiulawal",
  4: "Rabiulakhir",
  5: "Jamadilawal",
  6: "Jamadilakhir",
  7: "Rejab",
  8: "Sya'ban",
  9: "Ramadan",
  10: "Syawal",
  11: "Zulkaedah",
  12: "Zulhijjah",
};

function toHourMinute(value: string): string {
  const [hour = "00", minute = "00"] = value.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
}

export function mapJakimTimingsToCorePrayers(timings: {
  fajr: string;
  syuruk: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}): CorePrayerTimes {
  return {
    Fajr: toHourMinute(timings.fajr),
    Sunrise: toHourMinute(timings.syuruk),
    Dhuhr: toHourMinute(timings.dhuhr),
    Asr: toHourMinute(timings.asr),
    Maghrib: toHourMinute(timings.maghrib),
    Isha: toHourMinute(timings.isha),
  };
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number
): number {
  const earthRadiusKm = 6371;
  const dLat = toRad(latitudeB - latitudeA);
  const dLon = toRad(longitudeB - longitudeA);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(latitudeA)) * Math.cos(toRad(latitudeB)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function findNearestLocation(
  latitude: number,
  longitude: number,
  locations: BasicLocation[]
): BasicLocation | null {
  if (locations.length === 0) {
    return null;
  }

  let nearest = locations[0];
  let nearestDistance = haversineDistanceKm(
    latitude,
    longitude,
    nearest.latitude,
    nearest.longitude
  );

  for (let index = 1; index < locations.length; index += 1) {
    const candidate = locations[index];
    const distance = haversineDistanceKm(
      latitude,
      longitude,
      candidate.latitude,
      candidate.longitude
    );

    if (distance < nearestDistance) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest;
}

export function resolveZone(
  location: { latitude: number; longitude: number; zone?: string },
  locations: BasicLocation[]
): string | null {
  if (location.zone) {
    return location.zone;
  }

  return findNearestLocation(location.latitude, location.longitude, locations)?.zone ?? null;
}

export function formatHijriDateFromJakim(hijri: string): string {
  const [yearStr, monthStr, dayStr] = hijri.split("-");
  const month = Number(monthStr);
  const day = Number(dayStr);
  const monthName = hijriMonthNames[month] ?? monthStr;

  return `${day} ${monthName} ${yearStr}`;
}

export function formatFetchMeta(input: {
  source: string;
  zone: string;
  fetchedAt: Date;
  locale?: string;
  timeZone?: string;
}): string {
  const formattedTime = new Intl.DateTimeFormat(input.locale ?? "ms-MY", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: input.timeZone ?? "Asia/Kuala_Lumpur",
  }).format(input.fetchedAt);

  return `Sumber: ${input.source} | Zon: ${input.zone} | Dikemas kini: ${formattedTime}`;
}
