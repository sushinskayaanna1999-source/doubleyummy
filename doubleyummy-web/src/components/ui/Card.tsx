import type { FC, PropsWithChildren } from "react";
import clsx from "clsx";

export const Card: FC<PropsWithChildren<{ className?: string }>> = ({ children, className }) => (
  <div className={clsx("rounded-card bg-surface p-4 shadow-card", className)}>{children}</div>
);
