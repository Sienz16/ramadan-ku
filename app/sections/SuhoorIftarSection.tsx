"use client";

import { motion } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";
import { usePrayerTimes } from "../hooks/usePrayerTimes";

interface SuhoorIftarSectionProps {
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  } | null;
}

export default function SuhoorIftarSection({ location }: SuhoorIftarSectionProps) {
  const { isRamadan } = useCountdown();
  const { prayers, loading } = usePrayerTimes(
    location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          state: location.state,
        }
      : null
  );

  // Get Fajr time for Sahur end, Maghrib time for Berbuka
  const fajrTime = prayers.find((p) => p.name === "Fajr")?.time12h;
  const maghribTime = prayers.find((p) => p.name === "Maghrib")?.time12h;

  if (!location) {
    return null;
  }

  if (!isRamadan) {
    return (
      <section className="relative py-20 px-4 batik-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-4">
            Sahur & Berbuka
          </h2>
          <p className="text-[#FFF8E1]/70 mb-2">Suhoor & Iftar</p>
          <p className="text-[#FFF8E1]/50 font-[family-name:var(--font-poppins)]">
            Waktu sah berpuasa akan dipaparkan apabila tiba bulan Ramadan
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="relative py-20 px-4 batik-pattern">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
            Sahur & Berbuka Puasa
          </h2>
          <p className="text-[#FFF8E1]/50 text-sm mb-2">Suhoor & Iftar</p>
          <p className="text-[#FFF8E1]/70" dir="rtl">
            السحور والإفطار
          </p>
        </div>

        {loading ? (
          <p className="text-center text-[#FFF8E1]/50">
            Memuatkan waktu...
          </p>
        ) : (
          /* Cards Layout */
          <div className="grid md:grid-cols-2 gap-8">
            {/* Sahur Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#004D40]/40 to-[#004D40]/20 border border-[#FFB300]/30 rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                <svg viewBox="0 0 100 100" fill="#FFB300">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-[#FFD54F] text-sm uppercase tracking-wider mb-2 font-[family-name:var(--font-poppins)]">
                  Tamat Sahur
                </p>
                <p className="text-[#FFF8E1]/50 text-xs mb-4">Suhoor Ends</p>

                <h3 className="text-3xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
                  Sahur
                </h3>
                <p className="text-4xl font-bold text-[#FFF8E1] mb-4">
                  {fajrTime || "5:50 AM"}
                </p>

                <p className="text-[#FFF8E1]/70 text-sm" dir="rtl">السحور</p>

                <div className="mt-4 pt-4 border-t border-[#FFB300]/20">
                  <p className="text-[#FFF8E1]/60 text-sm italic font-[family-name:var(--font-poppins)]">
                    "Bersahurlah kalian, sesungguhnya dalam sahur itu ada keberkatan."
                  </p>
                  <p className="text-[#FFF8E1]/40 text-xs mt-1">Hadis Riwayat Bukhari & Muslim</p>
                </div>
              </div>
            </motion.div>

            {/* Berbuka Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#FFB300]/20 to-[#FFA000]/10 border border-[#FFB300]/50 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_40px_rgba(255,179,0,0.15)]"
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                <svg viewBox="0 0 100 100" fill="#FFB300">
                  <circle cx="50" cy="50" r="40" />
                </svg>
              </div>

              {/* Glowing indicator */}
              <motion.div
                className="absolute top-4 right-4 w-3 h-3 bg-[#FFB300] rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative z-10">
                <p className="text-[#FFD54F] text-sm uppercase tracking-wider mb-2 font-[family-name:var(--font-poppins)]">
                  Masa Berbuka
                </p>
                <p className="text-[#FFF8E1]/50 text-xs mb-4">Iftar Time</p>

                <h3 className="text-3xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
                  Berbuka Puasa
                </h3>
                <p className="text-4xl font-bold text-[#FFF8E1] mb-4">
                  {maghribTime || "7:20 PM"}
                </p>

                <p className="text-[#FFF8E1]/70 text-sm" dir="rtl">الإفطار</p>

                <div className="mt-4 pt-4 border-t border-[#FFB300]/30">
                  <p className="text-[#FFF8E1]/60 text-sm italic font-[family-name:var(--font-poppins)]">
                    "Orang yang berpuasa ada dua kegembiraan: gembira berbuka dan gembira bertemu Tuhannya."
                  </p>
                  <p className="text-[#FFF8E1]/40 text-xs mt-1">Hadis Riwayat Bukhari & Muslim</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
