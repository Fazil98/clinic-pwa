import {
  healthFlagLabelAr,
  patientTypeLabelAr,
  visitTypeLabelAr,
} from "@/lib/ar";
import { estimateGestationalWeek } from "@/lib/dates";
import type { Patient } from "@/lib/types";

export const patientTypeLabel = patientTypeLabelAr;
export const visitTypeLabel = visitTypeLabelAr;
export const healthFlagLabel = healthFlagLabelAr;

export function patientStatusLabel(
  patient: Patient,
  onDate?: string,
): string {
  if (patient.patientType === "pregnant") {
    const week = estimateGestationalWeek({
      lmpDate: patient.lmpDate,
      dueDate: patient.dueDate,
      override: patient.gestationalWeekOverride,
      onDate,
    });
    if (week !== undefined) return `حامل · الأسبوع ${week}`;
    return "حامل";
  }
  if (patient.patientType === "postpartum") return "بعد الولادة";
  if (patient.patientType === "gynecology") {
    return patient.mainReason
      ? `صحة المرأة · ${patient.mainReason}`
      : "صحة المرأة";
  }
  return patient.mainReason || "أخرى";
}
