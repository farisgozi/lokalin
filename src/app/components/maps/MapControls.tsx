'use client';

import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';
import { useState } from 'react';

interface MapControlsProps {
  onLocate: () => void;
}

export function MapControls({ onLocate }: MapControlsProps) {
  const [ripple, setRipple] = useState(false);

  const handleClick = () => {
    setRipple(true);
    onLocate();
    setTimeout(() => setRipple(false), 600);
  };

  return (
    <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-30">
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        className="relative p-3 rounded-full bg-orange-500 shadow-lg flex items-center justify-center text-white overflow-hidden hover:bg-orange-600 transition-colors duration-300"
        title="Temukan Lokasi"
      >
        <Navigation className="w-5 h-5" />

        {ripple && (
          <motion.span
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </motion.button>
    </div>
  );
}
