"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

type GalleryImage = { id: string; url: string; alt: string | null };

export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowLeft")
        setActive((current) => (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight")
        setActive((current) => (current + 1) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-white/10 bg-steel-100 text-sm text-ink-600">
        Product image coming soon
      </div>
    );
  }

  const current = images[active];

  return (
    <>
      <div className="space-y-3">
        <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-steel-100">
          <Image
            key={current.id}
            src={current.url}
            alt={current.alt || name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Open image full screen"
            className="absolute bottom-4 right-4 flex h-10 items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-900 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <Expand className="size-3.5" /> View
          </button>
          <span className="absolute left-4 top-4 rounded bg-ink-950/80 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white">
            Sample product
          </span>
        </div>

        {images.length > 1 ? (
          <div className="grid grid-cols-5 gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border bg-steel-100 transition",
                  index === active
                    ? "border-flame-500"
                    : "border-white/10 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-ink-950/95 p-4 backdrop-blur"
            role="dialog"
            aria-modal="true"
            aria-label={`${name} image viewer`}
          >
            <div className="flex items-center justify-between pb-3">
              <p className="text-xs uppercase tracking-[0.16em] text-steel-400">
                {active + 1} / {images.length}
              </p>
              <button
                type="button"
                onClick={() => setLightbox(false)}
                aria-label="Close image viewer"
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:bg-white/10"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <Image
                src={current.url}
                alt={current.alt || name}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {images.length > 1 ? (
              <div className="flex justify-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    setActive((v) => (v - 1 + images.length) % images.length)
                  }
                  aria-label="Previous image"
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={() => setActive((v) => (v + 1) % images.length)}
                  aria-label="Next image"
                  className="flex size-11 items-center justify-center rounded-full border border-white/15 text-white"
                >
                  <ChevronRight />
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
