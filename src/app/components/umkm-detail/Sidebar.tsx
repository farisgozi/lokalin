"use client";

import { motion } from "framer-motion";
import { Star, Calendar, ExternalLink, MessageCircle, Instagram, Facebook } from "lucide-react";
import { UMKM, getAverageRating } from "@/app/data/umkmDummy";

interface SidebarProps {
  umkm: UMKM;
}

export default function Sidebar({ umkm }: SidebarProps) {
  const { average: avgRating, count: ratingCount } = getAverageRating(umkm.id);
  const displayRating = ratingCount > 0 ? avgRating.toFixed(1) : (umkm.rating || 0).toFixed(1);
  const ratingLabel = ratingCount > 0 ? `${ratingCount} ulasan` : "Rating dari pelanggan";

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(umkm.name + " " + umkm.address)}`;

  // Clean phone for wa.me
  const cleanPhone = (umkm.phone || "")
    .replace(/[\s\-()]/g, "")
    .replace(/^0/, "62")
    .replace(/^\+/, "");
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : "";

  // WhatsApp from socialMedia field
  const socialWa = umkm.socialMedia?.whatsapp || "";
  const socialWaClean = socialWa
    .replace(/[\s\-()]/g, "")
    .replace(/^0/, "62")
    .replace(/^\+/, "");
  const socialWaUrl = socialWaClean ? `https://wa.me/${socialWaClean}` : "";

  return (
    <div className="lg:col-span-4 space-y-4 sm:space-y-6">
      {/* Quick Actions Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-[#FF9E6B] via-[#FF9E6B]/90 to-[#FF9E6B]/80 rounded-2xl sm:rounded-3xl p-6 sm:p-7 lg:p-8 shadow-2xl text-[#FFF8F3] lg:sticky lg:top-32"
      >
        <h3 className="text-xl sm:text-2xl font-display font-bold mb-4 sm:mb-6">
          Hubungi Kami
        </h3>

        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          <div className="bg-[#FFF8F3]/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-300 text-yellow-300" />
              <span className="font-bold text-lg sm:text-xl">{displayRating}</span>
            </div>
            <p className="text-[#FFF8F3]/90 text-xs sm:text-sm">{ratingLabel}</p>
          </div>

          {umkm.openHours && (
            <div className="bg-[#FFF8F3]/20 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold text-sm sm:text-base">Buka Sekarang</span>
              </div>
              <p className="text-[#FFF8F3]/90 text-xs sm:text-sm">
                {umkm.openHours.open} - {umkm.openHours.close}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3">
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#FFF8F3] text-[#FF9E6B] font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            Lihat di Peta
          </motion.a>

          {waUrl && (
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-emerald-500 text-[#FFF8F3] font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Chat WhatsApp
            </motion.a>
          )}
        </div>
      </motion.div>

      {/* Social Media Card */}
      {umkm.socialMedia && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#FFF8F3] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-[#FF9E6B]/10"
        >
          <h3 className="text-lg sm:text-xl font-display font-bold text-[#2E2E2E] mb-3 sm:mb-4">
            Ikuti Kami
          </h3>

          <div className="flex gap-2 sm:gap-3">
            {umkm.socialMedia.instagram && (
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href={umkm.socialMedia.instagram.startsWith("http") ? umkm.socialMedia.instagram : `https://instagram.com/${umkm.socialMedia.instagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            )}

            {umkm.socialMedia.facebook && (
              <motion.a
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href={umkm.socialMedia.facebook.startsWith("http") ? umkm.socialMedia.facebook : `https://facebook.com/${umkm.socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            )}

            {umkm.socialMedia.whatsapp && (
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href={socialWaUrl || `https://wa.me/${umkm.socialMedia.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg"
              >
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.a>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}