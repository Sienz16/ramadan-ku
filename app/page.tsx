"use client";

import { useState } from "react";
import Starfield from "./components/Starfield";
import Footer from "./components/Footer";
import LocationSelector from "./components/LocationSelector";
import HeroSection from "./sections/HeroSection";
import PrayerTimesSection from "./sections/PrayerTimesSection";
import SuhoorIftarSection from "./sections/SuhoorIftarSection";
import DailyDuaSection from "./sections/DailyDuaSection";
import DailyQuranSection from "./sections/DailyQuranSection";
import TasbeehSection from "./sections/TasbeehSection";
import { useLocation } from "./hooks/useLocation";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { location, setManualLocation, malaysianLocations } = useLocation();
  const [showLocationSelector, setShowLocationSelector] = useState(true);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <Starfield />

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {showLocationSelector && !location ? (
            <motion.div
              key="location-selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center px-4 py-20"
            >
              <LocationSelector
                onLocationSelected={() => setShowLocationSelector(false)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Location indicator - small pill at top */}
              {location && (
                <div className="fixed top-4 right-4 z-50">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowLocationSelector(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#004D40]/80 border border-[#FFB300]/30 rounded-full text-[#FFF8E1] text-sm backdrop-blur-sm"
                  >
                    <svg
                      className="w-4 h-4 text-[#FFB300]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>
                      {location.city || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                    </span>
                    <span className="text-[#FFF8E1]/50 text-xs">Tukar</span>
                  </motion.button>
                </div>
              )}

              <HeroSection location={location} />
              <PrayerTimesSection location={location} />
              <SuhoorIftarSection location={location} />
              <DailyDuaSection />
              <DailyQuranSection />
              <TasbeehSection />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
