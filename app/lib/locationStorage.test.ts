import { describe, expect, test } from "bun:test";
import {
  LOCATION_STORAGE_KEY,
  loadStoredLocation,
  saveStoredLocation,
  type StoredLocation,
} from "./locationStorage";

function createStorageMock(initialValue?: string) {
  const store = new Map<string, string>();

  if (initialValue !== undefined) {
    store.set(LOCATION_STORAGE_KEY, initialValue);
  }

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
  };
}

describe("locationStorage", () => {
  test("loads a previously saved location", () => {
    const location: StoredLocation = {
      latitude: 3.139,
      longitude: 101.6869,
      city: "Kuala Lumpur",
      state: "Wilayah Persekutuan",
      zone: "WLY01",
      method: "manual",
    };

    const storage = createStorageMock(JSON.stringify(location));

    expect(loadStoredLocation(storage)).toEqual(location);
  });

  test("returns null for invalid JSON", () => {
    const storage = createStorageMock("not-json");

    expect(loadStoredLocation(storage)).toBeNull();
  });

  test("saves and clears location values", () => {
    const location: StoredLocation = {
      latitude: 5.9804,
      longitude: 116.0735,
      city: "Kota Kinabalu",
      state: "Sabah",
      zone: "SBH07",
      method: "auto",
    };

    const storage = createStorageMock();

    saveStoredLocation(storage, location);
    expect(loadStoredLocation(storage)).toEqual(location);

    saveStoredLocation(storage, null);
    expect(loadStoredLocation(storage)).toBeNull();
  });
});
