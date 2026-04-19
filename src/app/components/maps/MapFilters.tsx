'use client';

import { JSX, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, UtensilsCrossed, Shirt, Search, MapPin, Coffee, GlassWater } from 'lucide-react';

interface MapFiltersProps {
  categories: string[];
  onFilter: (category: string) => void;
  onSearch: (query: string) => void;
  activeCategory: string;
  filterRadius: boolean;
  userLocation: { lat: number; lng: number } | null;
  onToggleRadius: () => void;
}

interface FilterOption {
  label: string;
  icon: JSX.Element;
}

export function MapFilters({
  onFilter,
  onSearch,
  activeCategory,
  filterRadius,
  userLocation,
  onToggleRadius
}: MapFiltersProps) {
  const filters: FilterOption[] = [
    { label: 'All', icon: <Store className="w-4 h-4" /> },
    { label: 'Makanan', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { label: 'Minuman', icon: <GlassWater className="w-4 h-4" /> },
    { label: 'Fashion', icon: <Shirt className="w-4 h-4" /> },
    { label: 'Kedai Kopi', icon: <Coffee className="w-4 h-4" /> },
  ];

  const [open, setOpen] = useState(false);

  const handleSelect = (option: FilterOption) => {
    onFilter(option.label);
    setOpen(false);
  };

  return (
    <>
      {/* Search Bar - Centered at Top */}
      <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-30 sm:w-auto w-1/2">
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-white shadow-md">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari UMKM..."
            onChange={(e) => onSearch(e.target.value)}
            className="outline-none text-sm text-gray-700 bg-transparent w-full"
          />
        </div>
      </div>

      {/* Category & Radius - Top Right */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-30 flex flex-col gap-2">
        {/* Radius Toggle */}
        <motion.button
          onClick={onToggleRadius}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center gap-2 rounded-full shadow-md border transition-colors px-3 py-2 text-xs sm:text-sm font-medium ${
            filterRadius
              ? 'bg-orange-500 text-white border-orange-400 shadow-orange-300'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
          title={
            userLocation
              ? filterRadius
                ? 'Menampilkan UMKM dalam radius 5 km'
                : 'Tampilkan semua UMKM'
              : 'Aktifkan lokasi terlebih dahulu'
          }
        >
          <MapPin
            className={`w-4 h-4 sm:w-5 sm:h-5 ${
              filterRadius ? 'text-white' : 'text-orange-500'
            }`}
          />
          <span className="hidden sm:inline">
            {userLocation
              ? filterRadius
                ? 'Radius 5 km'
                : 'Semua UMKM'
              : 'Aktifkan Lokasi'}
          </span>
        </motion.button>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 bg-white shadow-md rounded-full px-4 py-2 hover:shadow-lg transition-shadow duration-200 text-sm font-semibold text-gray-700 w-full"
          >
            {filters.find(f => f.label === activeCategory)?.icon}
            <span className="hidden sm:inline">{activeCategory}</span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="absolute top-full mt-2 right-0 w-40 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
              >
                {filters.map(f => (
                  <button
                    key={f.label}
                    onClick={() => handleSelect(f)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 transition-colors duration-200 ${
                      activeCategory === f.label ? 'bg-orange-100 text-orange-600 font-semibold' : ''
                    }`}
                  >
                    {f.icon}
                    {f.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}