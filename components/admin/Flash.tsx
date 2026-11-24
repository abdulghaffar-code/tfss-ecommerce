import { AlertCircle, CheckCircle2 } from "lucide-react";

export function Flash({
  saved,
  error,
}: {
  saved?: string;
  error?: string;
}) {
  if (!saved && !error) return null;
  const message = error || saved;
  const isError = Boolean(error);
  return (
    <div
      role={isError ? "alert" : "status"}
      className={
        isError
          ? "mb-5 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-red-200"
          : "mb-5 flex items-start gap-2.5 rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-green-100"
      }
    >
      {isError ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <span>{message}</span>
    </div>
  );
}
