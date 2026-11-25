import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <Link href="/" className="inline-block">
          <Image
            src="/brand/logo.png"
            alt="Total Fire & Safety Solution"
            width={512}
            height={512}
            className="mx-auto h-16 w-auto object-contain"
          />
        </Link>
        <p
          aria-hidden
          className="mt-10 font-display text-[clamp(5rem,20vw,9rem)] font-bold leading-none tracking-tightest text-outline"
        >
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          This page is not in the catalogue.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-steel-400">
          The link may be old, or the product may have been moved or archived. Try
          the catalogue search or talk to the counter.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-flame-500 px-5 font-display text-sm font-semibold text-ink-950 transition hover:bg-flame-400"
          >
            <Search className="size-4" /> Browse products
          </Link>
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/20 px-5 font-display text-sm font-semibold text-white transition hover:border-white/40"
          >
            <ArrowLeft className="size-4" /> Back home
          </Link>
        </div>
        <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-steel-600">
          Need help?{" "}
          <a href="tel:+922132434289" className="text-steel-400 hover:text-white">
            +92-21-32434289
          </a>
        </p>
      </div>
    </div>
  );
}
