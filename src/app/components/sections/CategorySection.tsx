'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import useGsapSection from '@/app/motion/hooks/useGsapSection';

interface Category {
  id: number;
  name: string;
  illustration: string;
}

interface FoodItem {
  id: number;
  name: string;
  preview: string;
}

const CategorySection = () => {
  const [activeCategory, setActiveCategory] = useState(1);

  const categories: Category[] = [
    { id: 1, name: 'Minuman', illustration: 'https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c42600075972b81a/view?project=6861b5e20027ba386475&mode=admin' },
    { id: 2, name: 'Makanan', illustration: 'https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c457003b4b1c053f/view?project=6861b5e20027ba386475&mode=admin' },
    { id: 3, name: 'Jasa', illustration: 'https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c45d0014cbd719ae/view?project=6861b5e20027ba386475&mode=admin' },
  ];

  const foodItems: FoodItem[] = [
    { id: 1, name: 'Sate Bakar', preview: 'https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c4450018dfdc8210/view?project=6861b5e20027ba386475&mode=admin' },
    { id: 2, name: 'Es Cendol', preview: 'https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c430003b2b71d0eb/view?project=6861b5e20027ba386475&mode=admin' },
    { id: 3, name: 'Lumpia Goreng', preview: 'https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c43a0036cda8d1e1/view?project=6861b5e20027ba386475&mode=admin' },
  ];

  const getPrevIndex = useCallback(() => (activeCategory - 1 + categories.length) % categories.length, [activeCategory, categories.length]);
  const getNextIndex = useCallback(() => (activeCategory + 1) % categories.length, [activeCategory, categories.length]);

  // === GSAP Hook ===
  const ref = useGsapSection({
    desktopOnly: true,
    start: "top 80%",
    end: "20% top",
    scrub: true,
    timeline: (tl: gsap.core.Timeline) => {
      // Animasi judul dan carousel
      tl.from(".category-title", { opacity: 0, y: 40, duration: 0.7 })
        .from(".category-carousel", { opacity: 0, y: 30, duration: 0.7 }, "<0.2")
        .from(".food-grid", { opacity: 0, y: 20, duration: 0.7 }, "<0.2")
        .from(".category-right", { opacity: 0, y: 30, duration: 0.8 }, "<0.3");
    },
  });

  // === Swipe/drag untuk mobile ===
  useEffect(() => {
    const carouselEl = document.querySelector('.category-carousel');
    if (!carouselEl) return;

    let startX: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 1024) return;
      startX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!startX) return;
      const diff = e.touches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) setActiveCategory(getPrevIndex());
        else setActiveCategory(getNextIndex());
        startX = null;
      }
    };
    const handleTouchEnd = () => { startX = null; };

    carouselEl.addEventListener('touchstart', handleTouchStart as EventListener);
    carouselEl.addEventListener('touchmove', handleTouchMove as EventListener);
    carouselEl.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      carouselEl.removeEventListener('touchstart', handleTouchStart as EventListener);
      carouselEl.removeEventListener('touchmove', handleTouchMove as EventListener);
      carouselEl.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [getPrevIndex, getNextIndex]);

  return (
    <section ref={ref} className="py-16 md:py-20" id='kategori'>
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* Left Side */}
          <div className="category-left relative flex flex-col">
            <div className="border-4 border-[#6B6B6B] rounded-[48px] lg:rounded-[72px] p-6 lg:p-8 bg-[#FFF8F2] shadow-lg">
              <h2 className="category-title text-2xl md:text-3xl lg:text-4xl text-center font-bold text-[#2E2E2E] mb-8 lg:mb-12">
                Pilih Kategori Favoritmu
              </h2>

              <div className="category-carousel relative flex flex-col items-center justify-center mb-8 overflow-hidden">
                <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-6">
                  {/* Prev */}
                  <button onClick={() => setActiveCategory(getPrevIndex())} className="transition duration-300 transform hover:scale-110 active:scale-95 hover:opacity-75">
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center">
                      <Image src={categories[getPrevIndex()].illustration} alt={categories[getPrevIndex()].name} width={160} height={160} className="object-contain" priority />
                    </div>
                  </button>

                  {/* Active */}
                  <div className="bg-[#FF885B] rounded-[32px] lg:rounded-[52px] p-6 lg:p-8 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 flex flex-col items-center justify-center shadow-2xl transition duration-300 transform hover:scale-[1.03]">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Image src={categories[activeCategory].illustration} alt={categories[activeCategory].name} width={220} height={220} className="object-contain mb-2 lg:mb-4" priority />
                      <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white">{categories[activeCategory].name}</h4>
                    </div>
                  </div>

                  {/* Next */}
                  <button onClick={() => setActiveCategory(getNextIndex())} className="transition duration-300 transform hover:scale-110 active:scale-95 hover:opacity-75">
                    <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center">
                      <Image src={categories[getNextIndex()].illustration} alt={categories[getNextIndex()].name} width={160} height={160} className="object-contain" priority />
                    </div>
                  </button>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-6 lg:mt-8">
                  {categories.map((category, index) => (
                    <button key={category.id} onClick={() => setActiveCategory(index)}
                      className={`transition-all duration-300 rounded-full transform hover:scale-125 active:scale-90 ${
                        index === activeCategory ? 'w-8 h-3 bg-[#FF885B]' : 'w-3 h-3 bg-gray-400 hover:bg-gray-500'
                      }`}
                      aria-label={`Go to ${category.name}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Food Grid */}
            <div className="food-grid relative grid grid-cols-3 gap-3 md:gap-4 mt-6 lg:mt-8">
              {foodItems.map((item) => (
                <div key={item.id} className="relative aspect-square rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-500 hover:scale-[1.03] hover:-translate-y-10">
                  <Image src={item.preview} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Hero */}
          <div className="category-right relative h-[500px] md:h-[600px] lg:h-[800px] rounded-3xl lg:rounded-[40px] overflow-hidden shadow-2xl group">
            <div className="relative w-full h-full transition duration-700 transform hover:scale-[1.02]">
              <Image src="https://syd.cloud.appwrite.io/v1/storage/buckets/illustrations/files/6918c4450018dfdc8210/view?project=6861b5e20027ba386475&mode=admin" alt="UMKM Showcase - Sate Bakar" fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs md:text-sm font-semibold mb-1 opacity-90">Featured</p>
              <h3 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">Sate Bakar Khas Nusantara</h3>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CategorySection;