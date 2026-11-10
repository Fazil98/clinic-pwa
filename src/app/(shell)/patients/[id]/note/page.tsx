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
      <PageHeader title={ar.note.title} subtitle={patient.fullName} />

      <div className="space-y-4">
        <div>
          <FieldLabel>{ar.note.date}</FieldLabel>
          <TextInput
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>{ar.note.note}</FieldLabel>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={ar.note.notePh}
            autoFocus
          />
        </div>
        <PrimaryButton
          type="button"
          disabled={!notes.trim()}
          onClick={onSave}
        >
          {ar.note.save}
        </PrimaryButton>
      </div>
    </div>
  );
}
