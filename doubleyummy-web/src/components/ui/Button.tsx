import type { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  fullWidth?: boolean;
};

export const Button: FC<Props> = ({ children, className, variant = "primary", fullWidth, ...props }) => (
  <button
    className={clsx(
      "min-h-11 rounded-button px-4 py-3 text-sm font-semibold transition disabled:opacity-50",
      variant === "primary" && "bg-primary text-white hover:bg-primaryHover",
      variant === "secondary" && "bg-secondary text-text",
      variant === "ghost" && "border border-border bg-white text-text",
      variant === "danger" && "bg-danger text-white",
      fullWidth && "w-full",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
