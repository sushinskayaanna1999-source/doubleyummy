import type { FC, ReactNode } from "react";

export const TopBar: FC<{ title: string; left?: ReactNode; right?: ReactNode }> = ({ title, left, right }) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <div className="w-10">{left}</div>
    <h1 className="flex-1 text-center text-lg font-semibold">{title}</h1>
    <div className="flex w-10 justify-end">{right}</div>
  </div>
);
