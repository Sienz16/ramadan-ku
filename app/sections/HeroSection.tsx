"use client";

import { motion } from "framer-motion";
import CrescentMoon from "../components/CrescentMoon";
import { useCountdown } from "../hooks/useCountdown";

interface HeroSectionProps {
  location?: {
    city?: string;
    state?: string;
  } | null;
}

function CountdownUnit({ value, label, labelEn }: { value: number; label: string; labelEn: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-6xl font-bold text-[#FFB300] font-[family-name:var(--font-cinzel)]"
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <span className="text-sm md:text-base text-[#FFF8E1]/70 mt-1">
        {label}
      </span>
      <span className="text-xs text-[#FFD54F]/50 uppercase tracking-wider">
        {labelEn}
      </span>
    </div>
  );
}

export default function HeroSection({ location }: HeroSectionProps) {
  const { days, hours, minutes, seconds, isRamadan, daysUntilRamadan, daysInRamadan, hijriDate, loading } = useCountdown();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 batik-pattern">
      {/* Decorative Songket Border Top */}
      <div className="absolute top-0 left-0 right-0 songket-border" />

      {/* Malaysian Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-4 text-center"
      >
        <p className="text-lg text-[#FFD54F] font-[family-name:var(--font-poppins)] mb-2">
          Selamat Menyambut Ramadan
        </p>
        {location?.city && (
          <p className="text-sm text-[#FFF8E1]/50">
            Lokasi: {location.city}{location.state ? `, ${location.state}` : ""}
          </p>
        )}
      </motion.div>

      {/* Arabic Calligraphy */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-8"
      >
        <h1
          className="text-5xl md:text-7xl text-[#FFB300] font-bold text-center font-[family-name:var(--font-amiri)]"
          dir="rtl"
        >
          رمضان كريم
        </h1>
        <p className="text-xl md:text-2xl text-[#FFD54F] text-center mt-4 font-[family-name:var(--font-poppins)]">
          Ramadan Al-Mubarak
        </p>
      </motion.div>

      {/* Crescent Moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mb-12"
      >
        <CrescentMoon />
      </motion.div>

      {/* Hijri Date Display */}
      {hijriDate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-6 text-center"
        >
          <p className="text-[#FFD54F] font-[family-name:var(--font-poppins)]">
            {hijriDate}
          </p>
        </motion.div>
      )}

      {/* Status Message - Malay Primary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mb-8"
      >
        {loading ? (
          <p className="text-[#FFF8E1]/70">Memuatkan maklumat Ramadan...</p>
        ) : isRamadan ? (
          <>
            <p className="text-2xl md:text-3xl text-[#FFF8E1] font-[family-name:var(--font-poppins)]">
              Hari ke-{daysInRamadan} Berpuasa
            </p>
            <p className="text-[#FFF8E1]/70 mt-2 text-sm">
              Day {daysInRamadan} of Ramadan · {days} hari menuju Syawal
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl md:text-3xl text-[#FFF8E1] font-[family-name:var(--font-poppins)]">
              {daysUntilRamadan} Hari Lagi Menuju Ramadan
            </p>
            <p className="text-[#FFF8E1]/70 mt-2 text-sm">
              {daysUntilRamadan} days until Ramadan
            </p>
            <p className="text-[#FFD54F] mt-2 text-sm italic font-[family-name:var(--font-poppins)]">
              "Semoga kita dirahmati untuk berjumpa Ramadan"
            </p>
          </>
        )}
      </motion.div>

      {/* Countdown Timer - Bilingual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="flex gap-6 md:gap-12"
      >
        <CountdownUnit value={days} label="Hari" labelEn="Days" />
        <CountdownUnit value={hours} label="Jam" labelEn="Hours" />
        <CountdownUnit value={minutes} label="Minit" labelEn="Minutes" />
        <CountdownUnit value={seconds} label="Saat" labelEn="Seconds" />
      </motion.div>

      {/* Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="w-32 h-px bg-gradient-to-r from-transparent via-[#FFB300] to-transparent mt-16"
      />

      {/* Malay Proverb */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="text-center text-[#FFD54F]/60 text-sm mt-6 max-w-md font-[family-name:var(--font-poppins)]"
      >
        "Kalau tidak dipecahkan ruyung, manakan dapat sagunya"
        <br />
        <span className="text-xs text-[#FFF8E1]/40">
          Usaha tangga kejayaan
        </span>
      </motion.p>
    </section>
  );
}
