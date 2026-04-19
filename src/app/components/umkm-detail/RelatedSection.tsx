"use client";

import { motion, cubicBezier } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { umkmDummy } from "@/app/data/umkmDummy";
import UMKMCard from "@/app/components/layouts/UMKMCard";

interface RelatedSectionProps {
  currentUmkmId: string;
}

export default function RelatedSection({ currentUmkmId }: RelatedSectionProps) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: cubicBezier(0.25, 0.1, 0.25, 1) },
    }),
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-10 lg:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={0}
        >
          <div className="inline-block mb-3 sm:mb-4">
            <span className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#FF9E6B] to-[#FF9E6B]/80 text-[#FFF8F3] rounded-full font-semibold text-xs sm:text-sm">
              Rekomendasi
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#2E2E2E] mb-3 sm:mb-4">
            UMKM Lainnya
          </h2>
          <p className="text-[#2E2E2E]/70 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Jelajahi UMKM menarik lainnya di sekitar Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {umkmDummy
            .filter((item) => item.id !== currentUmkmId)
            .slice(0, 3)
            .map((relatedUmkm, index) => (
              <UMKMCard key={relatedUmkm.id} umkm={relatedUmkm} index={index} />
            ))}
        </div>

        <motion.div
          className="text-center mt-8 sm:mt-10 lg:mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={3}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#FF9E6B] to-[#FF9E6B]/80 hover:from-[#FF9E6B]/90 hover:to-[#FF9E6B]/70 text-[#FFF8F3] font-bold py-3 sm:py-4 px-6 sm:px-8 lg:px-10 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            Lihat Semua UMKM
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
