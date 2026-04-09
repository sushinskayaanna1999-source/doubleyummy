import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

export const Badge: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <span className={clsx("inline-flex rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-text shadow-sm", className)}>{children}</span>
);
