import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

type Props =  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className, ...props }, ref) => (
    <label className="flex flex-col gap-2 text-sm font-medium text-text">
      {label ? <span>{label}</span> : null}
      <input ref={ref} className={clsx("min-h-11 rounded-[10px] border border-border bg-white px-4 py-3 outline-none ring-primary/30 focus:ring-4", className)} {...props} />
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>

  )
);

Input.displayName = "Input";
