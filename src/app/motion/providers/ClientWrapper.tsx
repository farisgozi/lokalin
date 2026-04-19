// ClientWrapper.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { AnimatePresence, motion, cubicBezier } from "framer-motion";
import { ReactLenis, useLenis } from "lenis/react";
import ScrollTriggerProvider from "./ScrollTriggerProvider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ClientWrapperProps {
  children: ReactNode;
  pageKey?: string | number;
}

// Komponen untuk sinkronisasi Lenis → ScrollTrigger
function LenisScrollSync() {
  useLenis(() => ScrollTrigger.update());

  return null;
}

export default function ClientWrapper({ children, pageKey }: ClientWrapperProps) {
  useEffect(() => {
    gsap.defaults({ ease: "power2.out", duration: 0.8 });
    ScrollTrigger.defaults({ markers: false });
  }, []);

  return (
    <ReactLenis
      root
      options={{
        smoothWheel: true,
        lerp: 0.09,
        duration: 1.1,
      }}
    >
      <ScrollTriggerProvider>
        <LenisScrollSync />
        <AnimatePresence mode="wait">
          <motion.div
            key={pageKey ?? "page"}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{
              duration: 0.8,
              ease: cubicBezier(0.25, 0.1, 0.25, 1),
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </ScrollTriggerProvider>
    </ReactLenis>
  );
}