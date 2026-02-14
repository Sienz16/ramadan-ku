"use client";

import { useState, useEffect, useCallback } from "react";

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  method: "auto" | "manual";
}

// Malaysian states with approximate coordinates
export const malaysianLocations = [
  { city: "Kuala Lumpur", state: "WP Kuala Lumpur", latitude: 3.139, longitude: 101.6869 },
  { city: "Putrajaya", state: "WP Putrajaya", latitude: 2.9264, longitude: 101.6964 },
  { city: "Johor Bahru", state: "Johor", latitude: 1.4927, longitude: 103.7414 },
  { city: "Kota Bharu", state: "Kelantan", latitude: 6.1254, longitude: 102.2383 },
  { city: "Melaka", state: "Melaka", latitude: 2.1896, longitude: 102.2501 },
  { city: "Seremban", state: "Negeri Sembilan", latitude: 2.7259, longitude: 101.9378 },
  { city: "Kuantan", state: "Pahang", latitude: 3.8077, longitude: 103.326 },
  { city: "George Town", state: "Pulau Pinang", latitude: 5.4141, longitude: 100.3288 },
  { city: "Ipoh", state: "Perak", latitude: 4.5975, longitude: 101.0901 },
  { city: "Kangar", state: "Perlis", latitude: 6.4414, longitude: 100.1983 },
  { city: "Kota Kinabalu", state: "Sabah", latitude: 5.9804, longitude: 116.0735 },
  { city: "Kuching", state: "Sarawak", latitude: 1.5535, longitude: 110.3593 },
  { city: "Shah Alam", state: "Selangor", latitude: 3.0738, longitude: 101.5183 },
  { city: "Kuala Terengganu", state: "Terengganu", latitude: 5.3302, longitude: 103.1408 },
  { city: "Alor Setar", state: "Kedah", latitude: 6.1248, longitude: 100.3678 },
];

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
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
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
