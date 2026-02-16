"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getInstallAvailability, isIosDevice } from "../lib/installPrompt";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallAppSection() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const standaloneFromNavigator =
      typeof navigator !== "undefined" &&
      "standalone" in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

    const standaloneFromDisplayMode = window.matchMedia("(display-mode: standalone)").matches;
    return standaloneFromNavigator || standaloneFromDisplayMode;
  });
  const [isIos] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return isIosDevice(window.navigator.userAgent);
  });
  const [feedback, setFeedback] = useState<string>("");

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const availability = useMemo(
    () =>
      getInstallAvailability({
        hasDeferredPrompt: Boolean(deferredPrompt),
        isIos,
        isStandalone,
      }),
    [deferredPrompt, isIos, isStandalone]
  );

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setFeedback("Aplikasi berjaya ditambah ke skrin utama.");
    } else {
      setFeedback("Pemasangan dibatalkan. Anda boleh cuba lagi bila-bila masa.");
    }

    setDeferredPrompt(null);
  };

  if (availability === "installed") {
    return null;
  }

  return (
    <section className="relative py-16 px-6 sm:px-8 lg:px-16 xl:px-24 batik-pattern">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <div className="rounded-3xl border border-[#FFB300]/30 bg-gradient-to-br from-[#004D40]/65 to-[#00382f]/40 p-8 lg:p-10 text-center shadow-[0_12px_36px_rgba(255,179,0,0.12)]">
          <p className="text-[#FFD54F]/75 text-xs uppercase tracking-[0.25em] font-[family-name:var(--font-poppins)] mb-3">
            Pasang Aplikasi
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-3">
            RamadanKu ke Skrin Utama
          </h3>
          <p className="text-[#FFF8E1]/70 mb-6 max-w-2xl mx-auto">
            Install RamadanKu sebagai app untuk akses pantas waktu solat, sahur, berbuka, dan bacaan harian.
          </p>

          {availability === "prompt" && (
            <button
              type="button"
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FFB300] to-[#FFA000] text-[#004D40] font-semibold rounded-xl hover:brightness-105 transition"
            >
              <span>Muat Turun App</span>
              <span aria-hidden="true">⬇</span>
            </button>
          )}

          {availability === "ios-manual" && (
            <p className="text-[#FFF8E1]/75 text-sm md:text-base leading-relaxed">
              Untuk iPhone/iPad: buka menu <span className="text-[#FFD54F]">Share</span>, kemudian pilih
              <span className="text-[#FFD54F]"> Add to Home Screen</span>.
            </p>
          )}

          {availability === "unsupported" && (
            <p className="text-[#FFF8E1]/65 text-sm md:text-base leading-relaxed">
              Pemasangan app tidak tersedia pada pelayar ini. Cuba Chrome/Edge/Safari versi terkini.
            </p>
          )}

          {feedback && <p className="text-[#FFD54F] text-sm mt-4">{feedback}</p>}
        </div>
      </motion.div>
    </section>
  );
}
