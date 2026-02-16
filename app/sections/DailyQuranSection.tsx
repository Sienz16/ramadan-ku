"use client";

import { motion } from "framer-motion";
import { dailyVerses } from "../data/quran";

export default function DailyQuranSection() {
  const today = new Date();
  const currentIndex = (today.getDate() - 1) % dailyVerses.length;
  const verse = dailyVerses[currentIndex];

  return (
    <section className="relative py-20 px-6 sm:px-8 lg:px-16 xl:px-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
            Ayat Al-Quran Harian
          </h2>
          <p className="text-[#FFF8E1]/50 text-sm mb-2">Daily Quran Verse</p>
          <p className="text-[#FFF8E1]/70" dir="rtl">
            آية القرآن اليومية
          </p>
        </div>

        {/* Verse Card - Enhanced layout for larger screens */}
        <div
          className="bg-gradient-to-br from-[#004D40]/80 to-[#004D40]/40 border border-[#FFB300]/30 rounded-2xl p-8 lg:p-12 shadow-[0_0_40px_rgba(255,179,0,0.08)]"
        >
            {/* Surah Info Header */}
            <div className="text-center mb-8 pb-6 border-b border-[#FFB300]/20">
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)]">
                  Surah {verse.surah}
                </h3>
                <span className="px-3 py-1 bg-[#FFB300]/10 rounded-full text-[#FFD54F] text-sm font-[family-name:var(--font-poppins)]">
                  Ayat {verse.ayahNumber}
                </span>
              </div>
              <p className="text-[#FFF8E1]/40 text-sm mt-2">
                {verse.surahNumber}:{verse.ayahNumber}
              </p>
            </div>

            {/* Grid layout for content */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Arabic */}
              <div className="flex flex-col justify-center">
                <p className="text-xs text-[#FFB300]/70 uppercase tracking-wider mb-4 font-[family-name:var(--font-poppins)]">
                  Al-Quran
                </p>
                <p
                  className="text-2xl md:text-3xl lg:text-4xl text-[#FFF8E1] leading-[1.8] font-[family-name:var(--font-amiri)] text-center lg:text-right"
                  dir="rtl"
                >
                  {verse.arabic}
                </p>

                {/* Divider - mobile only */}
                <div className="lg:hidden w-24 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent mx-auto my-6" />
              </div>

              {/* Right - Translation */}
              <div className="flex flex-col justify-center p-6 bg-[#FFB300]/5 rounded-xl border border-[#FFB300]/10">
                <p className="text-sm text-[#FFD54F] mb-3 uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                  Terjemahan / Translation
                </p>
                <p className="text-lg md:text-xl text-[#FFF8E1] leading-relaxed font-[family-name:var(--font-poppins)]">
                  {verse.translation}
                </p>
              </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
}
