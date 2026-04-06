"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Fancy media wrappers: scale reveal on scroll ---
      document.querySelectorAll(".fancy-media-wrapper").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 0.9, opacity: 0.6 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "top 50%",
              scrub: 0.8,
            },
          }
        );
      });

      // --- Social proof stats: staggered parallax ---
      const statsGrid = document.querySelector(".social-proof-stats");
      if (statsGrid) {
        gsap.fromTo(
          statsGrid.children,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsGrid,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.8,
            },
          }
        );
      }

      // --- Generic fade-in elements ---
      document.querySelectorAll(".landing-fade-in").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}
