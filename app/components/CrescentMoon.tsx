"use client";

import { motion } from "framer-motion";

const moonStars = [
  { top: 24, left: 18, duration: 2.0, delay: 0.0 },
  { top: 36, left: 72, duration: 2.5, delay: 0.3 },
  { top: 54, left: 28, duration: 3.0, delay: 0.6 },
  { top: 62, left: 64, duration: 3.5, delay: 0.9 },
  { top: 76, left: 44, duration: 4.0, delay: 1.2 },
];

export default function CrescentMoon() {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Glow effect - Malaysian Gold */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,179,0,0.35) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: "scale(1.5)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Moon SVG - Malaysian Gold Gradient */}
      <svg
        width="220"
        height="220"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="moonGradientMs" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFB300" />
            <stop offset="50%" stopColor="#FFD54F" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>
          <filter id="glowMs">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M100 20C58.5786 20 25 53.5786 25 95C25 136.421 58.5786 170 100 170C128.5 170 153.5 155.5 167 133.5C154.5 148.5 135.5 157.5 114.5 157.5C74.5 157.5 42.5 125.5 42.5 85.5C42.5 58.5 57.5 35.5 79.5 23C86.5 21 93 20 100 20Z"
          fill="url(#moonGradientMs)"
          filter="url(#glowMs)"
        />
      </svg>

      {/* Decorative stars around moon */}
      {moonStars.map((star, index) => (
        <motion.div
          key={index}
          className="absolute w-2 h-2 bg-[#FFD54F] rounded-full"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </motion.div>
  );
}
