"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDate(today);
  }, [today]);

  if (!patient) {
    return (
      <EmptyState title={ar.visit.notFound} body={ar.visit.notFoundBody} />
    );
  }

  function onSave() {
    if (!notes.trim()) return;
    addNote({
      patientId: patient!.id,
      date,
      notes: notes.trim(),
    });
    setSaved(true);
    setTimeout(() => router.push(`/patients/${patient!.id}`), 500);
  }

  return (
    <div>
      <SavedToast show={saved} />
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
          disabled={saved || !date || !notes.trim()}
          onClick={onSave}
        >
          {ar.note.save}
        </PrimaryButton>
      </div>
    </div>
  );
}
