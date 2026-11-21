import Link from "next/link";
import { ar } from "@/lib/ar";
import { parseISODate } from "@/lib/dates";
import { patientStatusLabel } from "@/lib/labels";
import type { Patient } from "@/lib/types";
import { useClientToday } from "@/lib/use-client-today";

const shortDate = new Intl.DateTimeFormat("ar-IQ", { day: "numeric", month: "short" });

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
    <Link href={`/patients/${patient.id}`} className="patient-row" data-status={badge}>
      <div className="patient-row-header">
        <div className="min-w-0">
          <p className="patient-row-name" dir="auto">{patient.fullName}</p>
          <p className="patient-row-condition">{patientStatusLabel(patient, today)}</p>
        </div>
        <span className="patient-row-chevron" aria-hidden="true"><span className="chevron" /></span>
      </div>

      {patient.highRisk ? (
        <p className="patient-tags">
          <span className="patient-tag" data-tone="attention">{ar.patients.highRisk}</span>
        </p>
      ) : null}

      {(!badge || nextVisitDate) && (
        <div className="patient-row-footer">
          {!badge ? <bdi dir="ltr" className="patient-phone">{patient.phone}</bdi> : null}
          {nextVisitDate ? (
            <span className="patient-row-date">
              <span className="patient-calendar" aria-hidden="true" />
              <time dateTime={nextVisitDate}>{shortDate.format(parseISODate(nextVisitDate))}</time>
            </span>
          ) : null}
          {badge ? (
            <span className="patient-tag" data-tone={badge}>
              {badge === "overdue" ? ar.patients.badgeOverdue : ar.patients.badgeToday}
            </span>
          ) : null}
        </div>
      )}
    </Link>
  );
}
