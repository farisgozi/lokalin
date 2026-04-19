"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface InfoCard {
  id: number;
  title: string;
  description: string;
  image: string;
  bgColor: string;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const infoCards: InfoCard[] = [
    {
      id: 1,
      title: "Informasi",
      description: "Memudahkan akses informasi UMKM lokal",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c4360023ff1f7d2d/view?project=6861b5e20027ba386475&mode=admin",
      bgColor: "from-[#FFD194]/60 to-[#FF9E6B]/40",
    },
    {
      id: 2,
      title: "Kolaborasi",
      description: "Menghubungkan platform digital dan UMKM lokal",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c420002de721d9a1/view?project=6861b5e20027ba386475&mode=admin",
      bgColor: "from-[#FF9E6B]/50 to-[#FFD194]/40",
    },
    {
      id: 3,
      title: "Promosi",
      description: "Meningkatkan eksposur usaha kecil",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c43f0011d5f611d1/view?project=6861b5e20027ba386475&mode=admin",
      bgColor: "from-[#FFD194]/60 to-[#FF9E6B]/50",
    },
    {
      id: 4,
      title: "Pemberdayaan",
      description: "Mendampingi UMKM agar siap bersaing secara digital",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c42c000098314585/view?project=6861b5e20027ba386475&mode=admin",
      bgColor: "from-[#FF9E6B]/50 to-[#FFD194]/40",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      // fade in section
      gsap.fromTo(
        section.querySelectorAll(".fade-up"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 1.2,
          stagger: 0.2,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );

      // parallax untuk card image
      gsap.utils.toArray<HTMLElement>(".card-image").forEach((el) => {
        gsap.to(el, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tentang"
      className="relative py-20 md:py-28 px-4 md:px-8 lg:px-16overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Content */}
          <div className="space-y-6 fade-up">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFF0E6] text-[#FF885B] rounded-full text-sm font-bold">
                <span className="w-2 h-2 bg-[#FF885B] rounded-full animate-pulse" />
                Tentang Kami
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2E2E2E] leading-tight fade-up">
              Kami menjadi wadah digital yang mempertemukan masyarakat dengan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF885B] to-[#FFD194]">
                UMKM lokal
              </span>{" "}
              mengangkat potensi daerah menjadi inspirasi nasional.
            </h2>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed fade-up">
              Platform yang menghubungkan Anda dengan ribuan UMKM lokal,
              mendukung pertumbuhan ekonomi daerah, dan memberdayakan pelaku
              usaha kecil untuk go digital.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="fade-up mt-6 inline-flex items-center gap-2 bg-[#FF885B] hover:bg-[#FF6E42] text-white font-semibold px-8 py-4 rounded-full shadow-lg transition-all duration-300"
            >
              Pelajari Lebih Lanjut
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>

          {/* Right Side - Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {infoCards.map((card, index) => (
              <motion.div
                key={card.id}
                whileHover={{
                  scale: 1.05,
                  rotate: index % 2 === 0 ? 2 : -2,
                  transition: { duration: 0.3 },
                }}
                className={`fade-up rounded-3xl p-6 md:p-8 bg-gradient-to-br ${card.bgColor} shadow-md hover:shadow-xl transition-all duration-300 ${
                  index === 1 ? "sm:mt-8" : ""
                } ${index === 3 ? "sm:mt-8" : ""}`}
              >
                {/* Image */}
                <div className="relative w-full h-40 md:h-48 mb-4 mt-4 rounded-2xl overflow-hidden card-image bg-white/40">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                {/* Text */}
                <div className="space-y-2">
                  <h3 className="text-2xl md:text-2xl font-bold text-[#2E2E2E]">
                    {card.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#444] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}