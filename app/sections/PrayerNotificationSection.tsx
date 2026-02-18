"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  isPushSupported,
  sendTestPushToCurrentDevice,
  subscribeDeviceToPush,
  unsubscribeDeviceFromPush,
} from "../lib/webPushClient";

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
  const [supported] = useState(() => canUseBrowserApis() && isPushSupported());
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (!canUseBrowserApis() || !("Notification" in window)) {
      return "default";
    }

    return Notification.permission;
  });
  const [enabled, setEnabled] = useState(() => readStorage(ENABLED_STORAGE_KEY) === "1");
  const [feedback, setFeedback] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  const canRunNotification = useMemo(
    () => supported && permission === "granted" && enabled,
    [enabled, permission, supported]
  );

  useEffect(() => {
    if (!supported || !("Notification" in window)) {
      return;
    }

    setPermission(Notification.permission);
  }, [supported]);

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
      try {
        await subscribeDeviceToPush({
          zone: location?.zone,
          city: location?.city,
        });

        setEnabled(true);
        window.localStorage.setItem(ENABLED_STORAGE_KEY, "1");
        setFeedback("Notifikasi latar belakang diaktifkan. Anda akan diberitahu walaupun app ditutup.");
      } catch {
        setFeedback("Gagal aktifkan notifikasi push. Sila cuba lagi.");
      }
      return;
    }

    setFeedback("Notifikasi tidak dibenarkan. Sila benarkan dari tetapan browser.");
  };

  const handleDisable = () => {
    if (typeof window === "undefined") {
      return;
    }

    unsubscribeDeviceFromPush()
      .catch(() => undefined)
      .finally(() => {
        setEnabled(false);
        window.localStorage.removeItem(ENABLED_STORAGE_KEY);
        setFeedback("Notifikasi dimatikan.");
      });
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    try {
      await sendTestPushToCurrentDevice();
      setFeedback("Notifikasi ujian dihantar. Semak notification bar peranti anda.");
    } catch {
      setFeedback("Gagal hantar notifikasi ujian.");
    } finally {
      setSendingTest(false);
    }
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
            Klik aktifkan untuk dapatkan notifikasi push pada notification bar peranti anda walaupun app tidak dibuka.
          </p>

          {!supported ? (
            <p className="text-[#FFF8E1]/60 text-sm mt-5">Peranti/browser ini tidak menyokong Push Notification.</p>
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
                <div className="w-full max-w-xs flex flex-col items-center gap-3 mx-auto">
                  <span className="w-full px-5 py-2 rounded-none md:rounded-full text-sm md:text-xs border border-emerald-300/40 text-emerald-200">
                    Aktif
                  </span>
                  <button
                    type="button"
                    onClick={handleSendTest}
                    disabled={sendingTest || !canRunNotification}
                    className="w-full px-4 py-2 rounded-xl border border-emerald-300/40 text-emerald-200 disabled:opacity-60"
                  >
                    {sendingTest ? "Menghantar..." : "Uji Notifikasi"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDisable}
                    className="w-full px-4 py-2 rounded-xl border border-[#FFB300]/40 text-[#FFD54F]"
                  >
                    Matikan Notifikasi
                  </button>
                </div>
              )}
            </div>
          )}

          {feedback && <p className="text-[#FFD54F] text-sm mt-3">{feedback}</p>}
        </div>
      </motion.div>
    </section>
  );
}
