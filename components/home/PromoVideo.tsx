"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export function PromoVideo() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      {playing ? (
        <video
          ref={videoRef}
          src="/video/company-promo.mp4"
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black"
        >
          Your browser does not support embedded video.{" "}
          <a href="/video/company-promo.mp4" className="underline">
            Download the company film
          </a>
          .
        </video>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group relative block aspect-video w-full text-left"
          aria-label="Play the 77 second company film"
        >
          <Image
            src="/hero/slider-05.webp"
            alt="Industrial safety equipment supplied by Total Fire & Safety Solution"
            fill
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
          <span className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-ink-950/50 backdrop-blur-md transition group-hover:border-flame-500 group-hover:bg-flame-500">
            <Play className="ml-0.5 size-5 fill-white text-white transition group-hover:fill-ink-950 group-hover:text-ink-950" />
          </span>
          <span className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
            <span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-flame-400">
                Company film · 77 seconds
              </span>
              <span className="mt-1 block font-display text-lg font-semibold text-white">
                Inside the safety house
              </span>
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.16em] text-steel-400 sm:block">
              Sound on
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
