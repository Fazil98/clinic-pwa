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
  const [visitType, setVisitType] = useState<VisitType>("checkup");
  const [notes, setNotes] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState("");
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
    addVisit({
      patientId: patient!.id,
      date,
      visitType,
      notes: notes.trim() || "تمت الزيارة",
      nextVisitDate: nextVisitDate || undefined,
    });
    setSaved(true);
    setTimeout(() => router.push(`/patients/${patient!.id}`), 500);
  }

  return (
    <div>
      <SavedToast show={saved} />
      <PageHeader title={ar.visit.title} subtitle={patient.fullName} />

      <div className="space-y-4">
        <div>
          <FieldLabel>{ar.visit.date}</FieldLabel>
          <TextInput
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
          <FieldLabel>{ar.visit.whatHappened}</FieldLabel>
          <TextArea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={ar.visit.notesPh}
            autoFocus
          />
        </div>

        <div>
          <FieldLabel>{ar.visit.nextVisit}</FieldLabel>
          <TextInput
            type="date"
            value={nextVisitDate}
            onChange={(e) => setNextVisitDate(e.target.value)}
          />
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {ar.visit.nextVisitHint}
          </p>
        </div>

        <PrimaryButton type="button" onClick={onSave}>
          {ar.visit.save}
        </PrimaryButton>
      </div>
    </div>
  );
}
