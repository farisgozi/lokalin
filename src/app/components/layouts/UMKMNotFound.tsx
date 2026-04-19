"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function UMKMNotFound() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={0}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text mb-4">
            UMKM Tidak Ditemukan
          </h1>
          
          <p className="text-lg text-muted leading-relaxed mb-8">
            Maaf, UMKM yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan atau tidak tersedia.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
          className="space-y-4"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          
          <p className="text-sm text-muted">
            atau jelajahi UMKM lain yang menarik
          </p>
        </motion.div>
      </div>
    </div>
  );
}
