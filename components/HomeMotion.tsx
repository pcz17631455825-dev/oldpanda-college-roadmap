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
    const root = scope.current;
    let transitionTimer: ReturnType<typeof setTimeout> | undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest<HTMLElement>("[data-scroll-transfer], [data-page-transition]");
      if (!target || !root) return;
      if (target.matches("[data-scroll-transfer]")) {
        event.preventDefault();
        root.querySelector("#transfer-section")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        return;
      }
      const href = target.getAttribute("href");
      if (!href) return;
      event.preventDefault();
      const overlay = root.querySelector<HTMLElement>(".education-page-transition");
      const message = overlay?.querySelector<HTMLElement>("[data-transition-message]");
      if (message) message.textContent = target.dataset.transitionCopy || "老熊猫正在打开测评";
      overlay?.classList.add("is-active");
      overlay?.setAttribute("aria-hidden", "false");
      transitionTimer = setTimeout(() => window.location.assign(href), reduced ? 300 : 460);
    };
    root?.addEventListener("click", handleClick);
    root?.setAttribute("data-home-ready", "true");
    media.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduce) return;
      const select = gsap.utils.selector(scope);
      gsap.fromTo(select(".motion-hero-copy"), { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.72, ease: "power2.out" });
      gsap.fromTo(select(".motion-portrait"), { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.86, delay: 0.08, ease: "power2.out" });
      const intro = select(".motion-intro")[0];
      const resource = select(".motion-resource")[0];
      if (intro) gsap.fromTo(intro, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.62, ease: "power2.out", scrollTrigger: { trigger: intro, start: "top 78%", toggleActions: "play none none reverse" } });
      if (resource) gsap.fromTo(resource, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.58, ease: "power2.out", scrollTrigger: { trigger: resource, start: "top 78%", toggleActions: "play none none reverse" } });
      return undefined;
    });
    return () => {
      root?.removeEventListener("click", handleClick);
      root?.removeAttribute("data-home-ready");
      if (transitionTimer) clearTimeout(transitionTimer);
      media.revert();
    };
  }, { scope });

  return <div ref={scope}>{children}</div>;
}
