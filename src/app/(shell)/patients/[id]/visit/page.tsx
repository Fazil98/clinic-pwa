"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { visitTypeLabel } from "@/lib/labels";
import type { VisitType } from "@/lib/types";
import { useClientToday } from "@/lib/use-client-today";

const visitTypes = Object.keys(visitTypeLabel) as VisitType[];

export default function AddVisitPage() {
  const today = useClientToday();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getPatient, addVisit } = useClinic();
  const patient = getPatient(params.id);
  const [date, setDate] = useState(today);
  const [saveError, setSaveError] = useState("");
  const [visitType, setVisitType] = useState<VisitType>("checkup");
  const [notes, setNotes] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  useEffect(() => {
    setDate(today);
  }, [today]);

  if (!patient) {
    return (
      <EmptyState title={ar.visit.notFound} body={ar.visit.notFoundBody} />
    );
  }

  async function onSave() {
    if (savingRef.current || !date) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError("");
    const entry = await addVisit({
      patientId: patient!.id,
      date,
      visitType,
      notes: notes.trim() || "تمت الزيارة",
      nextVisitDate: nextVisitDate || undefined,
    });
    if (!entry) {
      savingRef.current = false;
      setSaving(false);
      setSaveError(ar.common.saveFailed);
      return;
    }
    setSaveError("");
    setSaved(true);
    setTimeout(() => router.push(`/patients/${patient!.id}`), 500);
  }

  return (
    <div>
      <SavedToast show={saved} />
      {saveError ? <p className="mb-3 text-sm font-semibold text-[var(--danger)]" role="alert">{saveError}</p> : null}
      <PageHeader title={ar.visit.title} subtitle={patient.fullName} backHref={`/patients/${patient.id}`} />

      <div className="form-panel space-y-5">
        <div>
          <FieldLabel htmlFor="visit-date">{ar.visit.date}</FieldLabel>
          <TextInput id="visit-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <FieldLabel>{ar.visit.type}</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {visitTypes.map((type) => (
              <Chip
                key={type}
                active={visitType === type}
                onClick={() => setVisitType(type)}
              >
                {visitTypeLabel[type]}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="visit-whatHappened">{ar.visit.whatHappened}</FieldLabel>
          <TextArea id="visit-whatHappened"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={ar.visit.notesPh}
          />
        </div>

        <div>
          <FieldLabel htmlFor="visit-nextVisit">{ar.visit.nextVisit}</FieldLabel>
          <TextInput id="visit-nextVisit"
            type="date"
            value={nextVisitDate}
            onChange={(e) => setNextVisitDate(e.target.value)}
          />
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {ar.visit.nextVisitHint}
          </p>
        </div>

        <PrimaryButton type="button" disabled={saved || saving || !date} onClick={onSave}>
          {saving ? ar.common.saving : ar.visit.save}
        </PrimaryButton>
      </div>
    </div>
  );
}
