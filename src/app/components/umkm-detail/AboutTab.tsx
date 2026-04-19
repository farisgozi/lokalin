"use client";

import { motion } from "framer-motion";
import { TrendingUp, Star, Clock, Heart } from "lucide-react";
import { UMKM, getAverageRating } from "@/app/data/umkmDummy";

interface AboutTabProps {
  umkm: UMKM;
}

export default function AboutTab({ umkm }: AboutTabProps) {
  const { average, count } = getAverageRating(umkm.id);
  const displayRating = count > 0 ? average.toFixed(1) : (umkm.rating || 0).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFF8F3] rounded-2xl sm:rounded-3xl shadow-xl border border-[#FF9E6B]/10 p-5 sm:p-6 lg:p-8 xl:p-10"
    >
      <div className="flex items-center gap-2 sm:gap-3 mb-5 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF9E6B] to-[#FF9E6B]/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8F3]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#2E2E2E]">
          Tentang Kami
        </h2>
      </div>

      <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
        <p className="text-[#2E2E2E]/80 leading-relaxed text-base sm:text-lg">
          {umkm.description}
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h4 className="font-bold text-[#2E2E2E] mb-1 text-sm sm:text-base">Kualitas Terjamin</h4>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70">Produk berkualitas tinggi</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h4 className="font-bold text-[#2E2E2E] mb-1 text-sm sm:text-base">Pelayanan Cepat</h4>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70">Respons yang ramah</p>
        </div>

        <div className="bg-gradient-to-br from-[#FFF2E7] to-[#FF9E6B]/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 sm:col-span-2 lg:col-span-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#FF9E6B] rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <h4 className="font-bold text-[#2E2E2E] mb-1 text-sm sm:text-base">Terpercaya</h4>
          <p className="text-xs sm:text-sm text-[#2E2E2E]/70">Rating {displayRating}{count > 0 ? ` (${count} ulasan)` : ""} dari pelanggan</p>
        </div>
      </div>
    </motion.div>
  );
}