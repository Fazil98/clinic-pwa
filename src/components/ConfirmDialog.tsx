"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { ar } from "@/lib/ar";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  busy?: boolean;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closingFromParent = useRef(false);
  const locked = useRef(false);
  const titleId = useId();
  const descriptionId = useId();

  const restoreFocus = useCallback(() => {
    const target = returnFocus.current;
    if (target?.isConnected) target.focus();
    else document.getElementById("clinic-main")?.focus();
  }, []);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      node.showModal();
      cancelButton.current?.focus();
    }
    return () => {
      if (!node.open) return;
      closingFromParent.current = true;
      node.close();
      closingFromParent.current = false;
      restoreFocus();
    };
  }, [open, restoreFocus]);

  useEffect(() => {
    if (!busy) locked.current = false;
    else panel.current?.focus();
  }, [busy]);

  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-busy={busy || undefined}
      onCancel={(event) => {
        if (busy) event.preventDefault();
      }}
      onClose={() => {
        if (closingFromParent.current) return;
        if (busy) return;
        onCancel();
        restoreFocus();
      }}
      onClick={(event) => {
        if (busy) return;
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div ref={panel} className="confirm-dialog-panel" tabIndex={-1}>
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        {error ? <p className="confirm-error" role="alert">{error}</p> : null}
        <div className="confirm-actions">
          <button
            ref={cancelButton}
            type="button"
            className="clinic-button clinic-button--secondary"
            onClick={onCancel}
            disabled={busy}
          >
            {ar.common.cancel}
          </button>
          <button
            type="button"
            className="clinic-button clinic-button--danger"
            disabled={busy}
            onClick={() => {
              if (busy || locked.current) return;
              locked.current = true;
              onConfirm();
            }}
          >
            {busy ? ar.common.deleting : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
