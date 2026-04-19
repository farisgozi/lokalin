'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, Instagram, Facebook, Phone } from 'lucide-react';
import { UMKM, getAverageRating } from '@/app/data/umkmDummy';
import Link from 'next/link';

interface UMKMPopupCardProps {
  umkm: UMKM;
  isMobile: boolean;
  onClose: () => void;
}

export const UMKMPopupCard: React.FC<UMKMPopupCardProps> = ({
  umkm,
  isMobile,
  onClose,
}) => {
  const { average: avgRating, count: ratingCount } = getAverageRating(umkm.id);
  const displayRating = ratingCount > 0 ? avgRating : (umkm.rating || 0);

  const renderStars = () => (
    <div className="flex items-center mt-2 text-[#FF9E6B]">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={14}
          fill={i < Math.round(displayRating) ? 'currentColor' : 'none'}
          strokeWidth={1.5}
        />
      ))}
      <span className="ml-2 text-xs text-gray-600">{displayRating.toFixed(1)}{ratingCount > 0 ? ` (${ratingCount})` : ''}</span>
    </div>
  );

  const renderSocialMedia = () => {
    const sm = umkm.socialMedia;
    return (
      <div className="flex gap-3 mt-2 text-gray-500">
        {sm?.instagram && (
          <a href={`https://instagram.com/${sm.instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer">
            <Instagram size={16} />
          </a>
        )}
        {sm?.facebook && (
          <a href={sm.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook size={16} />
          </a>
        )}
        {umkm.phone && (
          <a href={`tel:${umkm.phone}`}>
            <Phone size={16} />
          </a>
        )}
      </div>
    );
  };

  const getOpenHoursText = () => {
    if (!umkm.openHours) return 'Jam buka tidak tersedia';
    return `${umkm.openHours.open} - ${umkm.openHours.close}`;
  };

  const heroImage = umkm.gallery?.[0];

  return (
    <motion.div
      key={umkm.id}
      drag="y"
      dragConstraints={{ top: 0, bottom: 120 }}
      onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
      initial={{ opacity: 0, y: 120 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 120 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className={`absolute left-0 right-0 z-30 bg-[#FFF8F3] shadow-2xl transition-all duration-400 ease-in-out
        ${isMobile
          ? 'bottom-0 rounded-t-3xl p-4'
          : 'bottom-10 left-1/2 -translate-x-1/2 rounded-3xl p-6 w-[90%] max-w-md'
        }`}
    >
      {isMobile && <div className="w-10 h-1.5 bg-[#6B6B6B] rounded-full mx-auto mb-3" />}

      <div className="flex gap-4 items-start">
        {heroImage && (
          <Image
            src={heroImage}
            alt={umkm.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-2xl object-cover shadow-md flex-shrink-0"
          />
        )

        }
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#2E2E2E]">{umkm.name}</h3>
          <p className="text-sm text-gray-500">{umkm.address}</p>
          {renderStars()}
          {renderSocialMedia()}
        </div>
      </div>

      <div className="max-h-[40vh] sm:max-h-none overflow-y-auto mt-3">
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{umkm.description}</p>
      </div>

      <div className="mt-4 flex justify-between items-center border-t pt-3">
        <p className="text-xs text-gray-500">{getOpenHoursText()}</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-orange-600 font-medium"
          >
            Tutup
          </button>
          <Link
            href={`/umkm/${umkm.id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:scale-105"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
