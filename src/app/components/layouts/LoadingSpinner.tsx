"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <motion.div
          className="relative w-16 h-16 mx-auto mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="absolute inset-0 border-4 border-secondary/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full"></div>
        </motion.div>
        
        <motion.h2
          className="text-xl font-display font-semibold text-text mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Memuat Detail UMKM...
        </motion.h2>
        
        <motion.p
          className="text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Mohon tunggu sebentar
        </motion.p>
      </div>
    </div>
  );
}
