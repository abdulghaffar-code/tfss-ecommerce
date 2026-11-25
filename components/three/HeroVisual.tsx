"use client";

import { Component, type ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Box, Move3d, Scan } from "lucide-react";

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

function Fallback() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-radial-flame opacity-70" aria-hidden />
      <div className="relative w-[62%] max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-steel-100 shadow-lift">
        <Image
          src="/products/guardian-hc1-helmet-white/1.webp"
          alt="Guardian HC1 industrial safety helmet"
          width={640}
          height={640}
          className="h-auto w-full object-cover"
          sizes="(max-width: 768px) 60vw, 300px"
        />
      </div>
      <p className="relative mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-steel-400">
        <Scan className="size-3.5" /> Product photography — 3D view unavailable
        on this device
      </p>
    </div>
  );
}

export function HeroVisual() {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowPower, setLowPower] = useState(false);

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

  if (supported === false) return <Fallback />;
  if (supported === null) return <SceneSkeleton />;

  return (
    <SceneBoundary fallback={<Fallback />}>
      <div className="relative h-full w-full">
        <HeroScene reducedMotion={reducedMotion} lowPower={lowPower} />
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-between px-1 text-[9px] uppercase tracking-[0.2em] text-steel-500">
          <span className="flex items-center gap-1.5">
            <Move3d className="size-3" /> Interactive 3D
          </span>
          <span>{lowPower ? "Touch · scroll" : "Move cursor · scroll"}</span>
        </div>
      </div>
    </SceneBoundary>
  );
}
