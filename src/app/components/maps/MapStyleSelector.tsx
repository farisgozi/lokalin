'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Check } from 'lucide-react';

interface MapStyleSelectorProps {
  setMapStyle: (url: string) => void;
}

export function MapStyleSelector({ setMapStyle }: MapStyleSelectorProps) {
  const styles = [
    { name: 'Default', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' },
    { name: 'Minimal', url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png' },
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(styles[0].name);

  const handleSelect = (style: typeof styles[0]) => {
    setSelected(style.name);
    setMapStyle(style.url);
    setOpen(false);
  };

  return (
    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 z-30">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-white rounded-xl shadow-lg px-4 py-2 hover:shadow-xl transition-shadow duration-300 focus:outline-none"
      >
        <Layers className="w-5 h-5 text-orange-500" />
        <span className="text-sm font-medium text-gray-700">{selected}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="mt-2 bg-white rounded-xl shadow-2xl overflow-hidden w-48 flex flex-col"
          >
            {styles.map(s => (
              <button
                key={s.name}
                onClick={() => handleSelect(s)}
                className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-200 ${
                  selected === s.name ? 'font-semibold bg-orange-100 text-orange-600' : ''
                }`}
              >
                {s.name}
                {selected === s.name && <Check className="w-4 h-4 text-orange-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
