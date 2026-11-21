"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
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
import { useClientToday } from "@/lib/use-client-today";

export default function AddNotePage() {
  const today = useClientToday();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getPatient, addNote } = useClinic();
  const patient = getPatient(params.id);
  const [date, setDate] = useState(today);
  const [notes, setNotes] = useState("");
  const [saveError, setSaveError] = useState("");
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
    if (savingRef.current || !notes.trim() || !date) return;
    savingRef.current = true;
    setSaving(true);
    setSaveError("");
    const entry = await addNote({
      patientId: patient!.id,
      date,
      notes: notes.trim(),
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
      <PageHeader title={ar.note.title} subtitle={patient.fullName} backHref={`/patients/${patient.id}`} />

      <div className="form-panel space-y-5">
        <div>
          <FieldLabel htmlFor="note-date">{ar.note.date}</FieldLabel>
          <TextInput id="note-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel htmlFor="note-note">{ar.note.note}</FieldLabel>
          <TextArea id="note-note"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={ar.note.notePh}
          />
        </div>
        <PrimaryButton
          type="button"
          disabled={saved || saving || !date || !notes.trim()}
          onClick={onSave}
        >
          {saving ? ar.common.saving : ar.note.save}
        </PrimaryButton>
      </div>
    </div>
  );
}
