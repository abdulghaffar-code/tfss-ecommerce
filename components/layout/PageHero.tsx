import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  image?: string;
  crumbs: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.08] bg-ink-900">
      {image ? (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
        </>
      ) : (
        <span className="absolute inset-0 bg-grid-faint bg-[size:64px_64px] opacity-25 [mask-image:radial-gradient(ellipse_at_left,black,transparent_75%)]" />
      )}
      <div className="shell relative py-10 sm:py-14 lg:py-16">
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-6 flex items-center gap-3">
          <span className="h-px w-8 bg-flame-500" aria-hidden />
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.3rem,5vw,4.2rem)] font-semibold leading-[0.98] tracking-tightest">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-steel-300 sm:text-[15px]">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  );
}
