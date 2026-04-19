"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { UMKM } from "@/app/data/umkmDummy";

interface GalleryTabProps {
  umkm: UMKM;
}

export default function GalleryTab({ umkm }: GalleryTabProps) {
   const galleryImages = Array.isArray(umkm.gallery)
    ? umkm.gallery
    : [umkm.gallery || 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#FFF8F3] rounded-2xl sm:rounded-3xl shadow-xl border border-[#FF9E6B]/10 p-5 sm:p-6 lg:p-8 xl:p-10"
    >
      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#2E2E2E] mb-4 sm:mb-6">
        Galeri Foto
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {galleryImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="group relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#FFF2E7] cursor-pointer"
          >
            <Image
              src={img || 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin'}
              alt={`Gallery ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2E2E2E]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
