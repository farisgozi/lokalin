"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { UMKM } from "@/app/data/umkmDummy";

interface UMKMCardProps {
  umkm: UMKM;
  index?: number;
}

export default function UMKMCard({ umkm, index = 0 }: UMKMCardProps) {
  const heroImage = umkm.gallery?.[0]; 
  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link href={`/umkm/${umkm.id}`}>
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-secondary/20 hover:shadow-xl transition-all duration-500 group">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
          {heroImage && (
            <Image
              src={heroImage}
              alt={umkm.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-primary/90 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                {umkm.category}
              </span>
            </div>

            {/* Rating */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-text">
                {umkm.rating || 4.0}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-display font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-300">
              {umkm.name}
            </h3>
            
            <div className="flex items-start gap-2 text-muted mb-3">
              <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
              <p className="text-sm line-clamp-2 leading-relaxed">
                {umkm.address}
              </p>
            </div>

            {umkm.description && (
              <p className="text-muted text-sm leading-relaxed line-clamp-2">
                {umkm.description}
              </p>
            )}

            {/* Open Hours */}
            {umkm.openHours && (
              <div className="mt-4 pt-4 border-t border-secondary/20">
                <p className="text-xs text-muted">
                  <span className="font-medium">Buka:</span> {umkm.openHours.open} - {umkm.openHours.close}
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
