"use client";

import HeroSection from "./components/sections/HeroSection";
import CategorySection from "./components/sections/CategorySection";
import CeritaSection from "./components/sections/CeritaSection";
import TestimoniSection from "./components/sections/TestimoniSection";
import AboutSection from "./components/sections/AboutSection";
import MapsSection from "./components/sections/MapsSection";
import ExploreWrapper from "./components/layouts/ExploreWrapper";
import LatestUMKMSection from "./components/sections/LatestUMKMSection";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <HeroSection />
      <CategorySection />
      <LatestUMKMSection />
      <ExploreWrapper />
      <MapsSection />
      <CeritaSection />
      <TestimoniSection />
      <AboutSection />
    </div>
  );
}
