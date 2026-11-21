"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Chip,
  EmptyState,
  FieldLabel,
  PageHeader,
  PrimaryButton,
  SavedToast,
  TextArea,
  TextInput,
} from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { healthFlagLabel, patientTypeLabel } from "@/lib/labels";
import type { HealthFlag, PatientType } from "@/lib/types";

const types: PatientType[] = [
  "pregnant",
  "postpartum",
  "gynecology",
  "other",
];
const flags = Object.keys(healthFlagLabel) as HealthFlag[];

export default function EditPatientPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getPatient, updatePatient } = useClinic();
  const patient = getPatient(params.id);
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [patientType, setPatientType] = useState<PatientType>("other");
  const [dueDate, setDueDate] = useState("");
  const [mainReason, setMainReason] = useState("");
  const [medicines, setMedicines] = useState("");
  const [historyNotes, setHistoryNotes] = useState("");
  const [allergyNote, setAllergyNote] = useState("");
  const [healthFlags, setHealthFlags] = useState<HealthFlag[]>([]);
  const [highRisk, setHighRisk] = useState(false);

  useEffect(() => {
    if (!patient) return;
    setFullName(patient.fullName);
    setPhone(patient.phone);
    setAge(patient.age?.toString() || "");
    setArea(patient.area || "");
    setPatientType(patient.patientType);
    setDueDate(patient.dueDate || "");
    setMainReason(patient.mainReason || "");
    setMedicines(patient.medicines || "");
    setHistoryNotes(patient.historyNotes || "");
    setAllergyNote(patient.allergyNote || "");
    setHealthFlags(patient.healthFlags);
    setHighRisk(patient.highRisk);
  }, [patient]);

  if (!patient) {
    return (
      <EmptyState
        title={ar.patient.notFoundTitle}
        body={ar.patient.notFoundBody}
      />
    );
  }

  function toggleFlag(flag: HealthFlag) {
    setHealthFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
  }

  function onSave() {
    if (!fullName.trim() || !phone.trim()) return;
    updatePatient(patient!.id, {
      fullName: fullName.trim(),
      phone: phone.trim(),
      age: age ? Number(age) : undefined,
      area: area.trim() || undefined,
      patientType,
      dueDate: dueDate || undefined,
      mainReason: mainReason.trim() || undefined,
      medicines: medicines.trim() || undefined,
      historyNotes: historyNotes.trim() || undefined,
      allergyNote: allergyNote.trim() || undefined,
      healthFlags,
      highRisk,
    });
    setSaved(true);
    setTimeout(() => router.push(`/patients/${patient!.id}`), 450);
  }

  return (
    <div>
      <SavedToast show={saved} />
      <PageHeader title={ar.edit.title} subtitle={patient.fullName} backHref={`/patients/${patient.id}`} />

      <div className="space-y-5">
        <section className="form-panel space-y-3">
          <h2 className="text-lg font-bold">{ar.edit.personal}</h2>
          <div>
            <FieldLabel htmlFor="edit-fullName">{ar.edit.fullName}</FieldLabel>
            <TextInput id="edit-fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-phone">{ar.edit.phone}</FieldLabel>
            <TextInput id="edit-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
              dir="ltr"
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-age">{ar.edit.age}</FieldLabel>
            <TextInput id="edit-age"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-area">{ar.edit.area}</FieldLabel>
            <TextInput id="edit-area" value={area} onChange={(e) => setArea(e.target.value)} />
          </div>
        </section>

        <section className="form-panel space-y-3">
          <h2 className="text-lg font-bold">{ar.edit.condition}</h2>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Chip
                key={t}
                active={patientType === t}
                onClick={() => setPatientType(t)}
              >
                {patientTypeLabel[t]}
              </Chip>
            ))}
          </div>
          {patientType === "pregnant" ? (
            <div>
              <FieldLabel htmlFor="edit-dueDate">{ar.edit.dueDate}</FieldLabel>
              <TextInput id="edit-dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          ) : null}
          {patientType === "gynecology" || patientType === "other" ? (
            <div>
              <FieldLabel htmlFor="edit-mainReason">{ar.edit.mainReason}</FieldLabel>
              <TextInput id="edit-mainReason"
                value={mainReason}
                onChange={(e) => setMainReason(e.target.value)}
              />
            </div>
          ) : null}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold">{ar.edit.history}</h2>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag) => (
              <Chip
                key={flag}
                active={healthFlags.includes(flag)}
                onClick={() => toggleFlag(flag)}
              >
                {healthFlagLabel[flag]}
              </Chip>
            ))}
          </div>
          <div>
            <FieldLabel htmlFor="edit-allergy">{ar.edit.allergy}</FieldLabel>
            <TextInput id="edit-allergy"
              value={allergyNote}
              onChange={(e) => setAllergyNote(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-medicines">{ar.edit.medicines}</FieldLabel>
            <TextArea id="edit-medicines"
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel htmlFor="edit-otherNotes">{ar.edit.otherNotes}</FieldLabel>
            <TextArea id="edit-otherNotes"
              value={historyNotes}
              onChange={(e) => setHistoryNotes(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => setHighRisk((v) => !v)}
            className="risk-row"
            aria-pressed={highRisk}
          >
            <span>{ar.edit.highRisk}</span>
            <span>{highRisk ? ar.edit.on : ar.edit.off}</span>
          </button>
        </section>

        <PrimaryButton type="button" onClick={onSave}>
          {ar.edit.save}
        </PrimaryButton>
      </div>
    </div>
  );
}
