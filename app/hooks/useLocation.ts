"use client";

import { useState, useEffect, useCallback } from "react";
import { findNearestLocation } from "../lib/prayerTimesSource";
import { AUTO_DETECT_LOCATIONS, JAKIM_LOCATIONS } from "../constants/jakimZones";

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  zone?: string;
  method: "auto" | "manual";
}

export const malaysianLocations = JAKIM_LOCATIONS;

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation tidak disokong oleh browser anda");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const nearestLocation = findNearestLocation(latitude, longitude, AUTO_DETECT_LOCATIONS);

        setLocation({
          latitude,
          longitude,
          city: nearestLocation?.city,
          state: nearestLocation?.state,
          zone: nearestLocation?.zone,
          method: "auto",
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = "Tidak dapat mendapatkan lokasi";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Pengguna menolak permintaan lokasi";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Maklumat lokasi tidak tersedia";
            break;
          case err.TIMEOUT:
            errorMessage = "Masa tamat untuk mendapatkan lokasi";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const setManualLocation = useCallback((locationData: typeof malaysianLocations[0]) => {
    setLocation({
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city,
      state: locationData.state,
      zone: locationData.zone,
      method: "manual",
    });
    setError(null);
  }, []);

  useEffect(() => {
    // Try to get location on mount
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    error,
    loading,
    requestLocation,
    setManualLocation,
    malaysianLocations,
  };
}
