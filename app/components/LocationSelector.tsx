"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, malaysianLocations } from "../hooks/useLocation";

interface LocationSelectorProps {
  onLocationSelected?: () => void;
}

export default function LocationSelector({ onLocationSelected }: LocationSelectorProps) {
  const { location, error, loading, requestLocation, setManualLocation } = useLocation();
  const [showManual, setShowManual] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = malaysianLocations.filter(
    (loc) =>
      loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManualSelect = (loc: typeof malaysianLocations[0]) => {
    setManualLocation(loc);
    setShowManual(false);
    onLocationSelected?.();
  };

  const handleAutoDetect = () => {
    requestLocation();
    onLocationSelected?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#004D40]/80 to-[#004D40]/40 border border-[#FFB300]/30 rounded-2xl p-6 max-w-md mx-auto"
    >
      <h3 className="text-xl font-bold text-[#FFB300] mb-4 text-center font-[family-name:var(--font-poppins)]">
        Pilih Lokasi
      </h3>
      <p className="text-[#FFF8E1]/60 text-sm text-center mb-6">
        Pilih lokasi untuk waktu solat yang tepat
      </p>

      {/* Auto Detect Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAutoDetect}
        disabled={loading}
        className="w-full py-3 px-4 mb-4 bg-gradient-to-r from-[#FFB300] to-[#FFA000] text-[#004D40] font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-[#004D40] border-t-transparent rounded-full"
            />
            <span>Mengesan lokasi...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Kesan Lokasi Saya</span>
          </>
        )}
      </motion.button>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm text-center mb-4"
        >
          {error}
        </motion.p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-[#FFB300]/20" />
        <span className="text-[#FFF8E1]/40 text-sm">atau</span>
        <div className="flex-1 h-px bg-[#FFB300]/20" />
      </div>

      {/* Manual Selection Toggle */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowManual(!showManual)}
        className="w-full py-3 px-4 border border-[#FFB300]/50 text-[#FFB300] rounded-xl font-[family-name:var(--font-poppins)]"
      >
        {showManual ? "Tutup Senarai" : "Pilih Bandar Secara Manual"}
      </motion.button>

      {/* Manual Selection Dropdown */}
      <AnimatePresence>
        {showManual && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Search Input */}
            <input
              type="text"
              placeholder="Cari bandar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mt-4 px-4 py-2 bg-[#004D40]/50 border border-[#FFB300]/30 rounded-lg text-[#FFF8E1] placeholder-[#FFF8E1]/40 focus:outline-none focus:border-[#FFB300]"
            />

            {/* Location List */}
            <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
              {filteredLocations.map((loc) => (
                <motion.button
                  key={`${loc.city}-${loc.state}`}
                  whileHover={{ backgroundColor: "rgba(255, 179, 0, 0.1)" }}
                  onClick={() => handleManualSelect(loc)}
                  className="w-full text-left px-4 py-2 rounded-lg text-[#FFF8E1]/80 hover:text-[#FFB300] transition-colors"
                >
                  <span className="font-medium">{loc.city}</span>
                  <span className="text-[#FFF8E1]/50 text-sm">, {loc.state}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Location Display */}
      {location && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 p-3 bg-[#FFB300]/10 rounded-lg text-center"
        >
          <p className="text-[#FFD54F] text-sm">Lokasi Terpilih:</p>
          <p className="text-[#FFF8E1] font-medium">
            {location.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
          </p>
          {location.state && <p className="text-[#FFF8E1]/60 text-sm">{location.state}</p>}
          <p className="text-[#FFF8E1]/40 text-xs mt-1">
            {location.method === "auto" ? "(Pengesanan Auto)" : "(Pilihan Manual)"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
