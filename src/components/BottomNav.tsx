"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AddChoices } from "@/components/AddChoices";
import { Icon, type IconName } from "@/components/Icon";
import { usePathname } from "next/navigation";
import { ar } from "@/lib/ar";

const items = [
  { href: "/today", label: ar.nav.today, icon: "calendar" },
  { href: "/patients", label: ar.nav.patients, icon: "users" },
  { href: "/add", label: ar.nav.add, icon: "plus" },
  { href: "/more", label: ar.nav.more, icon: "ellipsis" },
] as const satisfies readonly { href: string; label: string; icon: IconName }[];

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
              <span className="nav-icon"><Icon name={item.icon} weight={active ? "bold" : "regular"} /></span>
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
        <span className="nav-icon"><Icon name="plus" weight="bold" /></span>
        <span>{ar.nav.add}</span>
      </button>
      <Link href="/add" className="clinic-nav-link clinic-nav-add-desktop" aria-current={active ? (current ? "page" : "true") : undefined}>
        <span className="nav-icon"><Icon name="plus" weight={active ? "bold" : "regular"} /></span>
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
              <Icon name="x" />
            </button>
          </header>
          <AddChoices onChoose={close} />
        </div>
      </dialog>
    </div>
  );
}

