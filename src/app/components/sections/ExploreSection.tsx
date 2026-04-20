'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Star, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import useGsapSection from '@/app/motion/hooks/useGsapSection';
import Link from 'next/link';
import { umkmDummy, getAverageRating } from '@/app/data/umkmDummy';

interface Review {
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

interface ExploreItem {
  umkmId: string;
  vendorName: string;
  vendorDescription: string;
  vendorImage: string;
  review: Review;
  productName: string;
  productDescription: string;
  productImage: string;
}

interface ExploreSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearching: boolean;
}

const defaultImage = 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin';

const vendorImageMap: Record<string, string> = {
  "11": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-mysbar-coffe/view?project=6861b5e20027ba386475&mode=admin",
  "8": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-ayamGeprek77/view?project=6861b5e20027ba386475&mode=admin",
  "1": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-bakmi-cikini/view?project=6861b5e20027ba386475&mode=admin",
  "10": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-martabak-view/view?project=6861b5e20027ba386475&mode=admin",
  "4": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-bubur-menteng/view?project=6861b5e20027ba386475&mode=admin",
};

const productImageMap: Record<string, string> = {
  "11": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-mysbar-product/view?project=6861b5e20027ba386475&mode=admin",
  "8": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-ayamGeprek77-produk2/view?project=6861b5e20027ba386475&mode=admin",
  "1": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-bakmi-produk/view?project=6861b5e20027ba386475&mode=admin",
  "10": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-martabak-produk/view?project=6861b5e20027ba386475&mode=admin",
  "4": "https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-bubur-produk/view?project=6861b5e20027ba386475&mode=admin",
};

const allowedUMKM = ["1", "8", "11", "10", "4"];

const generateExploreItems = (): ExploreItem[] => {
  const defaultReviewAvatars = [
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c30f00185484c2ec/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c3150026cd837cfa/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c2fd00230c92263c/view?project=6861b5e20027ba386475&mode=admin',
    'https://syd.cloud.appwrite.io/v1/storage/buckets/avatar-images/files/6918c304002295e53a62/view?project=6861b5e20027ba386475&mode=admin',
  ];

  const dummyReviewText = [
    'Makanannya enak banget, harga ramah dan pelayanan mantap!',
    'Tempatnya nyaman dan cocok buat nongkrong sore.',
    'Rasanya konsisten, rekomen banget buat kamu yang suka kuliner lokal.',
    'Pelayanan cepat dan makanan fresh setiap hari.',
  ];

  const selectedUMKM = umkmDummy.filter((u) => allowedUMKM.includes(u.id));

  return selectedUMKM.map((u, index) => {
    const review: Review = {
      name: ['Andi', 'Budi', 'Sari', 'Maya', 'Rina'][index % 5],
      avatar: defaultReviewAvatars[index % defaultReviewAvatars.length],
      rating: (() => { const r = getAverageRating(u.id); return r.count > 0 ? parseFloat(r.average.toFixed(1)) : (u.rating ?? 4.5); })(),
      text: dummyReviewText[index % dummyReviewText.length],
    };

    const productImage = productImageMap[u.id] ?? defaultImage;
    const vendorImage = vendorImageMap[u.id] ?? defaultImage;

    return {
      umkmId: u.id,
      vendorName: u.name,
      vendorDescription: u.description ?? 'UMKM ini menyediakan produk terbaik dengan harga terjangkau.',
      vendorImage,
      review,
      productName: `${u.name}`,
      productDescription: u.description ?? 'Produk favorit pelanggan dan wajib dicoba.',
      productImage,
    };
  });
};

const exploreItems: ExploreItem[] = generateExploreItems();



export default function ExploreSection({
  searchQuery,
  onSearchChange,
  isSearching
}: ExploreSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);




  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % exploreItems.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = useCallback(
    () => setCurrentIndex((prev) => (prev + 1) % exploreItems.length),
    []
  );

  const prevSlide = useCallback(
    () => setCurrentIndex((prev) => (prev - 1 + exploreItems.length) % exploreItems.length),
    []
  );

  const goToSlide = useCallback((index: number) => setCurrentIndex(index), []);

  // Mobile drag
  useEffect(() => {
    if (!sliderRef.current) return;

    let startX: number | null = null;
    const el = sliderRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 1024) return;
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startX) return;
      e.preventDefault();
      const diff = e.touches[0].clientX - startX;
      if (Math.abs(diff) > 100) {
        if (diff > 0) prevSlide();
        else nextSlide();
        startX = null;
      }
    };

    el.addEventListener('touchstart', handleTouchStart);
    el.addEventListener('touchmove', handleTouchMove);
    el.addEventListener('touchend', handleTouchMove);
    el.style.cursor = 'grab';

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove', handleTouchMove);
      el.removeEventListener('touchend', handleTouchMove);
    };
  }, [nextSlide, prevSlide]);

  const currentItem = exploreItems[currentIndex];

  const sectionRef = useGsapSection({
    desktopOnly: true,
    start: 'top 80%',
    end: '10% top',
    scrub: 0.5,
    timeline: (tl) => {
      tl.from('.explore-header', { opacity: 0, y: 50, duration: 0.8 });
      tl.from('.explore-slide', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4');
    },
  });

  return (
    <section
      ref={sectionRef}
      className={`transition-all duration-300 ${isSearching ? "py-6 md:py-10" : "py-16 md:py-20"
        }`}
      id="eksplor"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16 explore-header">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8">
            Explore UMKM Sekitarmu
          </h1>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search makanan, minuman, atau jasa"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-300 focus:border-[#FF885B] focus:outline-none text-gray-700 placeholder-gray-400 transition-all duration-300"
            />
          </div>
        </div>

        {/* Curated Slider */}
        {!isSearching && (
          <div className="relative">
            <div className="relative min-h-[600px] lg:min-h-[750px] explore-slide">
              <div ref={sliderRef} className="absolute inset-0 select-none touch-pan-y">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">

                  {/* Vendor Card */}
                  <div className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer transition-all duration-300">
                    <Image
                      src={currentItem.vendorImage}
                      alt={currentItem.vendorName}
                      fill
                      priority
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">{currentItem.vendorName}</h2>
                      <p className="text-white/90 mb-6 line-clamp-3">{currentItem.vendorDescription}</p>
                      <Link
                        href={`/umkm/${currentItem.umkmId}`}
                        className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-orange-50 shadow-lg"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="hidden lg:flex flex-col gap-6">

                    {/* Review */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 flex items-start gap-4 border border-gray-100">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-orange-200">
                        <Image src={currentItem.review.avatar} alt="User avatar" fill className="object-cover" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-2xl font-bold">{currentItem.review.name}</h3>
                          <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                          <span className="font-bold text-gray-900">{currentItem.review.rating}</span>
                        </div>
                        <p className="text-gray-700 line-clamp-2">&quot;{currentItem.review.text}&quot;</p>
                      </div>
                    </div>

                    {/* Product */}
                    <div className="relative rounded-3xl overflow-hidden shadow-lg flex-1 min-h-[400px] group">
                      <Image
                        src={currentItem.productImage}
                        alt={currentItem.productName}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{currentItem.productName}</h3>
                        <p className="text-white/90 line-clamp-2">{currentItem.productDescription}</p>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {exploreItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 
                    ${index === currentIndex ? 'w-12 bg-orange-500' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        )}


      </div>
    </section>
  );
};
