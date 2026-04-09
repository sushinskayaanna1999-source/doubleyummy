import type { FC, PropsWithChildren } from "react";

export const Modal: FC<PropsWithChildren<{ open: boolean; onClose: () => void; title: string }>> = ({
  open,
  onClose,
  title,
  children
}) =>
  open ? (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-4 sm:items-center sm:justify-center">
      <div className="w-full max-w-md rounded-[24px] bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="text-textLight">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  ) : null;
