'use client';

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

import { MapControls } from './MapControls';
import { MapStyleSelector } from './MapStyleSelector';
import { MapFilters } from './MapFilters';
import { createLucideIconMarker } from '../../lib/leaflet-icons';
import { umkmDummy, UMKM as UMKMType } from '../../data/umkmDummy';
import { getDistanceKm, getCategoryIcon } from '../../lib/map-utils';
import { UMKMPopupCard } from '../layouts/UMKMPopUpCard';
import { getApprovedUMKMs } from '@/lib/appwrite/database';

export default function MapComponent() {
  const mapRef = useRef<L.Map | null>(null);

  const [mapStyle, setMapStyle] = useState(
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  );
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeUMKM, setActiveUMKM] = useState<UMKMType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterRadius, setFilterRadius] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [umkmList, setUmkmList] = useState<UMKMType[]>([...umkmDummy]);

  /* === Responsive vh fix & Mobile Detection === */
  useEffect(() => {
    const setVh = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    setVh();
    checkMobile();
    window.addEventListener('resize', setVh);
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Load approved UMKM from Appwrite (or localStorage fallback) and merge with static
  useEffect(() => {
    async function loadDynamic() {
      try {
        const approved = await getApprovedUMKMs();
        const dynamic: UMKMType[] = approved
          .filter((u) => u.latitude && u.longitude)
          .map((u) => ({
            id: u.$id!,
            name: u.name,
            address: u.address,
            lat: u.latitude!,
            lng: u.longitude!,
            category: u.category || 'Lainnya',
            description: u.description,
            phone: u.phone,
            gallery: u.images && u.images.length > 0 ? u.images : undefined,
            openHours: u.open_hours
              ? { open: u.open_hours.split('-')[0]?.trim() || '', close: u.open_hours.split('-')[1]?.trim() || '', days: ['Setiap Hari'] }
              : undefined,
          }));
        setUmkmList([...umkmDummy, ...dynamic]);
      } catch (err) {
        console.error('Failed to load dynamic UMKM:', err);
      }
    }
    loadDynamic();
  }, []);

  const filteredData = useMemo(() => {
    return umkmList
      .filter(d => activeCategory === 'All' || d.category === activeCategory)
      .filter(d => !searchQuery.trim() || d.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(d => !filterRadius || !userLocation || getDistanceKm(userLocation.lat, userLocation.lng, d.lat, d.lng) <= 5);
  }, [umkmList, activeCategory, searchQuery, filterRadius, userLocation]);

  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) return alert('Browser tidak mendukung geolocation');
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setFilterRadius(true);
      },
      () => alert('Gagal mendapatkan lokasi. Aktifkan izin lokasi pada browser Anda.'),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  /* === Marker Click === */
  const onMarkerClick = useCallback(
    (m: UMKMType) => {
      setActiveUMKM(m);
      if (!isMobile) {
        mapRef.current?.flyTo([m.lat, m.lng], 15, { duration: 1.2 });
      }
    },
    [isMobile]
  );

  /* === Recenter Component === */
  const Recenter: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => { map.flyTo([lat, lng], 14, { duration: 1.2 }); }, [lat, lng, map]);
    return null;
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl"
      style={{ height: `calc(var(--vh,1vh)*60)` }}
    >
      <MapContainer
        ref={mapRef}
        center={[-6.1753924, 106.8271528]}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full z-10 transition-all duration-500"
      >
        <TileLayer url={mapStyle} />
        {userLocation && <Recenter lat={userLocation.lat} lng={userLocation.lng} />}

        {/* Radius Circle */}
        <AnimatePresence>
          {userLocation && filterRadius && (
            <motion.div
              key="radius"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.28, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            >
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={5000}
                pathOptions={{ color: '#FF9E6B', fillColor: '#FF9E6B', fillOpacity: 0.18 }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Markers */}
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {filteredData.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                <Marker
                  position={[item.lat, item.lng]}
                  eventHandlers={{
                    click: () => onMarkerClick(item),
                    mouseover: () => setHoveredId(item.id),
                    mouseout: () => setHoveredId(null),
                  }}
                  icon={getCategoryIcon(item, hoveredId)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </LayoutGroup>

        {/* User Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createLucideIconMarker(
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>,
              '#2563EB'
            )}
          />
        )}
      </MapContainer>

      {/* Controls */}
      <MapFilters
        categories={['All', 'Makanan', 'Minuman', 'Fashion', 'Kedai Kopi']}
        activeCategory={activeCategory}
        onFilter={setActiveCategory}
        onSearch={setSearchQuery}
        filterRadius={filterRadius}
        userLocation={userLocation}
        onToggleRadius={() => (userLocation ? setFilterRadius(p => !p) : handleLocateUser())}
      />
      <MapStyleSelector setMapStyle={setMapStyle} />
      <MapControls onLocate={handleLocateUser} />

      {/* Bottom Popup Card */}
      <AnimatePresence>
        {activeUMKM && (
          <UMKMPopupCard
            key={activeUMKM.id}
            umkm={activeUMKM}
            isMobile={isMobile}
            onClose={() => setActiveUMKM(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
