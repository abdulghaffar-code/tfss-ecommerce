"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-danger/30 bg-danger/10">
          <AlertTriangle className="size-5 text-danger" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-white">
          Something went wrong at the counter.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-steel-400">
          The page could not be completed. No order has been placed or changed by
          this error. Try again, or contact us if it keeps happening.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-flame-500 px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            <RotateCcw className="size-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-white/20 px-5 font-display text-sm font-semibold text-white transition hover:border-white/40"
          >
            Back home
          </Link>
        </div>
        {error.digest ? (
          <p className="mt-5 font-mono text-[10px] text-steel-600">Ref: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
