"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ar } from "@/lib/ar";

const items = [
  { href: "/today", label: ar.nav.today, icon: TodayIcon },
  { href: "/patients", label: ar.nav.patients, icon: PatientsIcon },
  { href: "/add", label: ar.nav.add, icon: AddIcon, primary: true },
  { href: "/more", label: ar.nav.more, icon: MoreIcon },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-md"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between px-2 pt-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/today" && pathname.startsWith(item.href));
          const Icon = item.icon;
          if ("primary" in item && item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-1 flex-col items-center gap-1 pb-1"
              >
                <span className="flex h-12 w-12 -translate-y-1 items-center justify-center rounded-2xl bg-[var(--primary)] text-white shadow-[0_8px_20px_rgba(15,118,110,0.35)]">
                  <Icon active />
                </span>
                <span className="text-xs font-bold text-[var(--primary)]">
                  {item.label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1 pb-1 ${
                active ? "text-[var(--primary)]" : "text-[var(--muted)]"
              }`}
            >
              <Icon active={active} />
              <span className="text-xs font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
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

function AddIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.4"
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
