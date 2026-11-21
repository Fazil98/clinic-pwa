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
            <span className="clinic-mark" aria-hidden="true"><span className="glyph-plus" /></span>
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
