"use client";

import { motion } from "framer-motion";
import { getKualaLumpurYear } from "../lib/timezone";

export default function Footer() {
  const currentYear = getKualaLumpurYear(new Date());

  return (
    <footer className="relative py-12 px-6 sm:px-8 lg:px-16 xl:px-24 border-t border-[#FFB300]/20">
      {/* Decorative Pattern */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        {/* Multi-column layout for larger screens */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
          {/* Left - Message */}
          <div className="text-center md:text-left">
            <p className="text-[#FFF8E1]/70 mb-2 font-[family-name:var(--font-poppins)]">
              Semoga Allah menerima puasa, solat dan amalan baik kita di bulan Ramadan ini.
            </p>
            <p className="text-[#FFF8E1]/40 text-sm">
              May Allah accept our fasting, prayers, and good deeds this Ramadan.
            </p>
          </div>

          {/* Center - Basmala and Divider */}
          <div className="text-center">
            <p
              className="text-2xl text-[#FFB300] mb-4 font-[family-name:var(--font-amiri)]"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>

            {/* Decorative Divider */}
            <div className="flex items-center justify-center gap-4">
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
          </div>

          {/* Right - Copyright */}
          <div className="text-center md:text-right">
            <p className="text-sm text-[#FFF8E1]/40 font-[family-name:var(--font-poppins)]">
              Moga bermanfaat untuk amalan kita bersama
            </p>
            <p className="text-xs text-[#FFF8E1]/30 mt-1">
              May this benefit our collective worship
            </p>
            <p className="text-[#FFB300]/60 text-sm mt-3 font-[family-name:var(--font-poppins)]">
              RamadanKu by Sienz | {currentYear}
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
