import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-[0.14em] text-steel-500">
      <Link href="/" className="transition hover:text-white">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="size-3 text-steel-600" />
          {item.href ? (
            <Link href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-steel-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
