"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PatientRow } from "@/components/PatientRow";
import { PatientSearch } from "@/components/PatientSearch";
import { EmptyState, ListSkeleton, PageHeader } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { activeNextVisit, searchPatients, sortPatients } from "@/lib/clinic-utils";
import type { PatientSort } from "@/lib/types";

const numberFormat = new Intl.NumberFormat("ar-IQ");

const sorts: { id: PatientSort; label: string }[] = [
  { id: "recent", label: ar.patients.sortRecent },
  { id: "nextVisit", label: ar.patients.sortNext },
  { id: "name", label: ar.patients.sortName },
  { id: "highRisk", label: ar.patients.sortHighRisk },
];

export default function PatientsPage() {
  const { patients, timeline, ready, loadError } = useClinic();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<PatientSort>("recent");
  const list = useMemo(
    () => sortPatients(searchPatients(patients, query), timeline, sort),
    [patients, timeline, query, sort],
  );
  const searching = Boolean(query.trim());

  return (
    <>
      <PageHeader
        title={ar.patients.title}
        subtitle={ready ? ar.patients.saved(numberFormat.format(patients.length)) : undefined}
        action={<Link href="/patients/new" className="clinic-link shrink-0">{ar.add.newPatientTitle}</Link>}
      />
      {loadError ? <p className="mb-3 text-sm font-semibold text-[var(--danger)]" role="alert">{ar.common.loadFailed}</p> : null}
      <div className="mb-4 space-y-3">
        <PatientSearch query={query} onChange={setQuery} />
        <div role="group" aria-label={ar.patients.sortLabel} className="sort-row">
          {sorts.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={sort === id}
              onClick={() => setSort(id)}
              className="sort-chip"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {!ready ? (
        <ListSkeleton />
      ) : list.length === 0 ? (
        <EmptyState
          title={searching ? ar.patients.noResults : ar.patients.emptyTitle}
          body={searching ? ar.patients.emptySearch : ar.patients.emptyBody}
          action={
            searching ? (
              <button type="button" className="clinic-button clinic-button--secondary" onClick={() => setQuery("")}>
                {ar.patients.clearSearch}
              </button>
            ) : (
              <Link href="/patients/new" className="clinic-button clinic-button--primary">
                {ar.add.newPatientTitle}
              </Link>
            )
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {list.map((patient) => (
            <li key={patient.id}>
              <PatientRow patient={patient} nextVisitDate={activeNextVisit(timeline, patient.id)} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
