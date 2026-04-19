"use client";

import { motion, cubicBezier } from "framer-motion";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { UMKM, getAverageRating } from "@/app/data/umkmDummy";

interface HeroSectionProps {
  umkm: UMKM;
  isLiked: boolean;
  onLikeToggle: () => void;
  heroImageRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeroSection({ umkm, heroImageRef }: HeroSectionProps) {
  const { average, count } = getAverageRating(umkm.id);
  const displayRating = count > 0 ? average.toFixed(1) : (umkm.rating || 0).toFixed(1);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: cubicBezier(0.25, 0.1, 0.25, 1) },
    }),
  };

  const heroImage = umkm.gallery?.[0];

  return (
    <div className="relative h-[70vh] sm:h-[75vh] lg:h-[85vh] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF9E6B]/20 via-[#FFF2E7] to-[#FF9E6B]/10 animate-pulse" />

      <div ref={heroImageRef} className="absolute inset-0 w-full h-full">
        {heroImage && (
          <Image
            src={heroImage}
            alt={umkm.name}
            fill
            priority
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#2E2E2E] via-[#2E2E2E]/60 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 sm:pb-10 lg:pb-12 px-4 sm:px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
        >
          {/* Stats Cards */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <motion.div
              className="px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-[#FF9E6B] to-[#FF9E6B]/80 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-[#FFF8F3]/20 flex items-center justify-centergap-1.5 sm:gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-300 text-yellow-300" />
              <span className="font-bold text-[#FFF8F3] text-base sm:text-lg">{displayRating}</span>
            </motion.div>

            <motion.div
              className="px-3 sm:px-5 py-2 sm:py-3 bg-[#FFF8F3]/90 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-xl border border-[#FF9E6B]/20"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-[#2E2E2E] font-bold text-xs sm:text-base">{umkm.category}</span>
            </motion.div>
          </div>

          {/* Title Card */}
          <div className="bg-[#FFF8F3]/10 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-[#FFF8F3]/20 shadow-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-[#FFF8F3] mb-2 sm:mb-4 leading-tight">
              {umkm.name}
            </h1>
            <div className="flex items-start gap-2 sm:gap-3 text-[#2E2E2E]/80">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6  flex-shrink-0 text-[#FF9E6B]" />
              <p className="text-sm sm:text-base lg:text-xl  mb-2 leading-relaxed font-medium text-[#FFF8F3]">{umkm.address}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
