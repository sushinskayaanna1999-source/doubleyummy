import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

export const Chip: FC<PropsWithChildren<{ selected?: boolean; onClick?: () => void; className?: string }>> = ({
  children,
  selected,
  onClick,
  className
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "min-h-11 rounded-chip border px-4 py-2 text-sm transition",
      selected ? "border-primary bg-primary text-white" : "border-border bg-white text-text",
      className
    )}
  >
    {children}
  </button>
);
