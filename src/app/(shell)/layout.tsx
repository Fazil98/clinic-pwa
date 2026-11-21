import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { ar } from "@/lib/ar";

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="clinic-shell">
      <a href="#clinic-main" className="skip-link">{ar.common.skipToContent}</a>
      <div className="clinic-sidebar">
        <div className="clinic-brand">
          <Link href="/today" className="clinic-brand-link">
            <span className="clinic-mark" aria-hidden="true">
              <svg className="clinic-mark-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="8.7" cy="4.35" r="2" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M6.35 10.15c.15-1.15 1.05-2 2.2-2.15.55 0 1.05.2 1.45.55.85.15 1.7.55 2.45 1.2 1.35 1.15 2.15 2.7 2.15 4.4 0 1.85-1.15 3.35-2.75 3.85.15.85.2 1.7.15 2.5h-1.7c.05-.7 0-1.4-.15-2.05-.7.15-1.4.05-2-.35-.35.75-.45 1.55-.4 2.4H6.15c-.15-.95-.05-1.9.35-2.75-1.15-.55-1.9-1.7-1.9-3.05 0-1.15.45-2.15 1.15-2.85.15-.35.25-.75.3-1.2.05-.35.15-.55.3-.55Z"
                />
                <circle cx="15.55" cy="13.15" r="3.15" fill="currentColor" />
              </svg>
            </span>
            <span>
              <strong>{ar.brand}</strong>
              <small>{ar.brandSub}</small>
            </span>
          </Link>
        </div>
        <BottomNav />
      </div>
      <main id="clinic-main" className="clinic-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
