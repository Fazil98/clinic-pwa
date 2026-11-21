"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState, PageHeader } from "@/components/ui";
import { PatientSearch } from "@/components/PatientSearch";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { searchPatients } from "@/lib/clinic-utils";
import { patientStatusLabel } from "@/lib/labels";
import { useClientToday } from "@/lib/use-client-today";

export default function AddVisitPickPatientPage() {
  const today = useClientToday();
  const { patients, ready } = useClinic();
  const [query, setQuery] = useState("");
  const list = useMemo(
    () => searchPatients(patients, query),
    [patients, query],
  );

  return (
    <div>
      <PageHeader title={ar.add.whoTitle} subtitle={ar.add.whoSubtitle} backHref="/add" />
      <div className="mb-5"><PatientSearch query={query} onChange={setQuery} /></div>

      {!ready ? (
        <EmptyState title={ar.today.loadingTitle} body={ar.today.loadingBody} />
      ) : list.length === 0 ? (
        <EmptyState
          title={query.trim() ? ar.patients.noResults : ar.patients.emptyTitle}
          body={query.trim() ? ar.patients.emptySearch : ar.add.noMatchBody}
          action={query.trim() ? undefined : <Link href="/patients/new" className="clinic-link">{ar.add.newPatientTitle}</Link>}
        />
      ) : (
        <div className="space-y-3">
          {list.map((patient) => (
            <div
              key={patient.id}
              className="clinic-card"
            >
              <p className="text-lg font-bold">{patient.fullName}</p>
              <p className="text-[var(--muted)]" dir="auto">
                <bdi dir="ltr">{patient.phone}</bdi>
              </p>
              <p className="mt-1 text-sm">
                {patientStatusLabel(patient, today)}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/patients/${patient.id}/visit`}
                  className="clinic-button clinic-button--primary"
                >
                  {ar.add.visitBtn}
                </Link>
                <Link
                  href={`/patients/${patient.id}/note`}
                  className="clinic-button clinic-button--secondary"
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
