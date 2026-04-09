import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import clsx from "clsx";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, error, className, ...props }, ref) => (
<label className="flex flex-col gap-2 text-sm font-medium text-text">
    {label ? <span>{label}</span> : null}
    <textarea
     ref={ref}
     className={clsx("rounded-[10px] border border-border bg-white px-4 py-3 outline-none focus:ring-4 focus:ring-primary/30", className)}
      {...props}
    />
    {error ? <span className="text-xs text-danger">{error}</span> : null}
  </label>
  )
);

TextArea.displayName = "TextArea";
