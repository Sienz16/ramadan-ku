"use client";

import { motion } from "framer-motion";
import { useHabitGamification } from "../hooks/useHabitGamification";
import { CHECKLIST_ITEMS } from "../lib/habitGamification";

export default function GamificationSection() {
  const { todayDateKey, todayCompleted, metrics, unlockedBadges, toggleItem } = useHabitGamification();

  return (
    <section className="relative py-20 px-6 sm:px-8 lg:px-16 xl:px-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-2">
            Mode Istiqamah
          </h2>
          <p className="text-[#FFF8E1]/60 text-sm">Streak harian, checklist ibadah, dan pet growth untuk kekal konsisten</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-[#FFB300]/30 bg-gradient-to-br from-[#004D40]/70 to-[#00382f]/40 p-6">
            <p className="text-[#FFD54F]/80 text-xs uppercase tracking-[0.16em]">Streak Semasa</p>
            <p className="text-4xl font-bold text-[#FFB300] mt-2">{metrics.currentStreak}🔥</p>
            <p className="text-[#FFF8E1]/60 text-sm mt-2">Rekod terbaik: {metrics.bestStreak} hari</p>
          </div>

          <div className="rounded-2xl border border-emerald-300/30 bg-gradient-to-br from-[#004D40]/70 to-[#03372f]/40 p-6">
            <p className="text-emerald-200/80 text-xs uppercase tracking-[0.16em]">Skor Konsisten 7 Hari</p>
            <p className="text-4xl font-bold text-emerald-200 mt-2">{metrics.weeklyConsistencyScore}%</p>
            <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-300 to-emerald-500"
                style={{ width: `${Math.min(100, Math.max(0, metrics.weeklyConsistencyScore))}%` }}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#FFB300]/30 bg-gradient-to-br from-[#004D40]/70 to-[#3f2d00]/35 p-6 text-center">
            <p className="text-[#FFD54F]/80 text-xs uppercase tracking-[0.16em]">Pet Streak</p>
            <div className="text-5xl mt-2">{metrics.pet.emoji}</div>
            <p className="text-[#FFB300] font-semibold mt-2">{metrics.pet.label}</p>
            <p className="text-[#FFF8E1]/60 text-sm mt-1">XP: {metrics.pet.totalXp}</p>
            <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFB300] to-[#FFD54F]"
                style={{ width: `${metrics.pet.progressToNextPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-2xl border border-[#FFB300]/30 bg-[#004D40]/45 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)]">Checklist Hari Ini</h3>
              <p className="text-xs text-[#FFF8E1]/50">{todayDateKey}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {CHECKLIST_ITEMS.map((item) => {
                const active = todayCompleted.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`text-left rounded-xl border px-4 py-3 transition-all ${active
                      ? "border-emerald-300/50 bg-emerald-400/10"
                      : "border-[#FFB300]/20 bg-[#00382f]/30 hover:border-[#FFB300]/40"}`}
                  >
                    <p className="text-sm text-[#FFD54F]">{item.icon}</p>
                    <p className="text-[#FFF8E1] text-sm font-medium mt-1">{item.label}</p>
                    <p className="text-xs mt-1 text-[#FFF8E1]/55">{active ? "Selesai" : "Belum selesai"}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-[#FFB300]/30 bg-[#004D40]/45 p-6">
            <h3 className="text-xl font-bold text-[#FFB300] font-[family-name:var(--font-poppins)] mb-4">Badge Anda</h3>

            {unlockedBadges.length === 0 ? (
              <p className="text-[#FFF8E1]/60 text-sm">Belum ada badge. Lengkapkan checklist harian untuk unlock!</p>
            ) : (
              <div className="space-y-3">
                {unlockedBadges.map((badge) => (
                  <div key={badge.id} className="rounded-xl border border-[#FFB300]/25 bg-[#00382f]/35 p-3">
                    <p className="text-[#FFD54F] text-sm">{badge.icon} {badge.label}</p>
                    <p className="text-[#FFF8E1]/70 text-xs mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-xl border border-[#FFB300]/20 bg-[#00382f]/35 p-3">
              <p className="text-xs text-[#FFF8E1]/60">Total aksi ibadah direkod</p>
              <p className="text-2xl text-[#FFB300] font-bold mt-1">{metrics.totalCompletedActions}</p>
              <p className="text-xs text-[#FFF8E1]/50 mt-1">Hari sempurna: {metrics.perfectDaysCount}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
