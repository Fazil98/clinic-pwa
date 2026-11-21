"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { ar } from "@/lib/ar";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closingFromParent = useRef(false);
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

  return (
    <dialog
      ref={dialog}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={() => {
        if (closingFromParent.current) return;
        onCancel();
        restoreFocus();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className="confirm-dialog-panel">
        <h2 id={titleId}>{title}</h2>
        <p id={descriptionId}>{description}</p>
        <div className="confirm-actions">
          <button
            ref={cancelButton}
            type="button"
            className="clinic-button clinic-button--secondary"
            onClick={onCancel}
          >
            {ar.common.cancel}
          </button>
          <button
            type="button"
            className="clinic-button clinic-button--danger"
            onClick={() => {
              const node = dialog.current;
              if (node?.open) {
                closingFromParent.current = true;
                node.close();
                closingFromParent.current = false;
              }
              onConfirm();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
