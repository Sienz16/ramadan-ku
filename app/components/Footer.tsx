"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative py-12 px-4 border-t border-[#FFB300]/20">
      {/* Decorative Pattern */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        {/* Arabic Basmala */}
        <p
          className="text-xl text-[#FFB300] mb-4 font-[family-name:var(--font-amiri)]"
          dir="rtl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* Malay Message */}
        <p className="text-[#FFF8E1]/70 mb-2 max-w-lg mx-auto font-[family-name:var(--font-poppins)]">
          Semoga Allah menerima puasa, solat dan amalan baik kita di bulan Ramadan ini.
        </p>
        <p className="text-[#FFF8E1]/40 text-sm mb-6 max-w-lg mx-auto">
          May Allah accept our fasting, prayers, and good deeds this Ramadan.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#FFB300]" />
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#FFB300]"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="currentColor"
            />
          </svg>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#FFB300]" />
        </div>

        {/* Copyright - Bilingual */}
        <p className="text-sm text-[#FFF8E1]/40 font-[family-name:var(--font-poppins)]">
          Dibuat dengan kasih sayang untuk Ummah · Ramadan Ku
        </p>
        <p className="text-xs text-[#FFF8E1]/30 mt-1">
          Made with devotion for the Ummah
        </p>
      </motion.div>
    </footer>
  );
}
