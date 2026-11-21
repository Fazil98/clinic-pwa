"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AddChoices } from "@/components/AddChoices";
import { usePathname } from "next/navigation";
import { ar } from "@/lib/ar";

const items = [
  { href: "/today", label: ar.nav.today, icon: TodayIcon },
  { href: "/patients", label: ar.nav.patients, icon: PatientsIcon },
  { href: "/add", label: ar.nav.add, icon: AddIcon },
  { href: "/more", label: ar.nav.more, icon: MoreIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  const entry = pathname === "/patients/new" || /^\/patients\/[^/]+\/(edit|visit|note)$/.test(pathname);

  return (
    <nav className="clinic-nav" data-entry={entry || undefined} aria-label={ar.common.navigation}>
      <div className="clinic-nav-items">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          if (item.href === "/add") {
            return <AddNavItem key={`add-${pathname}`} active={active} current={pathname === item.href} />;
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="clinic-nav-link"
              aria-current={active ? (pathname === item.href ? "page" : "true") : undefined}
            >
              <span className="nav-icon"><Icon active={active} /></span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function AddNavItem({ active, current }: { active: boolean; current: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);

  function show() {
    dialog.current?.showModal();
    setOpen(true);
  }

  function close() {
    dialog.current?.close();
  }

  return (
    <div className="add-nav-item">
      <button
        className="clinic-nav-link clinic-nav-add-mobile"
        type="button"
        ref={trigger}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-current={active ? (current ? "page" : "true") : undefined}
        onClick={show}
      >
        <span className="nav-icon"><AddIcon active /></span>
        <span>{ar.nav.add}</span>
      </button>
      <Link href="/add" className="clinic-nav-link clinic-nav-add-desktop" aria-current={active ? (current ? "page" : "true") : undefined}>
        <span className="nav-icon"><AddIcon active={active} /></span>
        <span>{ar.nav.add}</span>
      </Link>
      <dialog
        ref={dialog}
        className="add-sheet"
        aria-labelledby={titleId}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="add-sheet-content">
          <div className="sheet-handle" aria-hidden="true" />
          <header className="sheet-header">
            <h2 id={titleId}>{ar.add.title}</h2>
            <button type="button" className="icon-button" onClick={close} aria-label={ar.common.close} autoFocus>
              <span aria-hidden="true">×</span>
            </button>
          </header>
          <AddChoices onChoose={close} />
        </div>
      </dialog>
    </div>
  );
}

function TodayIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M3 10h18M8 3v4M16 3v4"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function PatientsIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="9"
        cy="9"
        r="3.2"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M3.5 19c.6-3 2.8-4.5 5.5-4.5S14 16 14.5 19"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
      <circle
        cx="17"
        cy="9.5"
        r="2.4"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
      />
      <path
        d="M16 14.5c2 .2 3.4 1.3 4 3.5"
        stroke="currentColor"
        strokeWidth={active ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function AddIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth={active ? 2.4 : 1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoreIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="6" cy="12" r={active ? 2 : 1.7} fill="currentColor" />
      <circle cx="12" cy="12" r={active ? 2 : 1.7} fill="currentColor" />
      <circle cx="18" cy="12" r={active ? 2 : 1.7} fill="currentColor" />
    </svg>
  );
}
