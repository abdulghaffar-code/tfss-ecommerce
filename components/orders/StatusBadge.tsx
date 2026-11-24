import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const tones: Record<string, string> = {
  PENDING: "border-safety-500/30 bg-safety-500/10 text-safety-400",
  CONFIRMED: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  PROCESSING: "border-violet-400/30 bg-violet-400/10 text-violet-300",
  SHIPPED: "border-flame-500/30 bg-flame-500/10 text-flame-400",
  DELIVERED: "border-success/30 bg-success/10 text-success",
  CANCELLED: "border-danger/30 bg-danger/10 text-danger",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
        tones[status] ?? "border-white/15 bg-white/[0.04] text-steel-300",
        className
      )}
    >
      {ORDER_STATUS_LABELS[status] ?? status}
    </span>
  );
}
