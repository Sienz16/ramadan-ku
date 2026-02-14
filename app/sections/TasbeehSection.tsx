"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Dhikr {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningMs: string;
}

const dhikrs: Dhikr[] = [
  {
    id: 1,
    arabic: "سُبْحَانَ اللَّهِ",
    transliteration: "SubhanAllah",
    meaning: "Glory be to Allah",
    meaningMs: "Maha Suci Allah",
  },
  {
    id: 2,
    arabic: "الْحَمْدُ لِلَّهِ",
    transliteration: "Alhamdulillah",
    meaning: "Praise be to Allah",
    meaningMs: "Segala Puji Bagi Allah",
  },
  {
    id: 3,
    arabic: "اللَّهُ أَكْبَرُ",
    transliteration: "Allahu Akbar",
    meaning: "Allah is Greater",
    meaningMs: "Allah Maha Besar",
  },
  {
    id: 4,
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ",
    transliteration: "La ilaha illAllah",
    meaning: "There is no god but Allah",
    meaningMs: "Tiada Tuhan Selain Allah",
  },
];

export default function TasbeehSection() {
  const [selectedDhikr, setSelectedDhikr] = useState<Dhikr>(dhikrs[0]);
  // Track position within current round (1-33)
  const [currentCount, setCurrentCount] = useState(0);
  // Track completed rounds
  const [completedRounds, setCompletedRounds] = useState(0);

  const handleCount = () => {
    if (currentCount === 32) {
      setCurrentCount(33);
      setCompletedRounds((rounds) => rounds + 1);
      return;
    }

    if (currentCount === 33) {
      setCurrentCount(1);
      return;
    }

    setCurrentCount((prev) => prev + 1);
  };

  const reset = () => {
    setCurrentCount(0);
    setCompletedRounds(0);
  };

  // Calculate display values
  const displayCount = currentCount;
  const displayProgress = currentCount === 33
    ? "33 / 33 - Klik untuk seterusnya"
    : `${currentCount} / 33`;

  return (
    <section className="relative py-20 px-4 batik-pattern">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-2xl mx-auto"
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
            Tasbih Digital
          </h2>
          <p className="text-[#FFF8E1]/50 text-sm mb-2">Digital Tasbeeh</p>
          <p className="text-[#FFF8E1]/70" dir="rtl">
            التسبيح الإلكتروني
          </p>
        </div>

        {/* Dhikr Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {dhikrs.map((dhikr) => (
            <motion.button
              key={dhikr.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedDhikr(dhikr);
                reset();
              }}
              className={`px-4 py-2 rounded-full text-sm transition-colors font-[family-name:var(--font-poppins)] ${
                selectedDhikr.id === dhikr.id
                  ? "bg-[#FFB300] text-[#004D40] font-semibold"
                  : "bg-white/5 border border-[#FFB300]/30 text-[#FFF8E1] hover:border-[#FFB300]/50"
              }`}
            >
              {dhikr.transliteration}
            </motion.button>
          ))}
        </div>

        {/* Current Dhikr Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDhikr.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center mb-8"
          >
            <p
              className="text-3xl md:text-4xl text-[#FFB300] mb-2 font-[family-name:var(--font-amiri)]"
              dir="rtl"
            >
              {selectedDhikr.arabic}
            </p>
            <p className="text-lg text-[#FFD54F]">{selectedDhikr.transliteration}</p>
            <p className="text-sm text-[#FFF8E1]/70 font-[family-name:var(--font-poppins)]">
              {selectedDhikr.meaningMs}
            </p>
            <p className="text-xs text-[#FFF8E1]/40">{selectedDhikr.meaning}</p>
          </motion.div>
        </AnimatePresence>

        {/* Counter Display */}
        <div className="flex justify-center mb-8">
          <motion.div
            key={displayCount}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-7xl md:text-8xl font-bold text-[#FFB300] font-[family-name:var(--font-cinzel)]"
          >
            {displayCount}
          </motion.div>
        </div>

        {/* Beads Visualization */}
        <div className="flex justify-center flex-wrap gap-1.5 mb-8 max-w-xs mx-auto px-4">
          {Array.from({ length: 33 }, (_, index) => {
            const filled = index < currentCount;

            return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                backgroundColor: filled ? "#FFB300" : "rgba(255, 179, 0, 0.15)",
                scale: filled ? 1.3 : 1,
              }}
              transition={{ duration: 0.2 }}
              className="w-3 h-3 rounded-full"
            />
            );
          })}
        </div>

        {/* Progress Text */}
        <p className="text-center text-[#FFF8E1]/60 text-base mb-2 font-[family-name:var(--font-poppins)]">
          {displayProgress}
        </p>
        <p className="text-center text-[#FFB300] text-sm mb-8 font-[family-name:var(--font-poppins)]">
          {completedRounds} kali x 33 selesai
        </p>

        {/* Count Button */}
        <div className="flex flex-col items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCount}
            className={`w-36 h-36 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(255,179,0,0.3)] hover:shadow-[0_0_60px_rgba(255,179,0,0.5)] transition-all font-[family-name:var(--font-poppins)] ${
              currentCount === 33
                ? "bg-gradient-to-br from-[#FFD54F] to-[#FFB300] text-[#004D40] animate-pulse"
                : "bg-gradient-to-br from-[#FFB300] to-[#FFA000] text-[#004D40]"
            }`}
          >
            {currentCount === 33 ? "Seterusnya →" : "Kira"}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-6 py-3 rounded-full border border-[#FFB300]/50 text-[#FFB300] hover:bg-[#FFB300]/10 transition-colors font-[family-name:var(--font-poppins)] text-sm"
          >
            Tetap Semula
          </motion.button>
        </div>
      </motion.div>
    </section>
  );
}
