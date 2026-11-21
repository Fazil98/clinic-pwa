"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ar } from "@/lib/ar";

export function MedicalThumb({
  src,
  label,
  when,
  whenLabel,
  onDelete,
  deleteDisabled,
}: {
  src: string;
  label: string;
  when?: string;
  whenLabel?: string;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
      closeButton.current?.focus();
    }
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <figure className="medical-image">
      <button
        type="button"
        className="medical-thumb"
        aria-label={`${ar.patient.imagesOpen}: ${label}`}
        onClick={() => setOpen(true)}
      >
        <img src={src} alt="" />
      </button>
      <figcaption>
        <strong>{label}</strong>
        {when && whenLabel ? <time dateTime={when}>{whenLabel}</time> : null}
        {onDelete ? (
          <button
            type="button"
            className="timeline-delete"
            onClick={onDelete}
            disabled={deleteDisabled}
          >
            {ar.patient.imagesDelete}
          </button>
        ) : null}
      </figcaption>
      <dialog
        ref={dialog}
        className="medical-viewer"
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}
      >
        <p id={titleId} className="sr-only">{`${ar.patient.imagesTitle}: ${label}`}</p>
        <button
          ref={closeButton}
          type="button"
          className="clinic-button clinic-button--secondary medical-viewer-close"
          onClick={() => setOpen(false)}
        >
          {ar.common.close}
        </button>
        <img
          src={src}
          alt={`${ar.patient.imagesTitle}: ${label}`}
          onClick={() => setOpen(false)}
        />
      </dialog>
    </figure>
  );
}
