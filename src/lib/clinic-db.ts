import type {
  BloodType,
  HealthFlag,
  Patient,
  PatientType,
  TimelineEntry,
  TimelineKind,
  VisitType,
} from "@/lib/types";

const PATIENT_TYPES = new Set<PatientType>(["pregnant", "postpartum", "gynecology", "other"]);
const FLAGS = new Set<HealthFlag>([
  "hypertension",
  "diabetes",
  "anemia",
  "allergy",
  "previous_surgery",
  "bleeding_problems",
  "smoking",
  "other_chronic",
]);
const BLOOD = new Set<BloodType>(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"]);
const KINDS = new Set<TimelineKind>(["visit", "note"]);
const VISITS = new Set<VisitType>(["checkup", "ultrasound", "complaint", "followup", "other"]);

export interface PatientRow {
  id: string;
  full_name: string;
  phone: string;
  age: number | null;
  area: string | null;
  emergency_name: string | null;
  emergency_phone: string | null;
  patient_type: string;
  due_date: string | null;
  lmp_date: string | null;
  gestational_week_override: number | null;
  previous_pregnancies: number | null;
  previous_c_section: boolean | null;
  multiple_pregnancy: boolean | null;
  delivery_date: string | null;
  birth_type: string | null;
  baby_notes: string | null;
  main_reason: string | null;
  health_flags: string[] | null;
  allergy_note: string | null;
  medicines: string | null;
  blood_type: string | null;
  high_risk: boolean;
  history_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimelineRow {
  id: string;
  patient_id: string;
  kind: string;
  entry_date: string;
  visit_type: string | null;
  notes: string;
  next_visit_date: string | null;
  created_at: string;
}

function text(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function dateOnly(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  return value.slice(0, 10);
}

export function rowToPatient(row: PatientRow): Patient {
  const patientType = PATIENT_TYPES.has(row.patient_type as PatientType)
    ? (row.patient_type as PatientType)
    : "other";
  const birthType = row.birth_type === "normal" || row.birth_type === "csection" ? row.birth_type : undefined;
  const bloodType = row.blood_type && BLOOD.has(row.blood_type as BloodType)
    ? (row.blood_type as BloodType)
    : undefined;
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    age: row.age ?? undefined,
    area: text(row.area),
    emergencyName: text(row.emergency_name),
    emergencyPhone: text(row.emergency_phone),
    patientType,
    dueDate: dateOnly(row.due_date),
    lmpDate: dateOnly(row.lmp_date),
    gestationalWeekOverride: row.gestational_week_override ?? undefined,
    previousPregnancies: row.previous_pregnancies ?? undefined,
    previousCSection: row.previous_c_section ?? undefined,
    multiplePregnancy: row.multiple_pregnancy ?? undefined,
    deliveryDate: dateOnly(row.delivery_date),
    birthType,
    babyNotes: text(row.baby_notes),
    mainReason: text(row.main_reason),
    healthFlags: (row.health_flags ?? []).filter((flag): flag is HealthFlag => FLAGS.has(flag as HealthFlag)),
    allergyNote: text(row.allergy_note),
    medicines: text(row.medicines),
    bloodType,
    highRisk: row.high_risk,
    historyNotes: text(row.history_notes),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function rowToEntry(row: TimelineRow): TimelineEntry {
  return {
    id: row.id,
    patientId: row.patient_id,
    kind: KINDS.has(row.kind as TimelineKind) ? (row.kind as TimelineKind) : "note",
    date: dateOnly(row.entry_date) || row.entry_date,
    visitType: row.visit_type && VISITS.has(row.visit_type as VisitType)
      ? (row.visit_type as VisitType)
      : undefined,
    notes: row.notes,
    nextVisitDate: dateOnly(row.next_visit_date),
    createdAt: row.created_at,
  };
}

type PatientInput = Omit<Patient, "id" | "createdAt" | "updatedAt">;

export function patientToInsert(input: PatientInput) {
  return {
    full_name: input.fullName.trim(),
    phone: input.phone.trim(),
    age: input.age ?? null,
    area: text(input.area) ?? null,
    emergency_name: text(input.emergencyName) ?? null,
    emergency_phone: text(input.emergencyPhone) ?? null,
    patient_type: input.patientType,
    due_date: input.dueDate || null,
    lmp_date: input.lmpDate || null,
    gestational_week_override: input.gestationalWeekOverride ?? null,
    previous_pregnancies: input.previousPregnancies ?? null,
    previous_c_section: input.previousCSection ?? null,
    multiple_pregnancy: input.multiplePregnancy ?? null,
    delivery_date: input.deliveryDate || null,
    birth_type: input.birthType ?? null,
    baby_notes: text(input.babyNotes) ?? null,
    main_reason: text(input.mainReason) ?? null,
    health_flags: input.healthFlags,
    allergy_note: text(input.allergyNote) ?? null,
    medicines: text(input.medicines) ?? null,
    blood_type: input.bloodType ?? null,
    high_risk: input.highRisk,
    history_notes: text(input.historyNotes) ?? null,
  };
}

export function patientToUpdate(patch: Partial<Patient>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ("fullName" in patch && patch.fullName) row.full_name = patch.fullName.trim();
  if ("phone" in patch && patch.phone) row.phone = patch.phone.trim();
  if ("age" in patch) row.age = patch.age ?? null;
  if ("area" in patch) row.area = text(patch.area) ?? null;
  if ("emergencyName" in patch) row.emergency_name = text(patch.emergencyName) ?? null;
  if ("emergencyPhone" in patch) row.emergency_phone = text(patch.emergencyPhone) ?? null;
  if ("patientType" in patch && patch.patientType) row.patient_type = patch.patientType;
  if ("dueDate" in patch) row.due_date = patch.dueDate || null;
  if ("lmpDate" in patch) row.lmp_date = patch.lmpDate || null;
  if ("gestationalWeekOverride" in patch) row.gestational_week_override = patch.gestationalWeekOverride ?? null;
  if ("previousPregnancies" in patch) row.previous_pregnancies = patch.previousPregnancies ?? null;
  if ("previousCSection" in patch) row.previous_c_section = patch.previousCSection ?? null;
  if ("multiplePregnancy" in patch) row.multiple_pregnancy = patch.multiplePregnancy ?? null;
  if ("deliveryDate" in patch) row.delivery_date = patch.deliveryDate || null;
  if ("birthType" in patch) row.birth_type = patch.birthType ?? null;
  if ("babyNotes" in patch) row.baby_notes = text(patch.babyNotes) ?? null;
  if ("mainReason" in patch) row.main_reason = text(patch.mainReason) ?? null;
  if ("healthFlags" in patch && patch.healthFlags) row.health_flags = patch.healthFlags;
  if ("allergyNote" in patch) row.allergy_note = text(patch.allergyNote) ?? null;
  if ("medicines" in patch) row.medicines = text(patch.medicines) ?? null;
  if ("bloodType" in patch) row.blood_type = patch.bloodType ?? null;
  if ("highRisk" in patch) row.high_risk = Boolean(patch.highRisk);
  if ("historyNotes" in patch) row.history_notes = text(patch.historyNotes) ?? null;
  return row;
}
