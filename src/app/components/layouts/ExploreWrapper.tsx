'use client';

import React, { useState, useMemo } from 'react';
import { umkmDummy, UMKM } from '@/app/data/umkmDummy';
import ExploreSection from '../sections/ExploreSection';
import ListUMKMSection from '../sections/ListUMKMSection';

export default function ExploreWrapper() {
  const [searchQuery, setSearchQuery] = useState('');

  const isSearching = searchQuery.trim().length > 0;

  const filtered = useMemo<UMKM[] | null>(() => {
    if (!isSearching) return null;
    const q = searchQuery.toLowerCase();

    return umkmDummy.filter((u) =>
      u.name.toLowerCase().includes(q) ||
      u.category.toLowerCase().includes(q) ||
      u.address.toLowerCase().includes(q)
    );
  }, [searchQuery, isSearching]);

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
