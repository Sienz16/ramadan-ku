"use client";

import { motion } from "framer-motion";
import CrescentMoon from "../components/CrescentMoon";
import { useCountdown } from "../hooks/useCountdown";

interface HeroSectionProps {
  location?: {
    city?: string;
    state?: string;
    zone?: string;
  } | null;
}

export default function HeroSection({ location }: HeroSectionProps) {
  const { days, hours, minutes, seconds, isRamadan, daysUntilRamadan, daysInRamadan, hijriDate, loading } = useCountdown(location?.zone);

  const timeUnits = [
    { value: days, label: "Hari", labelEn: "Days" },
    { value: hours, label: "Jam", labelEn: "Hours" },
    { value: minutes, label: "Minit", labelEn: "Minutes" },
    { value: seconds, label: "Saat", labelEn: "Seconds" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2a24] via-[#0d3b34] to-[#0d2a24]" />

      {/* Animated stars/particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#FFB300] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 lg:px-12 py-12 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto w-full">

          {/* Top Row - Arabic Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1
              className="text-6xl md:text-8xl lg:text-9xl text-[#FFB300] font-bold font-[family-name:var(--font-amiri)] leading-none"
              dir="rtl"
            >
              رمضان كريم
            </h1>
            <div className="mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#FFB300]" />
              <p className="text-[#FFD54F] text-sm md:text-base tracking-widest uppercase">
                {isRamadan ? "Selamat Menunaikan Ibadah Puasa" : "Bersedia Menyambut Ramadan"}
              </p>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#FFB300]" />
            </div>
          </motion.div>

          {/* Main Display Grid */}
          <div className="grid lg:grid-cols-3 gap-6 items-stretch mt-8">

            {/* Left - The Big Number */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <div className="relative">
                {/* Decorative ring */}
                <div className="absolute -inset-8 border border-[#FFB300]/10 rounded-full" />
                <div className="absolute -inset-16 border border-[#FFB300]/5 rounded-full" />

                <div className="relative text-center lg:text-left p-6">
                  <p className="text-[#FFB300]/60 text-xs uppercase tracking-[0.3em] mb-3 font-[family-name:var(--font-poppins)]">
                    {isRamadan ? "Hari Berpuasa" : "Menghitung Hari"}
                  </p>
                  {loading ? (
                    <p className="text-[#FFF8E1]/70 text-2xl">Memuatkan...</p>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-center lg:justify-start gap-3">
                        <span className="text-8xl md:text-9xl lg:text-[11rem] font-bold text-[#FFF8E1] font-[family-name:var(--font-cinzel)] leading-none drop-shadow-[0_0_30px_rgba(255,179,0,0.3)]">
                          {isRamadan ? daysInRamadan : daysUntilRamadan}
                        </span>
                        {isRamadan && (
                          <span className="text-5xl md:text-6xl text-[#FFB300]/40 font-[family-name:var(--font-cinzel)]">
                            /30
                          </span>
                        )}
                      </div>
                      <p className="text-[#FFD54F] text-xl mt-4 font-[family-name:var(--font-poppins)] tracking-wide">
                        {isRamadan ? "Hari Berpuasa" : "Hari Lagi Menuju Ramadan"}
                      </p>
                      <p className="text-[#FFF8E1]/30 text-sm mt-1">
                        {isRamadan ? "Days of Fasting" : "Days until Ramadan"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Location */}
              {location?.city && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#004D40]/60 border border-[#FFB300]/20 rounded-full mt-6"
                >
                  <svg className="w-4 h-4 text-[#FFB300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-[#FFF8E1]/70 text-sm font-[family-name:var(--font-poppins)]">{location.city}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Center - Moon Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center justify-center order-first lg:order-none py-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFB300]/20 rounded-full blur-[100px] scale-150" />
                <div className="relative">
                  <CrescentMoon />
                </div>
              </div>
            </motion.div>

            {/* Right - Countdown */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              {/* Hijri Date Display */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-6 pb-2"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#FFB300]/20 via-[#FFB300]/10 to-[#FFB300]/20 border border-[#FFB300]/30 rounded-full"
                >
                  <svg className="w-4 h-4 text-[#FFB300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[#FFD54F] text-sm md:text-base font-[family-name:var(--font-poppins)]">
                    28 Shaaban 1447
                  </span>
                </div>
              </motion.div>

              {/* Section Label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#FFB300]/50" />
                <p className="text-[#FFB300]/60 text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-poppins)] whitespace-nowrap">
                  {isRamadan ? "Masa Menuju Syawal" : "Masa Menuju Ramadan"}
                </p>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#FFB300]/50" />
              </div>

              {/* Countdown Grid - Equal Size */}
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {timeUnits.map((unit, index) => (
                  <motion.div
                    key={unit.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="relative group"
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FFB300] to-[#FFD54F] rounded-2xl opacity-0 group-hover:opacity-50 blur transition duration-500" />

                    <div className="relative bg-gradient-to-b from-[#1a5248] to-[#0d3b34] border border-[#FFB300]/30 rounded-2xl p-3 md:p-4 text-center">
                      <motion.div
                        key={unit.value}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-cinzel)]"
                      >
                        {unit.value.toString().padStart(2, "0")}
                      </motion.div>
                      <p className="text-[#FFF8E1]/50 text-[10px] md:text-xs uppercase tracking-wider mt-1 font-[family-name:var(--font-poppins)]">
                        {unit.label}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              {!loading && isRamadan && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-[#FFF8E1]/40 mb-2">
                    <span>Kemajuan Ramadan</span>
                    <span>{Math.round((daysInRamadan / 30) * 100)}%</span>
                  </div>
                  <div className="h-1.5 bg-[#004D40] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#FFB300] to-[#FFD54F]"
                      initial={{ width: 0 }}
                      animate={{ width: `${(daysInRamadan / 30) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Islamic Quote Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="inline-block max-w-4xl">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FFB300]/50 to-transparent max-w-[100px]" />
                <span className="text-[#FFB300]/50 text-xs uppercase tracking-widest">Hadis</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FFB300]/50 to-transparent max-w-[100px]" />
              </div>

              <p
                className="text-2xl md:text-3xl lg:text-4xl text-[#FFB300] font-[family-name:var(--font-amiri)] mb-3 leading-relaxed"
                dir="rtl"
              >
                مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ
              </p>
              <p className="text-[#FFF8E1]/50 text-sm md:text-base italic font-[family-name:var(--font-poppins)]">
                "Barang siapa berpuasa di bulan Ramadan dengan iman dan mengharap pahala, dosanya yang lalu akan diampuni"
              </p>
              <p className="text-[#FFB300]/40 text-xs mt-2">— Bukhari & Muslim</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
