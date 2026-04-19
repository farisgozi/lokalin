"use client";

import { motion } from "framer-motion";
import { Clock, Phone, MapPin } from "lucide-react";
import { UMKM } from "@/app/data/umkmDummy";

interface InfoTabProps {
  umkm: UMKM;
}

export default function InfoTab({ umkm }: InfoTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFF8F3] rounded-2xl sm:rounded-3xl shadow-xl border border-[#FF9E6B]/10 p-5 sm:p-6 lg:p-8 xl:p-10"
    >
      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#2E2E2E] mb-4 sm:mb-6">
        Informasi Detail
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        {umkm.openHours && (
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-[#FFF2E7] rounded-xl sm:rounded-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF9E6B] to-[#FF9E6B]/80 rounded-xl flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8F3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#2E2E2E] mb-1 text-sm sm:text-base">Jam Operasional</p>
              <p className="text-[#2E2E2E]/80 text-sm sm:text-base">
                {umkm.openHours.open} - {umkm.openHours.close}
              </p>
              <p className="text-xs sm:text-sm text-[#2E2E2E]/60 mt-1">
                {umkm.openHours.days.join(", ")}
              </p>
            </div>
          </div>
        )}

        {umkm.phone && (
          <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-[#FFF2E7] rounded-xl sm:rounded-2xl">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8F3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[#2E2E2E] mb-1 text-sm sm:text-base">Kontak</p>
              <a
                href={`tel:${umkm.phone}`}
                className="text-[#FF9E6B] hover:text-[#FF9E6B]/80 transition-colors font-medium text-sm sm:text-base break-all"
              >
                {umkm.phone}
              </a>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-[#FFF2E7] rounded-xl sm:rounded-2xl">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFF8F3]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#2E2E2E] mb-1 text-sm sm:text-base">Alamat Lengkap</p>
            <p className="text-[#2E2E2E]/80 leading-relaxed text-sm sm:text-base">
              {umkm.address}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}