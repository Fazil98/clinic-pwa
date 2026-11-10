"use client";

import { useMemo, useState } from "react";
import { PatientRow } from "@/components/PatientRow";
import { EmptyState, PageHeader, TextInput } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import {
  activeNextVisit,
  searchPatients,
  sortPatients,
} from "@/lib/clinic-utils";
import type { PatientSort } from "@/lib/types";

const sorts: { id: PatientSort; label: string }[] = [
  { id: "recent", label: ar.patients.sortRecent },
  { id: "nextVisit", label: ar.patients.sortNext },
  { id: "name", label: ar.patients.sortName },
  { id: "highRisk", label: ar.patients.sortHighRisk },
];

export default function PatientsPage() {
  const { patients, timeline, ready } = useClinic();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<PatientSort>("recent");

  const list = useMemo(() => {
    const filtered = searchPatients(patients, query);
    return sortPatients(filtered, timeline, sort);
  }, [patients, timeline, query, sort]);

  return (
    <div>
      <PageHeader
        title={ar.patients.title}
        subtitle={ready ? ar.patients.saved(patients.length) : "…"}
      />

      <div className="mb-4 space-y-3">
        <TextInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ar.patients.searchPlaceholder}
          inputMode="search"
          aria-label={ar.patients.searchPlaceholder}
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorts.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold ${
                sort === s.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--line)]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {!ready ? (
        <EmptyState
          title={ar.today.loadingTitle}
          body={ar.today.loadingBody}
        />
      ) : list.length === 0 ? (
        <EmptyState
          title={ar.patients.emptyTitle}
          body={query ? ar.patients.emptySearch : ar.patients.emptyBody}
        />
      ) : (
        <div className="space-y-3">
          {list.map((patient) => (
            <PatientRow
              key={patient.id}
              patient={patient}
              nextVisitDate={activeNextVisit(timeline, patient.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
