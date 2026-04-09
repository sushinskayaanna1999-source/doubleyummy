import type { FC, ReactNode } from "react";

export const EmptyState: FC<{ title: string; description: string; action?: ReactNode }> = ({
  title,
  description,
  action
}) => (
  <div className="rounded-card border border-dashed border-border bg-white p-6 text-center shadow-card">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-textLight">{description}</p>
    {action ? <div className="mt-4">{action}</div> : null}
  </div>
);
