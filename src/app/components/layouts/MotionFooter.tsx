"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

export default function MotionFooter() {
  const waveRef1 = useRef<SVGPathElement>(null);
  const waveRef2 = useRef<SVGPathElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();


  useEffect(() => {
    if (!lenis) return;

    const ctx = gsap.context(() => {
      // Wave animation loop
      if (waveRef1.current && waveRef2.current) {
        gsap.to([waveRef1.current, waveRef2.current], {
          y: 25,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          duration: 5,
        });
      }

      if (footerRef.current) {
        gsap.to(footerRef.current, {
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller: document.body,
          },
        });
      }

      if (contentRef.current) {
        gsap.from(contentRef.current.children, {
          opacity: 0,
          y: 20,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            scroller: document.body,
          },
        });
      }
    });

    return () => ctx.revert();
  }, [lenis]);

  return (
    <footer
      ref={footerRef}
      id="global-footer"
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 -z-10">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 590"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="sunsetGradient"
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="5%" stopColor="#FF885B" />
              <stop offset="95%" stopColor="#FFD194" />
            </linearGradient>
          </defs>

          <path
            ref={waveRef1}
            d="M 0,600 L 0,200 C 120,220 240,240 360,250 C 480,260 600,250 700,230 C 800,210 900,180 1000,160 C 1100,140 1200,130 1300,150 C 1400,170 1440,200 1440,200 L 1440,600 Z"
            fill="url(#sunsetGradient)"
            fillOpacity="0.45"
          />
          <path
            ref={waveRef2}
            d="M 0,600 L 0,350 C 120,330 240,310 360,320 C 480,330 600,370 720,380 C 840,390 960,360 1080,330 C 1200,300 1320,270 1440,300 L 1440,600 Z"
            fill="url(#sunsetGradient)"
            fillOpacity="0.8"
          />
        </svg>
      </div>

      <div ref={contentRef} className="relative z-10 text-center px-4 pt-24 md:pt-32 pb-12">
        <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-xl"
            style={{
              textShadow:
                "3px 3px 0px rgba(0,0,0,0.25), 1px 1px 0px rgba(0,0,0,0.15)",
            }}
          >
            Dukung Bisnis Lokal
          </h2>
          <p className="text-white/80 text-sm md:text-base font-medium">
            &copy; 2025 UMKM Kita. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}