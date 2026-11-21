import Link from "next/link";
import { ar } from "@/lib/ar";

export function AddChoices({ onChoose }: { onChoose?: () => void }) {
  return (
    <div className="add-choices">
      <Link href="/patients/new" className="action-tile" onNavigate={onChoose}>
        <span className="action-icon action-icon--blue" aria-hidden="true"><span className="glyph-plus" /></span>
        <span className="action-copy">
          <strong>{ar.add.newPatientTitle}</strong>
          <small>{ar.add.newPatientBody}</small>
        </span>
        <span className="chevron" aria-hidden="true" />
      </Link>
      <Link href="/add/visit" className="action-tile" onNavigate={onChoose}>
        <span className="action-icon action-icon--mint" aria-hidden="true"><span className="glyph-note" /></span>
        <span className="action-copy">
          <strong>{ar.add.newVisitTitle}</strong>
          <small>{ar.add.newVisitBody}</small>
        </span>
        <span className="chevron" aria-hidden="true" />
      </Link>
    </div>
  );
}
