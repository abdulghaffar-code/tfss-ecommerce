"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Box, RotateCcw } from "lucide-react";

const CanvasViewer = dynamic(() => import("@/components/three/ModelCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex aspect-square items-center justify-center bg-ink-900">
      <span className="text-xs text-steel-500">Loading 3D model…</span>
    </div>
  ),
});

export function Product3DViewer({
  url,
  name,
  poster,
}: {
  url: string;
  name: string;
  poster: string | null;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-25 blur-sm"
            />
          ) : null}
          <div className="relative flex flex-col items-center px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-flame-500/40 bg-flame-500/10">
              <Box className="size-5 text-flame-400" />
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-white">
              Explore this product in 3D
            </p>
            <p className="mt-1 max-w-xs text-xs text-steel-400">
              An interactive GLB model is available for this line. Loads on
              demand.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-white px-4 text-xs font-semibold text-ink-950 transition hover:bg-steel-100"
            >
              <RotateCcw className="size-3.5" /> Launch 3D viewer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-ink-900">
      <Suspense fallback={<div className="aspect-square animate-pulse bg-ink-850" />}>
        <CanvasViewer url={url} name={name} />
      </Suspense>
      <p className="border-t border-white/10 p-3 text-center text-[10px] uppercase tracking-[0.14em] text-steel-500">
        Drag to rotate · scroll to zoom · genuine GLB model
      </p>
    </div>
  );
}
