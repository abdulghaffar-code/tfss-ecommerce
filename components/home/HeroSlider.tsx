"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Slide = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  href: string | null;
  ctaLabel: string | null;
};

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (next: number) => {
      if (slides.length === 0) return;
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (paused || reduce || slides.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, reduce, slides.length]);

  useEffect(() => {
    const node = regionRef.current;
    if (!node) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
    };
    node.addEventListener("keydown", onKey);
    return () => node.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (slides.length === 0) return null;
  const active = slides[index];

  return (
    <div
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Safety in the field"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900"
    >
      <div className="relative aspect-[16/11] w-full sm:aspect-[16/9] lg:aspect-[2.35/1]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={active.imageUrl}
              alt={active.title}
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 100vw, 1400px"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/10 to-ink-950/30"
          aria-hidden
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6">
          <p className="rounded-full border border-white/20 bg-ink-950/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
            Field catalogue · {String(index + 1).padStart(2, "0")} /{" "}
            {String(slides.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous slide"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-ink-950/50 text-white backdrop-blur transition hover:bg-ink-950/80"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next slide"
              className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-ink-950/50 text-white backdrop-blur transition hover:bg-ink-950/80"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
          <div className="max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-flame-400">
                  {active.title}
                </p>
                <p className="mt-1.5 text-sm text-white/90 sm:text-[15px]">
                  {active.subtitle}
                </p>
              </motion.div>
            </AnimatePresence>
            {active.href ? (
              <Link
                href={active.href}
                className="mt-3 inline-flex items-center gap-1.5 border-b border-white/40 pb-1 text-xs font-semibold text-white transition hover:border-flame-500 hover:text-flame-300"
              >
                {active.ctaLabel || "Explore"}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5" role="tablist" aria-label="Choose slide">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${slide.title}`}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index
                    ? "w-7 bg-flame-500"
                    : "w-3 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
