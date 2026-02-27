"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  // Sync open state with the native <dialog> element
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Close on native dialog close event (Esc key)
  React.useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      aria-describedby={description ? "modal-description" : undefined}
      onClick={handleBackdropClick}
      className={cn(
        "w-full max-w-lg rounded-xl border border-slate-200 bg-white p-0 shadow-xl",
        "dark:border-slate-700 dark:bg-slate-900",
        // Backdrop styles via CSS ::backdrop (Tailwind can't target this natively)
        "backdrop:bg-black/50 backdrop:backdrop-blur-sm",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        className,
      )}
    >
      <div className="flex flex-col divide-y divide-slate-200 dark:divide-slate-700">
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 px-6 py-4">
            <div className="flex flex-col gap-1">
              {title && (
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-slate-900 dark:text-slate-50"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="text-sm text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className={cn(
                "rounded-md p-1 text-slate-400 transition-colors",
                "hover:bg-slate-100 hover:text-slate-700",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900",
                "dark:hover:bg-slate-800 dark:hover:text-slate-200",
              )}
            >
              {/* X icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </dialog>
  );
}
