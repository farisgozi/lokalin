'use client';

import { UtensilsCrossed, Shirt, Briefcase, Store, GlassWater } from 'lucide-react';
import { createLucideIconMarker } from './leaflet-icons';
import { UMKM as UMKMType } from '../data/umkmDummy';
import { JSX } from 'react';

/* ===== Hitung Jarak antar Titik (km) ===== */
export const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

/* ===== Warna Kategori ===== */
export const CATEGORY_COLOR: Record<string, string> = {
  Makanan: '#F97316',
  Fashion: '#3B82F6',
  Minuman: '#10B981',
  Jasa: '#8B5CF6',
  Default: '#9CA3AF',
};

/* ===== Ambil Ikon Marker Berdasarkan Kategori ===== */
export const getCategoryIcon = (item: UMKMType, hoveredId: string | null) => {
  const isHovered = hoveredId === item.id;
  const baseClass = `w-4 h-4 text-[#2E2E2E] transition-transform ${isHovered ? 'scale-110' : 'scale-100'}`;

  const iconMap: Record<string, JSX.Element> = {
    Makanan: <UtensilsCrossed className={baseClass} />,
    Fashion: <Shirt className={baseClass} />,
    Minuman: <GlassWater className={baseClass} />,
    Jasa: <Briefcase className={baseClass} />,
    Default: <Store className={baseClass} />,
  };

  const iconEl = <div aria-hidden>{iconMap[item.category] || iconMap.Default}</div>;
  const color = CATEGORY_COLOR[item.category] || CATEGORY_COLOR.Default;

  return createLucideIconMarker(iconEl, color);
};
