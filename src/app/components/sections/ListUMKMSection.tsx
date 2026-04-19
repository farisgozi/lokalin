'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { umkmDummy, UMKM } from '@/app/data/umkmDummy';
import useGsapSection from '@/app/motion/hooks/useGsapSection';

interface Props {
  filteredData: UMKM[] | null;
  isSearching?: boolean;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ListUMKMSection({ filteredData, isSearching = false  }: Props) {
  const [randomUmkm, setRandomUmkm] = useState<UMKM[]>([]);
 
  useEffect(() => {
    if (!filteredData) {
      const shuffled = shuffleArray(umkmDummy).slice(0, 6);
      setRandomUmkm(shuffled);
    } else {
      setRandomUmkm(filteredData);
    }
  }, [filteredData]);

  const sectionRef = useGsapSection({
    desktopOnly: true,
    start: 'top 80%',
    end: '10% top',
    scrub: 0.5,
    timeline: (tl: gsap.core.Timeline) => {
      tl.from('.list-header', { opacity: 0, y: 50, duration: 0.8, stagger: 0.1 });
      tl.from('.list-content', { opacity: 0, y: 30, duration: 0.8, stagger: 0.2 }, '-=0.4');
    },
  });

  return (
    <section 
      ref={sectionRef} 
      className={`overflow-hidden transition-all duration-300 ${
        isSearching ? "pt-4 pb-16 md:pt-6 md:pb-20" : "py-16 md:py-20"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8 list-header">
          {filteredData ? "Hasil Pencarian" : "Semua UMKM Pilihan"}
        </h2>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 list-content">
          {randomUmkm.map((item) => {
            const image =
              item.gallery && item.gallery.length > 0
                ? item.gallery[0]
                : 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin';

            return (
              <Link
                key={item.id}
                href={`/umkm/${item.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                {/* Thumbnail */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <Image
                    src={image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <span className="font-bold text-gray-900 text-sm">
                      {item.rating ?? 4.0}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-4">
                    {item.description || 'Deskripsi UMKM belum tersedia.'}
                  </p>

                  {/* Small profile at bottom */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-orange-200">
                      <Image src={image} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-xs line-clamp-1">
                        {item.address}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {randomUmkm.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Tidak ada UMKM yang ditemukan</p>
          </div>
        )}
      </div>
    </section>
  );
};
