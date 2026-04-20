'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { umkmDummy, UMKM } from '@/app/data/umkmDummy';
import { getApprovedUMKMs } from '@/lib/appwrite/database';
import ExploreSection from '../sections/ExploreSection';
import ListUMKMSection from '../sections/ListUMKMSection';

export default function ExploreWrapper() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allUMKM, setAllUMKM] = useState<UMKM[]>([...umkmDummy]);

  // Load approved dynamic UMKM from Appwrite and merge with static
  useEffect(() => {
    getApprovedUMKMs().then((approved) => {
      const dynamic: UMKM[] = approved
        .filter(u => u.latitude && u.longitude)
        .map(u => ({
          id: u.$id!,
          name: u.name,
          address: u.address,
          lat: u.latitude!,
          lng: u.longitude!,
          category: u.category || 'Lainnya',
          description: u.description,
          phone: u.phone,
          gallery: u.images && u.images.length > 0 ? u.images : undefined,
        }));
      setAllUMKM([...umkmDummy, ...dynamic]);
    }).catch(() => { });
  }, []);

  const isSearching = searchQuery.trim().length > 0;

  const filtered = useMemo<UMKM[] | null>(() => {
    if (!isSearching) return null;
    const q = searchQuery.toLowerCase();

    return allUMKM.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q)
    );
  }, [searchQuery, isSearching, allUMKM]);

  return (
    <div className="w-full">
      <ExploreSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearching={!!searchQuery}
      />

      {/* Default render OR filtered render */}
      <ListUMKMSection filteredData={filtered} isSearching={isSearching} />
    </div>
  );
}
