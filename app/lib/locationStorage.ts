const LOCATION_STORAGE_KEY = "ramadanku:selected-location";

export interface StoredLocation {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zone?: string;
  method: "auto" | "manual";
}

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem" | "removeItem">;

function isStoredLocation(value: unknown): value is StoredLocation {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<StoredLocation>;

  return (
    typeof candidate.latitude === "number"
    && Number.isFinite(candidate.latitude)
    && typeof candidate.longitude === "number"
    && Number.isFinite(candidate.longitude)
    && (candidate.method === "auto" || candidate.method === "manual")
    && (candidate.city === undefined || typeof candidate.city === "string")
    && (candidate.state === undefined || typeof candidate.state === "string")
    && (candidate.zone === undefined || typeof candidate.zone === "string")
  );
}

export function loadStoredLocation(storage: StorageReader | null | undefined): StoredLocation | null {
  if (!storage) {
    return null;
  }

  const rawValue = storage.getItem(LOCATION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue);
    return isStoredLocation(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredLocation(
  storage: StorageWriter | null | undefined,
  location: StoredLocation | null
) {
  if (!storage) {
    return;
  }

  if (!location) {
    storage.removeItem(LOCATION_STORAGE_KEY);
    return;
  }

  storage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
}

export function getBrowserStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export { LOCATION_STORAGE_KEY };
