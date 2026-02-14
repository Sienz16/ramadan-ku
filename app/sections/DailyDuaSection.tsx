"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dailyDuas } from "../data/duas";

export default function DailyDuaSection() {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const today = new Date();
    return (today.getDate() - 1) % dailyDuas.length;
  });

  const dua = dailyDuas[currentIndex];

  const nextDua = () => {
    setCurrentIndex((prev) => (prev + 1) % dailyDuas.length);
  };

  const prevDua = () => {
    setCurrentIndex((prev) => (prev - 1 + dailyDuas.length) % dailyDuas.length);
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
            Doa Harian
          </h2>
          <p className="text-[#FFF8E1]/50 text-sm mb-2">Daily Dua</p>
          <p className="text-[#FFF8E1]/70" dir="rtl">
            الدعاء اليومي
          </p>
        </div>

        {/* Dua Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dua.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-[#004D40]/60 to-[#004D40]/30 border border-[#FFB300]/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,179,0,0.08)]"
          >
            {/* Arabic */}
            <div className="text-center mb-6">
              <p
                className="text-2xl md:text-3xl text-[#FFF8E1] leading-relaxed font-[family-name:var(--font-amiri)]"
                dir="rtl"
              >
                {dua.arabic}
              </p>
            </div>

            {/* Divider */}
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent mx-auto my-6" />

            {/* Transliteration */}
            <div className="mb-4">
              <p className="text-sm text-[#FFD54F] mb-2 uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                Sebutan
              </p>
              <p className="text-xs text-[#FFF8E1]/40 mb-1">Transliteration</p>
              <p className="text-lg text-[#FFD54F] italic">
                {dua.transliteration}
              </p>
            </div>

            {/* Translation */}
            <div className="mb-4">
              <p className="text-sm text-[#FFD54F] mb-2 uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                Terjemahan
              </p>
              <p className="text-xs text-[#FFF8E1]/40 mb-1">Translation</p>
              <p className="text-lg text-[#FFF8E1] font-[family-name:var(--font-poppins)]">{dua.translation}</p>
            </div>

            {/* Reference */}
            {dua.reference && (
              <p className="text-sm text-[#FFB300] text-right font-[family-name:var(--font-poppins)]">
                — {dua.reference}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={prevDua}
            className="px-6 py-3 rounded-full border border-[#FFB300]/50 text-[#FFB300] hover:bg-[#FFB300]/10 transition-colors font-[family-name:var(--font-poppins)]"
          >
            Sebelumnya
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nextDua}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFB300] to-[#FFA000] text-[#004D40] font-semibold hover:shadow-[0_0_20px_rgba(255,179,0,0.4)] transition-shadow font-[family-name:var(--font-poppins)]"
          >
            Doa Seterusnya
          </motion.button>
        </div>

        {/* Dua Counter */}
        <p className="text-center text-[#FFF8E1]/50 text-sm mt-4 font-[family-name:var(--font-poppins)]">
          Doa {currentIndex + 1} daripada {dailyDuas.length}
        </p>
      </motion.div>
    </section>
  );
}
