"use client";

import { motion } from "framer-motion";
import { getDailyDua } from "../data/duas";

export default function DailyDuaSection() {
  const dua = getDailyDua();

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
            Doa Harian
          </h2>
          <p className="text-[#FFF8E1]/50 text-sm mb-2">Daily Dua</p>
          <p className="text-[#FFF8E1]/70" dir="rtl">
            الدعاء اليومي
          </p>
        </div>

        {/* Dua Card - Full Width for larger screens */}
        <div className="bg-gradient-to-br from-[#004D40]/60 to-[#004D40]/30 border border-[#FFB300]/30 rounded-2xl p-8 lg:p-12 shadow-[0_0_40px_rgba(255,179,0,0.08)]"
        >
            {/* Grid layout for larger screens */}
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left - Arabic */}
              <div className="flex flex-col">
                <p className="text-xs text-[#FFB300]/70 uppercase tracking-wider mb-4 font-[family-name:var(--font-poppins)]">
                  Doa / Dua
                </p>
                <p
                  className="text-2xl md:text-3xl lg:text-4xl text-[#FFF8E1] leading-relaxed font-[family-name:var(--font-amiri)] text-center lg:text-right"
                  dir="rtl"
                >
                  {dua.arabic}
                </p>

                {/* Divider - mobile only */}
                <div className="lg:hidden w-24 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent mx-auto my-6" />
              </div>

              {/* Right - Details */}
              <div className="flex flex-col justify-center">
                {/* Transliteration */}
                <div className="mb-6 p-4 bg-[#FFB300]/5 rounded-xl border border-[#FFB300]/10">
                  <p className="text-sm text-[#FFD54F] mb-1 uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                    Sebutan / Transliteration
                  </p>
                  <p className="text-lg md:text-xl text-[#FFD54F] italic">
                    {dua.transliteration}
                  </p>
                </div>

                {/* Translation */}
                <div className="mb-4">
                  <p className="text-sm text-[#FFD54F] mb-2 uppercase tracking-wider font-[family-name:var(--font-poppins)]">
                    Terjemahan / Translation
                  </p>
                  <p className="text-lg md:text-xl text-[#FFF8E1] font-[family-name:var(--font-poppins)] leading-relaxed">{dua.translation}</p>
                </div>

                {/* Reference */}
                {dua.reference && (
                  <p className="text-sm text-[#FFB300]/80 text-right font-[family-name:var(--font-poppins)] mt-4 pt-4 border-t border-[#FFB300]/20">
                    — {dua.reference}
                  </p>
                )}
              </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
}
