"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import useGsapSection from "@/app/motion/hooks/useGsapSection";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");

  // Typing effect
  useEffect(() => {
    const targetText = "Keren di";
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(targetText.slice(0, index + 1));
      index++;
      if (index === targetText.length) clearInterval(timer);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // GSAP Section Hook
  const ref = useGsapSection({
    start: "top bottom",
    end: "bottom top",
    scrub: true,
    parallax: [
      { selector: ".hero-bg", speed: 0.2, depth: 1 },
      { selector: ".bg-gradient", speed: 0.1, depth: 1 },
    ],
    timeline: (tl: gsap.core.Timeline) => {
      tl.from(".hero-title", {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: "power2.out",
      })
        .from(
          ".hero-desc",
          { opacity: 0, y: 40, duration: 0.10 },
          "-=0.2"
        )
        .from(
          ".hero-cta",
          { opacity: 0, y: 30, duration: 0.10 },
          "-=0.2"
        )
        .from(
          ".hero-scroll-hint",
          { opacity: 0, y: 30, duration: 0.7 },
          "<0.1"
        );
    },
  });

  return (
    <section
      ref={ref}
      id="beranda"
      className="relative flex items-center min-h-screen overflow-hidden"
    >
      <div className="absolute inset-0 -z-10 w-full h-[120vh] will-change-transform">
        <Image
          src="https://syd.cloud.appwrite.io/v1/storage/buckets/hero-assets/files/6918c37e001c0dab8356/view?project=6861b5e20027ba386475&mode=admin"
          alt="Kota Jakarta senja"
          fill
          priority
          className="object-cover hero-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2E2E2E]/20 to-[#2E2E2E]/80 bg-gradient" />
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-8 lg:px-16 py-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-4xl space-y-6">
          {/* Kinetic Typography */}
          <h1 className="hero-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#FFF8F3]">
            Temukan <span className="text-[#FF9E6B]">UMKM</span>
            <br />
            {typedText}
            <br />
            Sekitarmu
          </h1>

          <p className="hero-desc text-lg md:text-xl text-[#FFF8F3]/90 leading-relaxed max-w-2xl">
            Dari warung kopi legendaris, kedai bakso andalan, hingga usaha kreatif di kampusmu — semua ada di satu tempat. Jelajahi, dukung, dan kenali cerita dibalik setiap karya lokal.
          </p>

          <div className="hero-cta mt-8 flex flex-wrap gap-4 items-center">
            <a
              href="#eksplor"
              className="inline-flex items-center font-bold rounded-full bg-[#FF9E6B] hover:bg-[#FF885B] text-[#FFF8F3] px-8 py-4 transition-all duration-300 shadow-lg"
            >
              Jelajahi Sekarang
            </a>
            <a
              href="#tentang"
              className="inline-flex items-center font-bold text-[#FFF8F3] px-8 py-4 rounded-full bg-[#FFF8F3]/10 backdrop-blur-sm border border-[#FFF8F3]/30 transition-all duration-300"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>

          <div className="hero-scroll-hint mt-16 flex items-center gap-3 text-[#FFF8F3]/70">
            <div className="h-px bg-[#FFF8F3]/30 w-12" />
            <span className="text-sm font-medium">
              Geser ke bawah untuk melihat lebih banyak
            </span>
          </div>
        </div>
      </div>

      {/* Chevron Down */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          duration: 1.2,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-6 h-6 text-[#FFF8F3]/80" />
      </motion.div>
    </section>
  );
}