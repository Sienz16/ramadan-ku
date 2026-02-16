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
    zone?: string;
  } | null;
}

export default function SuhoorIftarSection({ location }: SuhoorIftarSectionProps) {
  const { isRamadan } = useCountdown(location?.zone);
  const { prayers, loading } = usePrayerTimes(
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

  // Get Fajr time for Sahur end, Maghrib time for Berbuka
  const fajrTime = prayers.find((p) => p.name === "Fajr")?.time12h;
  const maghribTime = prayers.find((p) => p.name === "Maghrib")?.time12h;

  if (!location) {
    return (
      <section className="relative py-20 px-6 sm:px-8 lg:px-16 xl:px-24 batik-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-4">
            Sahur & Berbuka
          </h2>
          <p className="text-[#FFF8E1]/70 mb-2">Suhoor & Iftar</p>
          <p className="text-[#FFF8E1]/55 font-[family-name:var(--font-poppins)]">
            Lokasi belum ditetapkan. Pilih lokasi supaya waktu sahur dan berbuka dapat dipaparkan.
          </p>
          <p className="text-[#FFF8E1]/40 text-sm mt-2">
            Your location is not configured yet. Please pick a location first.
          </p>
        </motion.div>
      </section>
    );
  }

  if (!isRamadan) {
    return (
      <section className="relative py-20 px-6 sm:px-8 lg:px-16 xl:px-24 batik-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
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
    <section className="relative py-20 px-6 sm:px-8 lg:px-16 xl:px-24 batik-pattern">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
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
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Sahur Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#004D40]/40 to-[#004D40]/20 border border-[#FFB300]/30 rounded-3xl p-10 lg:p-12 relative overflow-hidden"
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                <svg viewBox="0 0 100 100" fill="#FFB300">
                  <path d="M50 0 L100 50 L50 100 L0 50 Z" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB300]/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#FFD54F] text-sm uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                      Tamat Sahur
                    </p>
                    <p className="text-[#FFF8E1]/50 text-xs">Suhoor Ends</p>
                  </div>
                  <span className="text-4xl">🌙</span>
                </div>

                <div className="flex items-end gap-4 mb-6">
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)]">
                      {fajrTime || "5:50 AM"}
                    </h3>
                    <p className="text-[#FFF8E1]/70 text-lg mt-1" dir="rtl">السحور</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#FFB300]/20">
                  <p className="text-[#FFF8E1]/60 text-base italic font-[family-name:var(--font-poppins)] leading-relaxed">
                    &quot;Bersahurlah kalian, sesungguhnya dalam sahur itu ada keberkatan.&quot;
                  </p>
                  <p className="text-[#FFB300]/60 text-sm mt-2">Hadis Riwayat Bukhari & Muslim</p>
                </div>
              </div>
            </motion.div>

            {/* Berbuka Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#FFB300]/20 to-[#FFA000]/10 border border-[#FFB300]/50 rounded-3xl p-10 lg:p-12 relative overflow-hidden shadow-[0_0_40px_rgba(255,179,0,0.15)]"
            >
              {/* Decorative Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                <svg viewBox="0 0 100 100" fill="#FFB300">
                  <circle cx="50" cy="50" r="40" />
                </svg>
              </div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#FFB300]/10 rounded-full blur-3xl" />

              {/* Glowing indicator */}
              <motion.div
                className="absolute top-6 right-6 w-4 h-4 bg-[#FFB300] rounded-full shadow-[0_0_20px_rgba(255,179,0,0.8)]"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#FFD54F] text-sm uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                      Masa Berbuka
                    </p>
                    <p className="text-[#FFF8E1]/50 text-xs">Iftar Time</p>
                  </div>
                  <span className="text-4xl">🌅</span>
                </div>

                <div className="flex items-end gap-4 mb-6">
                  <div>
                    <h3 className="text-4xl lg:text-5xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)]">
                      {maghribTime || "7:20 PM"}
                    </h3>
                    <p className="text-[#FFF8E1]/70 text-lg mt-1" dir="rtl">الإفطار</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-[#FFB300]/30">
                  <p className="text-[#FFF8E1]/60 text-base italic font-[family-name:var(--font-poppins)] leading-relaxed">
                    &quot;Orang yang berpuasa ada dua kegembiraan: gembira berbuka dan gembira bertemu Tuhannya.&quot;
                  </p>
                  <p className="text-[#FFB300]/60 text-sm mt-2">Hadis Riwayat Bukhari & Muslim</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
