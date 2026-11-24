import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Base = {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
};

export function Field({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: Base & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id || props.name;
  return (
    <div className={cn("w-full", className)}>
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        className={cn("field", error && "border-danger/70")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-steel-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id || props.name;
  return (
    <div className={cn("w-full", className)}>
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <textarea
        id={inputId}
        className={cn("field-area min-h-32", error && "border-danger/70")}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-steel-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  className,
  id,
  children,
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement>) {
  const inputId = id || props.name;
  return (
    <div className={cn("w-full", className)}>
      <label className="field-label" htmlFor={inputId}>
        {label}
      </label>
      <select
        id={inputId}
        className={cn("field appearance-none pr-10", error && "border-danger/70")}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
      {!error && hint ? <p className="mt-1.5 text-xs text-steel-500">{hint}</p> : null}
    </div>
  );
}
