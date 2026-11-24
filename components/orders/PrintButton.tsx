"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="flex h-9 items-center gap-2 rounded-lg border border-white/15 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-steel-300 transition hover:border-white/35 hover:text-white print:hidden"
    >
      <Printer className="size-3.5" /> Print
    </button>
  );
}
