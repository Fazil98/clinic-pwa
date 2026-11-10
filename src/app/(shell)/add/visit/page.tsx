"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState, PageHeader, TextInput } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { searchPatients } from "@/lib/clinic-utils";
import { patientStatusLabel } from "@/lib/labels";
import { useClientToday } from "@/lib/use-client-today";

export default function AddVisitPickPatientPage() {
  const today = useClientToday();
  const { patients } = useClinic();
  const [query, setQuery] = useState("");
  const list = useMemo(
    () => searchPatients(patients, query).slice(0, 20),
    [patients, query],
  );

  return (
    <div>
      <PageHeader title={ar.add.whoTitle} subtitle={ar.add.whoSubtitle} />
      <TextInput
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={ar.patients.searchPlaceholder}
        className="mb-4"
      />

      {list.length === 0 ? (
        <EmptyState title={ar.add.noMatchTitle} body={ar.add.noMatchBody} />
      ) : (
        <div className="space-y-3">
          {list.map((patient) => (
            <div
              key={patient.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"
            >
              <p className="text-lg font-bold">{patient.fullName}</p>
              <p className="text-[var(--muted)]" dir="ltr">
                {patient.phone}
              </p>
              <p className="mt-1 text-sm">
                {patientStatusLabel(patient, today)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/patients/${patient.id}/visit`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-3 text-sm font-bold text-white"
                >
                  {ar.add.visitBtn}
                </Link>
                <Link
                  href={`/patients/${patient.id}/note`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-bold"
                >
                  {ar.add.noteBtn}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
