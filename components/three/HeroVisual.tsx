"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Box, Move3d, Scan } from "lucide-react";

export type ShowcaseImage = {
  src: string;
  category: string;
};

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <SceneSkeleton />,
});

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("3D scene unavailable:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function SceneSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="relative size-44">
        <div className="absolute inset-0 animate-ping rounded-full border border-flame-500/20" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Box className="size-6 text-flame-500/60" />
        </div>
      </div>
    </div>
  );
}

function Fallback({ image }: { image: ShowcaseImage | null }) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial-flame opacity-70" aria-hidden />
      {image ? (
        <div className="relative w-[62%] max-w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-ink-950 shadow-lift">
          <Image
            src={image.src}
            alt={`${image.category} 3D product render`}
            width={900}
            height={900}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 60vw, 320px"
          />
        </div>
      ) : null}
      <p className="relative mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-steel-400">
        <Scan className="size-3.5" /> {image ? image.category : "Product render"} — 3D view unavailable
        on this device
      </p>
    </div>
  );
}

export function HeroVisual({ images }: { images: ShowcaseImage[] }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motion.matches);
    setLowPower(window.matchMedia("(max-width: 767px)").matches);
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    motion.addEventListener("change", onChange);
    return () => motion.removeEventListener("change", onChange);
  }, []);

  // Advance the showcase every five seconds.
  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  // Warm the browser cache for the next render so the 3D swap is instant.
  useEffect(() => {
    if (images.length < 2) return;
    const next = images[(index + 1) % images.length];
    const preload = new window.Image();
    preload.src = next.src;
  }, [index, images]);

  const active = images[index] ?? null;

  if (supported === false) return <Fallback image={active} />;
  if (supported === null) return <SceneSkeleton />;

  return (
    <SceneBoundary fallback={<Fallback image={active} />}>
      <div className="relative h-full w-full">
        <HeroScene
          imageSrc={active?.src ?? null}
          reducedMotion={reducedMotion}
          lowPower={lowPower}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-between px-1 text-[9px] uppercase tracking-[0.2em] text-steel-500">
          <span className="flex items-center gap-1.5">
            <Move3d className="size-3" /> {active ? active.category : "Interactive 3D"}
          </span>
          <span>
            {images.length
              ? `${String(index + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`
              : "5s rotation"}
          </span>
        </div>
      </div>
    </SceneBoundary>
  );
}
