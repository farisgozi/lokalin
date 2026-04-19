// ScrollTriggerProvider.tsx
"use client";

import { createContext, useContext, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollTriggerContext = createContext({ refresh: () => {} });

export function useScrollTrigger() {
  return useContext(ScrollTriggerContext);
}

export default function ScrollTriggerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // Refresh saat resize atau font selesai loading
    window.addEventListener("resize", refresh);
    document.fonts?.addEventListener?.("loadingdone", refresh);

    // Refresh awal
    refresh();

    return () => {
      window.removeEventListener("resize", refresh);
      document.fonts?.removeEventListener?.("loadingdone", refresh);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <ScrollTriggerContext.Provider value={{ refresh: () => ScrollTrigger.refresh() }}>
      {children}
    </ScrollTriggerContext.Provider>
  );
}