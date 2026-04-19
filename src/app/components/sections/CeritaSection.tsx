'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import useGsapSection from "@/app/motion/hooks/useGsapSection";

interface Story {
  id: number;
  name: string;
  business: string;
  story: string;
  image: string;
}

export default function CeritaSection() {
  const [currentStory, setCurrentStory] = useState(0);

  const stories: Story[] = [
    {
      id: 1,
      name: "Ibu Siti",
      business: "Warung Nasi Pecel",
      story:
        "Dari dapur rumah menjadi warung favorit warga. 15 tahun melayani dengan bumbu resep turun temurun.",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c2fd00230c92263c/view?project=6861b5e20027ba386475&mode=admin",
    },
    {
      id: 2,
      name: "Pak Budi",
      business: "Kerajinan Bambu",
      story:
        "Mengubah bambu menjadi seni. Produk lokal yang kini merambah pasar internasional.",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30f00185484c2ec/view?project=6861b5e20027ba386475&mode=admin",
    },
    {
      id: 3,
      name: "Mbak Dewi",
      business: "Kopi Artisan",
      story:
        "Dari barista sampingan menjadi coffee shop dengan 3 cabang. Mimpi yang terwujud dengan ketekunan.",
      image: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30a0030bf4a8610/view?project=6861b5e20027ba386475&mode=admin",
    },
  ];

  // Auto-slide untuk desktop/tablet
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % stories.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stories.length]);

  // Hook GSAP untuk section
  const sectionRef = useGsapSection({
    desktopOnly: true,
    start: "top 80%",
    end: "20% top",
    scrub: 0.3,
    timeline: (tl: gsap.core.Timeline) => {
      tl.from(".cerita-title h2", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      })
      .from(".cerita-subline div", {
        scaleX: 0,
        transformOrigin: "left",
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out",
      }, "-=0.6")
      .from(".story-card", {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
      }, "-=0.5");
    },
  });

  return (
    <section
      ref={sectionRef}
      id="cerita"
      className="py-16 md:py-20 overflow-hidden"
      aria-labelledby="cerita-heading"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Image & Banner */}
          <div className="relative h-[480px] md:h-[600px] lg:h-[720px] rounded-3xl overflow-hidden shadow-2xl parallax-layer" data-speed="0.15">
            <Image
              src="https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-cerita/view?project=6861b5e20027ba386475&mode=admin"
              alt="UMKM Story"
              fill
              className="object-cover scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Right: Text & Story Card */}
          <div className="space-y-8 lg:space-y-10">
            <div className="cerita-title space-y-3">
              {["Setiap produk", "punya cerita.", "Mari dengarkan", "mereka."].map(
                (text, i) => (
                  <h2
                    key={i}
                    className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight ${
                      i === 1 ? "text-[#FF885B]" : "text-[#2E2E2E]"
                    }`}
                  >
                    {text}
                  </h2>
                )
              )}
            </div>

            {/* Subline Bar */}
            <div className="cerita-subline flex items-center gap-3">
              <div className="w-24 h-1.5 bg-[#FF885B] rounded-full origin-left" />
              <div className="w-16 h-1.5 bg-[#FF885B] rounded-full origin-left" />
              <div className="w-10 h-1.5 bg-[#FF885B] rounded-full origin-left" />
            </div>

            {/* Story Card */}
            <div className="story-card relative bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-md">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FF885B] scale-100 rotate-3">
                  <Image
                    src={stories[currentStory].image}
                    alt={stories[currentStory].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {stories[currentStory].name}
                  </h3>
                  <p className="text-orange-500 font-medium">
                    {stories[currentStory].business}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                &quot;{stories[currentStory].story}&quot;
              </p>

            </div>
              {/* Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {stories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStory(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentStory ? "w-10 bg-[#FF885B]" : "w-3 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}