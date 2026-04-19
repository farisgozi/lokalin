'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, cubicBezier } from 'framer-motion';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('../maps/MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl bg-blue-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600 text-lg">Memuat peta...</p>
      </div>
    </div>
  ) 
});


export default function MapsSection  () {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.6, 0.05, 0.01, 0.9)
      }
    }
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: cubicBezier(0.6, 0.05, 0.01, 0.9)
      }
    }
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-orange-50/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              variants={titleVariants}
              className="inline-block mb-4"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                <MapPin className="w-4 h-4" />
                Lokasi
              </span>
            </motion.div>

            <motion.h2
              variants={titleVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4"
            >
              Temukan UMKM di Sekitarmu
            </motion.h2>

            <motion.p
              variants={titleVariants}
              className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Jelajahi ribuan UMKM lokal yang tersebar di berbagai kota
            </motion.p>
          </div>

          {/* Map Container */}
          <motion.div
            variants={mapVariants}
          >
             <MapComponent />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};