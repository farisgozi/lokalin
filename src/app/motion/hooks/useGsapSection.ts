import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxElement {
  selector: string;
  speed: number;
  depth: number;
}

interface UseGsapSectionOptions {
  desktopOnly?: boolean;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  timeline?: (tl: gsap.core.Timeline) => void;
  parallax?: ParallaxElement[];
}

export default function useGsapSection(options: UseGsapSectionOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined') return;

    const {
      desktopOnly = false,
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      timeline,
      parallax
    } = options;

    // Skip animation on mobile if desktopOnly is true
    if (desktopOnly && window.innerWidth < 1024) {
      return;
    }

    const ctx = gsap.context(() => {
      // Handle parallax elements
      if (parallax && parallax.length > 0) {
        parallax.forEach(({ selector, speed, depth }) => {
          const elements = ref.current?.querySelectorAll(selector);
          if (elements) {
            elements.forEach((element) => {
              gsap.to(element, {
                y: () => -window.innerHeight * speed * depth,
                ease: "none",
                scrollTrigger: {
                  trigger: ref.current,
                  start,
                  end,
                  scrub: true,
                },
              });
            });
          }
        });
      }

      // Handle timeline animations
      if (timeline) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start,
            end,
            scrub,
          }
        });
        
        timeline(tl);
      }
    }, ref);

    return () => ctx.revert();
  }, [options.desktopOnly, options.start, options.end, options.scrub, options.timeline]);

  return ref;
}
