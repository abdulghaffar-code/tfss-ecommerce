import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "error" ? AlertCircle : tone === "success" ? CheckCircle2 : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
        tone === "error" && "border-danger/30 bg-danger/10 text-red-200",
        tone === "success" && "border-success/30 bg-success/10 text-green-100",
        tone === "info" && "border-white/15 bg-white/[0.04] text-steel-300",
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="min-w-0 leading-relaxed">{children}</div>
    </div>
  );
}
