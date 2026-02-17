"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import { shouldTriggerPrayerNotification } from "../lib/prayerNotification";

interface PrayerNotificationSectionProps {
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
    zone?: string;
  } | null;
}

const ENABLED_STORAGE_KEY = "ramadanku:prayer-notify-enabled";
const LAST_SENT_STORAGE_KEY = "ramadanku:prayer-notify-last-key";

const prayerNamesMs: Record<string, string> = {
  Fajr: "Subuh",
  Dhuhr: "Zohor",
  Asr: "Asar",
  Maghrib: "Maghrib",
  Isha: "Isyak",
};

function canUseBrowserApis(): boolean {
  return typeof window !== "undefined";
}

function readStorage(key: string): string | null {
  if (!canUseBrowserApis()) {
    return null;
  }

  return window.localStorage.getItem(key);
}

export default function PrayerNotificationSection({ location }: PrayerNotificationSectionProps) {
  const { prayers } = usePrayerTimes(
    location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          state: location.state,
          zone: location.zone,
        }
      : null
  );

  const [supported] = useState(() => canUseBrowserApis() && "Notification" in window);
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (!canUseBrowserApis() || !("Notification" in window)) {
      return "default";
    }

    return Notification.permission;
  });
  const [enabled, setEnabled] = useState(() => readStorage(ENABLED_STORAGE_KEY) === "1");
  const [lastSentKey, setLastSentKey] = useState<string | null>(() => readStorage(LAST_SENT_STORAGE_KEY));
  const [feedback, setFeedback] = useState("");

  const canRunNotification = useMemo(
    () => supported && permission === "granted" && enabled,
    [enabled, permission, supported]
  );

  useEffect(() => {
    if (!canRunNotification || prayers.length === 0) {
      return;
    }

    const tick = () => {
      const result = shouldTriggerPrayerNotification({
        enabled,
        permission,
        prayers,
        now: new Date(),
        lastSentKey,
      });

      if (!result) {
        return;
      }

      const prayerLabel = prayerNamesMs[result.prayer.name] ?? result.prayer.name;

      try {
        new Notification("Waktu solat telah masuk", {
          body: `${prayerLabel} (${result.prayer.time12h})`,
          icon: "/icons/icon-192.png",
          tag: result.key,
        });
      } catch {
        return;
      }

      setLastSentKey(result.key);
      window.localStorage.setItem(LAST_SENT_STORAGE_KEY, result.key);
    };

    tick();
    const timer = window.setInterval(tick, 15000);

    return () => {
      window.clearInterval(timer);
    };
  }, [canRunNotification, enabled, lastSentKey, permission, prayers]);

  const handleEnable = async () => {
    if (!supported || typeof window === "undefined") {
      return;
    }

    let nextPermission: NotificationPermission = permission;

    if (nextPermission !== "granted") {
      nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);
    }

    if (nextPermission === "granted") {
      setEnabled(true);
      window.localStorage.setItem(ENABLED_STORAGE_KEY, "1");
      setFeedback("Notifikasi diaktifkan. Anda akan diberitahu bila waktu solat masuk.");
      return;
    }

    setFeedback("Notifikasi tidak dibenarkan. Sila benarkan dari tetapan browser.");
  };

  const handleDisable = () => {
    if (typeof window === "undefined") {
      return;
    }

    setEnabled(false);
    window.localStorage.removeItem(ENABLED_STORAGE_KEY);
    setFeedback("Notifikasi dimatikan.");
  };

  return (
    <section className="relative py-12 px-6 sm:px-8 lg:px-16 xl:px-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="rounded-2xl border border-[#FFB300]/25 bg-gradient-to-br from-[#004D40]/55 to-[#00382f]/35 p-6 md:p-8 text-center">
          <p className="text-[#FFD54F]/75 text-xs uppercase tracking-[0.2em] mb-2">Peringatan Solat</p>
          <h3 className="text-xl md:text-2xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)]">
            Mahu notifikasi bila waktu solat masuk?
          </h3>
          <p className="text-[#FFF8E1]/65 text-sm mt-3">
            Klik aktifkan untuk dapatkan alert &quot;waktu solat telah masuk&quot; terus pada peranti anda.
          </p>

          {!supported ? (
            <p className="text-[#FFF8E1]/60 text-sm mt-5">Browser ini tidak menyokong Notification API.</p>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              {!enabled ? (
                <button
                  type="button"
                  onClick={handleEnable}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFB300] to-[#FFA000] text-[#004D40] font-semibold"
                >
                  Ya, aktifkan notifikasi
                </button>
              ) : (
                <>
                  <span className="px-3 py-1 rounded-full text-xs border border-emerald-300/40 text-emerald-200">
                    Aktif
                  </span>
                  <button
                    type="button"
                    onClick={handleDisable}
                    className="px-4 py-2 rounded-xl border border-[#FFB300]/40 text-[#FFD54F]"
                  >
                    Matikan
                  </button>
                </>
              )}
            </div>
          )}

          {feedback && <p className="text-[#FFD54F] text-sm mt-3">{feedback}</p>}
        </div>
      </motion.div>
    </section>
  );
}
