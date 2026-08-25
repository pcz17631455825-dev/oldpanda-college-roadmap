"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HomeMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduce) return;
      const select = gsap.utils.selector(scope);
      gsap.fromTo(select(".motion-hero-copy"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.72, ease: "power2.out" });
      gsap.fromTo(select(".motion-portrait"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.86, delay: 0.08, ease: "power2.out" });
      gsap.fromTo(select(".motion-intro"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power2.out", scrollTrigger: { trigger: select(".motion-intro")[0], start: "top 78%", toggleActions: "play none none reverse" } });
      gsap.fromTo(select(".motion-route"), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: select(".education-routes")[0], start: "top 80%", toggleActions: "play none none reverse" } });
      gsap.fromTo(select(".motion-resource"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power2.out", scrollTrigger: { trigger: select(".motion-resource")[0], start: "top 78%", toggleActions: "play none none reverse" } });
      return undefined;
    });
    return () => media.revert();
  }, { scope });

  return <div ref={scope}>{children}</div>;
}
