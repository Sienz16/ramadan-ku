"use client";

import { motion } from "framer-motion";
import { usePrayerTimes } from "../hooks/usePrayerTimes";
import { formatFetchMeta } from "../lib/prayerTimesSource";

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
    zone?: string;
  } | null;
}

export default function PrayerTimesSection({ location }: PrayerTimesSectionProps) {
  const { prayers, nextPrayer, timeUntilNext, fetchMeta, loading, error } = usePrayerTimes(
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

  if (!location) {
    return (
      <section className="relative py-16 px-6 sm:px-8 lg:px-16 xl:px-24 batik-pattern">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-1">
              Waktu Solat
            </h2>
            <p className="text-[#FFF8E1]/50 text-xs">Prayer Times</p>
          </div>

          <div className="max-w-2xl mx-auto rounded-2xl border border-[#FFB300]/25 bg-[#004D40]/35 px-6 py-8 text-center">
            <p className="text-[#FFF8E1] font-[family-name:var(--font-poppins)]">
              Lokasi belum dipilih. Sila pilih lokasi untuk melihat waktu solat yang tepat.
            </p>
            <p className="text-[#FFF8E1]/55 text-sm mt-2">
              Your location is not configured yet. Please select your area first.
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  // Get next prayer info
  const nextPrayerIndex = prayers.findIndex((p) => p.isNext);

  return (
    <section className="relative py-16 px-6 sm:px-8 lg:px-16 xl:px-24 batik-pattern">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
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

          {fetchMeta && (
            <p className="text-[#FFF8E1]/45 text-[11px] mt-3 font-[family-name:var(--font-poppins)]">
              {formatFetchMeta({
                source: fetchMeta.source,
                zone: fetchMeta.zone,
                fetchedAt: fetchMeta.fetchedAt,
              })}
            </p>
          )}
        </div>

        {/* Two Column Layout for larger screens */}
        {!loading && prayers.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - Next Prayer Hero Card */}
            {nextPrayer && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:sticky lg:top-24 lg:self-start"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFB300] via-[#FFA000] to-[#FF8F00] p-6 lg:p-8 shadow-[0_8px_32px_rgba(255,179,0,0.3)] h-full">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      {/* Label */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="px-4 py-1.5 bg-[#004D40]/20 rounded-full text-[#004D40] text-sm font-semibold">
                          Seterusnya / Next
                        </span>
                        <motion.div
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-3 h-3 bg-[#004D40] rounded-full"
                        />
                      </div>

                      {/* Prayer Name & Icon */}
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-5xl lg:text-6xl">{prayerIcons[nextPrayer.name]}</span>
                        <div>
                          <h3 className="text-3xl lg:text-4xl font-bold text-[#004D40] font-[family-name:var(--font-poppins)]">
                            {prayerNamesMs[nextPrayer.name]}
                          </h3>
                          <p className="text-[#004D40]/70 text-base">{nextPrayer.name}</p>
                          <p className="text-[#004D40]/60 text-sm mt-1" dir="rtl">{nextPrayer.arabicName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Countdown */}
                    <div className="mt-6 pt-6 border-t border-[#004D40]/20">
                      <p className="text-[#004D40]/70 text-sm mb-2">Masa lagi / Time remaining:</p>
                      <p className="text-4xl lg:text-5xl font-bold text-[#004D40] font-[family-name:var(--cinzel)]">
                        {timeUntilNext}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[#004D40]/60 text-sm">Waktu Solat / Prayer Time</span>
                      <span className="text-2xl font-bold text-[#004D40] font-[family-name:var(--font-cinzel)]">
                        {nextPrayer.time12h}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Right Column - All Prayers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              {prayers.map((prayer, index) => {
                const isNext = prayer.isNext;
                const isPast = !isNext && index < (nextPrayerIndex ?? -1);
                const isCurrent = prayer.isCurrent;

                return (
                  <motion.div
                    key={prayer.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isNext
                        ? "bg-[#FFB300]/15 border-2 border-[#FFB300]/50 shadow-[0_0_20px_rgba(255,179,0,0.15)]"
                        : isPast
                        ? "opacity-40 bg-[#004D40]/20"
                        : isCurrent
                        ? "bg-[#004D40]/60 border-2 border-[#FFB300]/30"
                        : "bg-[#004D40]/30 border border-[#FFB300]/10 hover:border-[#FFB300]/30"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        isNext
                          ? "bg-[#FFB300] text-[#004D40] shadow-lg"
                          : "bg-[#FFB300]/10 text-[#FFB300]"
                      }`}
                    >
                      {prayerIcons[prayer.name]}
                    </div>

                    {/* Prayer Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`font-semibold font-[family-name:var(--font-poppins)] text-lg ${
                            isNext ? "text-[#FFB300]" : "text-[#FFF8E1]"
                          }`}
                        >
                          {prayerNamesMs[prayer.name]}
                        </span>
                        {isNext && (
                          <span className="px-2 py-0.5 bg-[#FFB300] text-[#004D40] text-[10px] rounded-full font-bold">
                            NEXT
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 bg-[#004D40] text-[#FFB300] text-[10px] rounded-full font-bold border border-[#FFB300]/30">
                            NOW
                          </span>
                        )}
                      </div>
                      <span className="text-[#FFF8E1]/40 text-sm">{prayer.name}</span>
                    </div>

                    {/* Time */}
                    <div className="text-right">
                      <span
                        className={`text-xl font-bold font-[family-name:var(--font-cinzel)] ${
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
          </div>
        )}

        {/* API Attribution */}
        <p className="text-center text-[#FFF8E1]/25 text-[10px] mt-6 font-[family-name:var(--font-poppins)]">
          Waktu solat rasmi dari JAKIM API
        </p>
      </motion.div>
    </section>
  );
}
