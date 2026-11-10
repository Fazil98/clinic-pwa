import Link from "next/link";
import { ar } from "@/lib/ar";
import { formatDisplayDate } from "@/lib/dates";
import { patientStatusLabel } from "@/lib/labels";
import type { Patient } from "@/lib/types";
import { useClientToday } from "@/lib/use-client-today";

export function PatientRow({
  patient,
  nextVisitDate,
  badge,
}: {
  patient: Patient;
  nextVisitDate?: string;
  badge?: "today" | "overdue";
}) {
  const today = useClientToday();
  return (
    <Link
      href={`/patients/${patient.id}`}
      className="block rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_1px_0_rgba(20,32,30,0.03)] transition active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-[var(--ink)]">
              {patient.fullName}
            </h2>
            {patient.highRisk ? (
              <span className="rounded-full bg-[var(--danger-soft)] px-2 py-0.5 text-xs font-bold text-[var(--danger)]">
                {ar.patients.highRisk}
              </span>
            ) : null}
            {badge === "overdue" ? (
              <span className="rounded-full bg-[var(--warn-soft)] px-2 py-0.5 text-xs font-bold text-[var(--warn-ink)]">
                {ar.patients.badgeOverdue}
              </span>
            ) : null}
            {badge === "today" ? (
              <span className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-xs font-bold text-[var(--primary)]">
                {ar.patients.badgeToday}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-base text-[var(--muted)]" dir="ltr">
            {patient.phone}
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--ink-soft)]">
            {patientStatusLabel(patient, today)}
          </p>
          {nextVisitDate ? (
            <p className="mt-1 text-sm text-[var(--muted)]">
              {ar.patients.nextVisit} · {formatDisplayDate(nextVisitDate)}
            </p>
          ) : null}
        </div>
        <span className="mt-1 text-[var(--primary)]" aria-hidden>
          ←
        </span>
      </div>
    </Link>
  );
}
