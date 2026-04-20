'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { getApprovedUMKMs, type UMKMDocument } from '@/lib/appwrite/database';

const defaultImage = 'https://syd.cloud.appwrite.io/v1/storage/buckets/umkm-images/files/umkm-placeholder/view?project=6861b5e20027ba386475&mode=admin';

const categoryColors: Record<string, string> = {
    'Makanan': 'from-orange-400 to-red-400',
    'Minuman': 'from-blue-400 to-cyan-400',
    'Kedai Kopi': 'from-amber-600 to-yellow-500',
    'Fashion': 'from-pink-400 to-purple-400',
    'Jasa': 'from-emerald-400 to-teal-400',
    'Kerajinan': 'from-indigo-400 to-violet-400',
    'Lainnya': 'from-gray-400 to-slate-400',
};

export default function LatestUMKMSection() {
    const [dynamicUMKMs, setDynamicUMKMs] = useState<UMKMDocument[]>([]);

    useEffect(() => {
        getApprovedUMKMs().then(setDynamicUMKMs).catch(() => setDynamicUMKMs([]));
    }, []);

    if (dynamicUMKMs.length === 0) return null;

    return (
        <section className="py-16 md:py-20">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">UMKM Terbaru</h2>
                        <p className="text-gray-500 text-sm mt-1">UMKM baru yang telah diverifikasi oleh admin</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dynamicUMKMs.map((umkm) => {
                        const thumbnail = umkm.images && umkm.images.length > 0 ? umkm.images[0] : defaultImage;
                        const colorGradient = categoryColors[umkm.category] || categoryColors['Lainnya'];

                        return (
                            <Link
                                key={umkm.$id}
                                href={`/umkm/${umkm.$id}`}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                {/* Thumbnail */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={thumbnail}
                                        alt={umkm.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colorGradient} shadow-md`}>
                                        {umkm.category}
                                    </span>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                                        {umkm.name}
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
                                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span className="truncate">{umkm.address}</span>
                                    </div>
                                    {umkm.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{umkm.description}</p>
                                    )}
                                    <div className="flex items-center gap-1.5 text-orange-500 font-semibold text-sm">
                                        Lihat Detail
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
