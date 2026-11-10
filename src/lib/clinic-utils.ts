import { DEMO_ANCHOR_DATE, isBeforeDay, isSameDay } from "@/lib/dates";
import type {
  Patient,
  PatientSort,
  TimelineEntry,
} from "@/lib/types";

export function latestEntryForPatient(
  entries: TimelineEntry[],
  patientId: string,
): TimelineEntry | undefined {
  return entries
    .filter((e) => e.patientId === patientId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))[0];
}

export function nextVisitForPatient(
  entries: TimelineEntry[],
  patientId: string,
): string | undefined {
  const withNext = entries
    .filter((e) => e.patientId === patientId && e.nextVisitDate)
    .sort((a, b) => (b.nextVisitDate || "").localeCompare(a.nextVisitDate || ""));
  // Prefer the chronologically soonest upcoming / latest scheduled next from newest entries
  const upcoming = entries
    .filter((e) => e.patientId === patientId && e.nextVisitDate)
    .map((e) => e.nextVisitDate as string)
    .sort();
  return upcoming[0] ?? withNext[0]?.nextVisitDate;
}

/** Best "active" next visit: soonest date among all entries that set nextVisitDate */
export function activeNextVisit(
  entries: TimelineEntry[],
  patientId: string,
): string | undefined {
  const dates = entries
    .filter((e) => e.patientId === patientId && e.nextVisitDate)
    .map((e) => e.nextVisitDate as string);
  if (!dates.length) return undefined;
  // Use the latest entry's next visit if multiple — more intuitive for follow-up
  const latest = [...entries]
    .filter((e) => e.patientId === patientId && e.nextVisitDate)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  return latest?.nextVisitDate ?? dates.sort().at(-1);
}

export function searchPatients(patients: Patient[], query: string): Patient[] {
  const q = query.trim().toLowerCase();
  if (!q) return patients;
  return patients.filter(
    (p) =>
      p.fullName.toLowerCase().includes(q) ||
      p.phone.replace(/\s/g, "").includes(q.replace(/\s/g, "")),
  );
}

export function sortPatients(
  patients: Patient[],
  entries: TimelineEntry[],
  sort: PatientSort,
): Patient[] {
  const list = [...patients];
  switch (sort) {
    case "name":
      return list.sort((a, b) => a.fullName.localeCompare(b.fullName, "ar"));
    case "highRisk":
      return list.sort(
        (a, b) =>
          Number(b.highRisk) - Number(a.highRisk) ||
          a.fullName.localeCompare(b.fullName, "ar"),
      );
    case "nextVisit":
      return list.sort((a, b) => {
        const na = activeNextVisit(entries, a.id) || "9999-99-99";
        const nb = activeNextVisit(entries, b.id) || "9999-99-99";
        return na.localeCompare(nb);
      });
    case "recent":
    default:
      return list.sort((a, b) => {
        const la = latestEntryForPatient(entries, a.id)?.date || a.updatedAt.slice(0, 10);
        const lb = latestEntryForPatient(entries, b.id)?.date || b.updatedAt.slice(0, 10);
        return lb.localeCompare(la);
      });
  }
}

export interface TodayItem {
  patient: Patient;
  nextVisitDate: string;
  status: "today" | "overdue";
}

export function getTodayItems(
  patients: Patient[],
  entries: TimelineEntry[],
  today: string = DEMO_ANCHOR_DATE,
): TodayItem[] {
  const items: TodayItem[] = [];

  for (const patient of patients) {
    const next = activeNextVisit(entries, patient.id);
    if (!next) continue;
    if (isSameDay(next, today)) {
      items.push({ patient, nextVisitDate: next, status: "today" });
    } else if (isBeforeDay(next, today)) {
      items.push({ patient, nextVisitDate: next, status: "overdue" });
    }
  }

  return items.sort((a, b) => {
    if (a.status !== b.status) return a.status === "overdue" ? -1 : 1;
    return a.patient.fullName.localeCompare(b.patient.fullName, "ar");
  });
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
