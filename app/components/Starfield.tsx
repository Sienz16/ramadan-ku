"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Starfield() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: (i * 13) % 100,
        y: (i * 29) % 100,
        size: 1 + (i % 3),
        delay: (i % 10) * 0.5,
        duration: 2 + (i % 4),
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
