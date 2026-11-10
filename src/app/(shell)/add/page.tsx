import Link from "next/link";
import { PageHeader } from "@/components/ui";
import { ar } from "@/lib/ar";

export default function AddPage() {
  return (
    <div>
      <PageHeader title={ar.add.title} subtitle={ar.add.subtitle} />

      <div className="space-y-4">
        <Link
          href="/patients/new"
          className="block rounded-3xl bg-[var(--primary)] p-6 text-white shadow-[0_12px_30px_rgba(15,118,110,0.28)]"
        >
          <p className="text-sm font-bold text-white/80">{ar.add.mostCommon}</p>
          <h2 className="mt-2 text-2xl font-extrabold">
            {ar.add.newPatientTitle}
          </h2>
          <p className="mt-2 text-base text-white/90">{ar.add.newPatientBody}</p>
        </Link>

        <Link
          href="/add/visit"
          className="block rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6"
        >
          <h2 className="text-2xl font-extrabold text-[var(--ink)]">
            {ar.add.newVisitTitle}
          </h2>
          <p className="mt-2 text-base text-[var(--muted)]">
            {ar.add.newVisitBody}
          </p>
        </Link>
      </div>
    </div>
  );
}
