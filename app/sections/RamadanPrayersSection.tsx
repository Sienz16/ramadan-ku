"use client";

import { motion } from "framer-motion";
import { ramadanPrayers } from "../data/ramadanPrayers";

export default function RamadanPrayersSection() {
  const displayPrayers = [
    ramadanPrayers[0],
    ramadanPrayers[1],
    ramadanPrayers[3],
    ramadanPrayers[2],
  ].filter((item) => item !== undefined);

  return (
    <section className="relative py-20 px-6 sm:px-8 lg:px-16 xl:px-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
            Niat & Doa Ramadan
          </h2>
          <p className="text-[#FFF8E1]/50 text-sm mb-2">Niat Puasa, Tarawih, dan Doa Berbuka</p>
          <p className="text-[#FFF8E1]/70" dir="rtl">
            نية الصيام والتراويح ودعاء الإفطار
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
          {displayPrayers.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#FFB300]/25 bg-gradient-to-br from-[#004D40]/65 to-[#00382f]/45 p-6"
            >
              <h3 className="text-lg md:text-xl font-semibold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-4">
                {item.title}
              </h3>

              <p
                className="text-2xl text-[#FFF8E1] leading-[1.8] font-[family-name:var(--font-amiri)] text-right mb-4"
                dir="rtl"
              >
                {item.arabic}
              </p>

              <p className="text-[#FFD54F] italic text-base mb-3">{item.transliteration}</p>
              <p className="text-[#FFF8E1]/85 text-base leading-relaxed">{item.translation}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
