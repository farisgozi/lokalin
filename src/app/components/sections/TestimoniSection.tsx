'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import useGsapSection from "@/app/motion/hooks/useGsapSection";
 // pastikan path sesuai

interface Testimonial {
  id: number;
  name: string;
  business: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Pak Ahmad",
    business: "Toko Kelontong Maju Jaya",
    avatar: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30f00185484c2ec/view?project=6861b5e20027ba386475&mode=admin",
    rating: 4.5,
    text: "Platform ini sangat membantu UMKM seperti saya untuk berkembang. Pelayanannya responsif dan fitur-fiturnya mudah dipahami.",
  },
  {
    id: 2,
    name: "Ibu Lina",
    business: "Salon Kecantikan Cantik",
    avatar: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c2fd00230c92263c/view?project=6861b5e20027ba386475&mode=admin",
    rating: 4.5,
    text: "Dengan bergabung di sini, pelanggan saya bertambah banyak. Sistem pembayarannya juga aman dan terpercaya.",
  },
  {
    id: 3,
    name: "Mas Rudi",
    business: "Bengkel Motor Speedy",
    avatar: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c3150026cd837cfa/view?project=6861b5e20027ba386475&mode=admin",
    rating: 4.5,
    text: "Sangat recommended untuk UMKM yang ingin go digital. Support team-nya juga sangat membantu dalam proses onboarding.",
  },
  {
    id: 4,
    name: "Mbak Sari",
    business: "Toko Bunga Melati",
    avatar: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c304002295e53a62/view?project=6861b5e20027ba386475&mode=admin",
    rating: 4.5,
    text: "Interface-nya user-friendly dan mudah digunakan. Omzet toko bunga saya meningkat signifikan sejak bergabung.",
  },
  {
    id: 5,
    name: "Pak Dedi",
    business: "Warung Kopi Sedap",
    avatar: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c31a0002e95e4b1c/view?project=6861b5e20027ba386475&mode=admin",
    rating: 4.5,
    text: "Fitur lokasi dan review sangat membantu warung kopi saya ditemukan lebih banyak pelanggan. Terima kasih!",
  },
  {
    id: 6,
    name: "Bu Ani",
    business: "Toko Kue Manis",
    avatar: "https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30a0030bf4a8610/view?project=6861b5e20027ba386475&mode=admin",
    rating: 4.5,
    text: "Proses registrasi cepat dan mudah. Dalam seminggu, pesanan online saya langsung meningkat drastis.",
  },
];

export default function TestimoniSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play desktop/tablet
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000); // 6 detik per testimonial
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger
  const sectionRef = useGsapSection({
    desktopOnly:true,
    start: "top 80%",
    end: "20% top",
    scrub: 0.5,
    timeline: (tl: gsap.core.Timeline) => {
      tl.from('.testimonial-heading', {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
      });
      tl.from('.testimonial-card', {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
      }, '-=0.4');
    },
  });

  return (
    <section ref={sectionRef} className="py-16 md:py-20 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20 testimonial-heading">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF9E6B]/15 text-[#FF885B] rounded-full font-semibold mb-4">
            <Star className="w-5 h-5 fill-[#FF9E6B]" /> Testimoni
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2E2E2E] mb-3">
            Apa Kata Mereka?
          </h2>

          <p className="text-lg md:text-xl text-[#6B6B6B] max-w-2xl mx-auto">
            Dengarkan kisah nyata para pelaku UMKM yang berkembang bersama UMKM Kita.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative mx-auto testimonial-card">
          <div className="min-h-[400px] md:min-h-[320px] flex items-center w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[#FFD194]/50 transition-transform duration-500 hover:-translate-y-2">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden shrink-0 border-4 border-[#FF9E6B]/60 shadow-lg">
                  <Image
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(testimonials[currentIndex].rating)
                            ? "fill-[#FF9E6B] text-[#FF9E6B]"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="font-bold text-xl text-[#2E2E2E] ml-1">
                      {testimonials[currentIndex].rating}
                    </span>
                  </div>

                  <p className="text-lg md:text-xl text-[#6B6B6B] leading-relaxed mb-6 italic">
                    “{testimonials[currentIndex].text}”
                  </p>

                  <div>
                    <h3 className="text-2xl font-bold text-[#2E2E2E] mb-1">
                      {testimonials[currentIndex].name}
                    </h3>
                    <p className="text-lg text-[#FF885B] font-medium">
                      {testimonials[currentIndex].business}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-10 bg-[#FF885B]" : "w-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}