"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "framer-motion";

const line =
  "The right equipment does not make a job safe. The right equipment, used without compromise, does.";

export function ScrollStatement() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const words = root.current.querySelectorAll<HTMLElement>("[data-word]");
    const context = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.14, y: 8 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 78%",
            end: "bottom 48%",
            scrub: 0.6,
          },
        }
      );
      gsap.to("[data-statement-glow]", {
        opacity: 0.9,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => context.revert();
  }, [reduce]);

  return (
    <div ref={root} className="relative overflow-hidden py-20 sm:py-28">
      <span
        data-statement-glow
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-500/[0.09] opacity-40 blur-[110px]"
      />
      <div className="shell relative">
        <p className="eyebrow">The standard</p>
        <p className="mt-6 max-w-5xl font-display text-[clamp(1.7rem,4.2vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white">
          {line.split(" ").map((word, index) => (
            <span key={`${word}-${index}`} data-word className="inline-block">
              {word}&nbsp;
            </span>
          ))}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.18em] text-steel-500">
          <span>Protect</span>
          <span className="size-1 rounded-full bg-flame-500" />
          <span>Prevent</span>
          <span className="size-1 rounded-full bg-flame-500" />
          <span>Perform</span>
        </div>
      </div>
    </div>
  );
}
