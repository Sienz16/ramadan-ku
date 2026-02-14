"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyVerses } from "../data/quran";

export default function DailyQuranSection() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = new Date();
    return (today.getDate() - 1) % dailyVerses.length;
  });

  const verse = dailyVerses[currentIndex];

  const nextVerse = () => {
    setCurrentIndex((prev) => (prev + 1) % dailyVerses.length);
  };

  const prevVerse = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + dailyVerses.length) % dailyVerses.length
    );
  };

  return (
    <section className="relative py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
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

        {/* Verse Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={verse.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#004D40]/80 to-[#004D40]/40 border border-[#FFB300]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,179,0,0.08)]"
          >
            {/* Surah Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)]">
                Surah {verse.surah}
              </h3>
              <p className="text-[#FFD54F] text-sm">
                Ayat {verse.ayahNumber}
              </p>
              <p className="text-[#FFF8E1]/40 text-xs">
                {verse.surahNumber}:{verse.ayahNumber}
              </p>
            </div>

            {/* Arabic */}
            <div className="text-center mb-6">
              <p
                className="text-xl md:text-2xl text-[#FFF8E1] leading-relaxed font-[family-name:var(--font-amiri)]"
                dir="rtl"
              >
                {verse.arabic}
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent mx-auto my-6" />

            {/* Translation */}
            <div>
              <p className="text-sm text-[#FFD54F] mb-2 uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                Terjemahan
              </p>
              <p className="text-xs text-[#FFF8E1]/40 mb-1">Translation</p>
              <p className="text-lg text-[#FFF8E1] leading-relaxed font-[family-name:var(--font-poppins)]">
                {verse.translation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevVerse}
            className="px-6 py-3 rounded-full border border-[#FFB300]/50 text-[#FFB300] hover:bg-[#FFB300]/10 transition-colors font-[family-name:var(--font-poppins)]"
          >
            Sebelumnya
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextVerse}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFB300] to-[#FFA000] text-[#004D40] font-semibold hover:shadow-[0_0_20px_rgba(255,179,0,0.4)] transition-shadow font-[family-name:var(--font-poppins)]"
          >
            Ayat Seterusnya
          </motion.button>
        </div>

        {/* Verse Counter */}
        <p className="text-center text-[#FFF8E1]/50 text-sm mt-4 font-[family-name:var(--font-poppins)]">
          Ayat {currentIndex + 1} daripada {dailyVerses.length}
        </p>
      </motion.div>
    </section>
  );
}
