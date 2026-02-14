"use client";

import { motion } from "framer-motion";
import { usePrayerTimes } from "../hooks/usePrayerTimes";

const prayerNamesMs: Record<string, string> = {
  Fajr: "Subuh",
  Sunrise: "Syuruk",
  Dhuhr: "Zohor",
  Asr: "Asar",
  Maghrib: "Maghrib",
  Isha: "Isyak",
};

const prayerIcons: Record<string, string> = {
  Fajr: "🌅",
  Sunrise: "☀️",
  Dhuhr: "🌤️",
  Asr: "🌇",
  Maghrib: "🌆",
  Isha: "🌙",
};

interface PrayerTimesSectionProps {
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  } | null;
}

export default function PrayerTimesSection({ location }: PrayerTimesSectionProps) {
  const { prayers, nextPrayer, timeUntilNext, loading, error } = usePrayerTimes(
    location
      ? {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          state: location.state,
        }
      : null
  );

  if (!location) {
    return null;
  }

  // Get current prayer (if any) and next prayer info
  const currentPrayerIndex = prayers.findIndex((p) => p.isCurrent);
  const nextPrayerIndex = prayers.findIndex((p) => p.isNext);

  return (
    <section className="relative py-16 px-4 batik-pattern">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-1">
            Waktu Solat
          </h2>
          <p className="text-[#FFF8E1]/50 text-xs">Prayer Times</p>

          {location?.city && (
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#FFB300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[#FFD54F] text-sm font-[family-name:var(--font-poppins)]">
                {location.city}
              </span>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-[#FFB300] border-t-transparent rounded-full"
              />
              <span className="text-[#FFF8E1]/50 text-sm">Memuatkan...</span>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-xs mt-4 bg-red-400/10 px-3 py-1.5 rounded-full inline-block">
              {error}
            </p>
          )}
        </div>

        {/* Next Prayer Hero Card */}
        {!loading && nextPrayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFB300] via-[#FFA000] to-[#FF8F00] p-6 shadow-[0_8px_32px_rgba(255,179,0,0.3)]">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                {/* Label */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-[#004D40]/20 rounded-full text-[#004D40] text-xs font-semibold">
                    Seterusnya
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2.5 h-2.5 bg-[#004D40] rounded-full"
                  />
                </div>

                {/* Prayer Name & Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{prayerIcons[nextPrayer.name]}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-[#004D40] font-[family-name:var(--font-poppins)]">
                      {prayerNamesMs[nextPrayer.name]}
                    </h3>
                    <p className="text-[#004D40]/70 text-sm">{nextPrayer.name}</p>
                  </div>
                </div>

                {/* Countdown */}
                <div className="mt-4 pt-4 border-t border-[#004D40]/20">
                  <p className="text-[#004D40]/70 text-xs mb-1">Masa lagi:</p>
                  <p className="text-3xl font-bold text-[#004D40] font-[family-name:var(--cinzel)]">
                    {timeUntilNext}
                  </p>
                </div>

                {/* Time */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[#004D40]/60 text-xs" dir="rtl">{nextPrayer.arabicName}</span>
                  <span className="text-xl font-bold text-[#004D40] font-[family-name:var(--font-cinzel)]">
                    {nextPrayer.time12h}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* All Prayers Compact List */}
        {!loading && prayers.length > 0 && (
          <div className="space-y-2">
            {prayers.map((prayer, index) => {
              const isNext = prayer.isNext;
              const isPast = !isNext && index < nextPrayerIndex;
              const isCurrent = prayer.isCurrent;

              return (
                <motion.div
                  key={prayer.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                    isNext
                      ? "bg-[#FFB300]/10 border border-[#FFB300]/30"
                      : isPast
                      ? "opacity-40"
                      : isCurrent
                      ? "bg-[#004D40]/60 border border-[#FFB300]/20"
                      : "bg-[#004D40]/30"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                      isNext
                        ? "bg-[#FFB300] text-[#004D40]"
                        : "bg-[#FFB300]/10 text-[#FFB300]"
                    }`}
                  >
                    {prayerIcons[prayer.name]}
                  </div>

                  {/* Prayer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold font-[family-name:var(--font-poppins)] ${
                          isNext ? "text-[#FFB300]" : "text-[#FFF8E1]"
                        }`}
                      >
                        {prayerNamesMs[prayer.name]}
                      </span>
                      {isNext && (
                        <span className="px-1.5 py-0.5 bg-[#FFB300] text-[#004D40] text-[10px] rounded font-bold">
                          NEXT
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 bg-[#004D40] text-[#FFB300] text-[10px] rounded font-bold border border-[#FFB300]/30">
                          NOW
                        </span>
                      )}
                    </div>
                    <span className="text-[#FFF8E1]/40 text-xs">{prayer.name}</span>
                  </div>

                  {/* Time */}
                  <div className="text-right">
                    <span
                      className={`text-lg font-bold font-[family-name:var(--font-cinzel)] ${
                        isNext ? "text-[#FFB300]" : "text-[#FFF8E1]"
                      }`}
                    >
                      {prayer.time12h}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* API Attribution */}
        <p className="text-center text-[#FFF8E1]/25 text-[10px] mt-6 font-[family-name:var(--font-poppins)]">
          Waktu solat dari Aladhan API · Kaedah Muslim World League
        </p>
      </motion.div>
    </section>
  );
}
