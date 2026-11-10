export type PatientType = "pregnant" | "postpartum" | "gynecology" | "other";

export type HealthFlag =
  | "hypertension"
  | "diabetes"
  | "anemia"
  | "allergy"
  | "previous_surgery"
  | "bleeding_problems"
  | "smoking"
  | "other_chronic";

export type VisitType =
  | "checkup"
  | "ultrasound"
  | "complaint"
  | "followup"
  | "other";

export type TimelineKind = "visit" | "note";

export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-"
  | "unknown";

export interface Patient {
  id: string;
  fullName: string;
  phone: string;
  age?: number;
  area?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  patientType: PatientType;
  /** ISO date YYYY-MM-DD */
  dueDate?: string;
  lmpDate?: string;
  gestationalWeekOverride?: number;
  previousPregnancies?: number;
  previousCSection?: boolean;
  multiplePregnancy?: boolean;
  deliveryDate?: string;
  birthType?: "normal" | "csection";
  babyNotes?: string;
  mainReason?: string;
  healthFlags: HealthFlag[];
  allergyNote?: string;
  medicines?: string;
  bloodType?: BloodType;
  highRisk: boolean;
  historyNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineEntry {
  id: string;
  patientId: string;
  kind: TimelineKind;
  date: string;
  visitType?: VisitType;
  notes: string;
  nextVisitDate?: string;
  createdAt: string;
}

export type PatientSort = "recent" | "nextVisit" | "name" | "highRisk";
