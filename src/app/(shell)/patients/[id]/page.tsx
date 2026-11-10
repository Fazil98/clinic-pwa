"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Card, Chip, EmptyState, PageHeader } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { activeNextVisit } from "@/lib/clinic-utils";
import { formatDisplayDate } from "@/lib/dates";
import {
  healthFlagLabel,
  patientStatusLabel,
  patientTypeLabel,
  visitTypeLabel,
} from "@/lib/labels";
import { useClientToday } from "@/lib/use-client-today";

export default function PatientDetailPage() {
  const today = useClientToday();
  const params = useParams<{ id: string }>();
  const { getPatient, getPatientTimeline, timeline } = useClinic();
  const patient = getPatient(params.id);
  const entries = getPatientTimeline(params.id);
  const [tab, setTab] = useState<"timeline" | "profile">("timeline");
  const nextVisit = patient
    ? activeNextVisit(timeline, patient.id)
    : undefined;

  if (!patient) {
    return (
      <EmptyState
        title={ar.patient.notFoundTitle}
        body={ar.patient.notFoundBody}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={patient.fullName}
        subtitle={patientStatusLabel(patient, today)}
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {patient.highRisk ? (
            <Chip tone="danger" active>
              {ar.patients.highRisk}
            </Chip>
          ) : null}
          <Chip>{patientTypeLabel[patient.patientType]}</Chip>
        </div>
        <a
          href={`tel:${patient.phone}`}
          className="mt-4 block text-xl font-bold text-[var(--primary)]"
          dir="ltr"
        >
          {patient.phone}
        </a>
        {patient.age ? (
          <p className="mt-1 text-[var(--muted)]">
            {ar.patient.agePrefix} {patient.age}
          </p>
        ) : null}
        {nextVisit ? (
          <p className="mt-3 text-base font-bold">
            {ar.patient.nextVisit} · {formatDisplayDate(nextVisit)}
          </p>
        ) : (
          <p className="mt-3 text-base text-[var(--muted)]">
            {ar.patient.noNext}
          </p>
        )}
      </Card>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Link
          href={`/patients/${patient.id}/visit`}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(15,118,110,0.25)]"
        >
          {ar.patient.addVisit}
        </Link>
        <Link
          href={`/patients/${patient.id}/note`}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 text-base font-bold text-[var(--ink)]"
        >
          {ar.patient.addNote}
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-1">
        <button
          type="button"
          onClick={() => setTab("timeline")}
          className={`min-h-11 rounded-xl text-sm font-bold ${
            tab === "timeline"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted)]"
          }`}
        >
          {ar.patient.timeline}
        </button>
        <button
          type="button"
          onClick={() => setTab("profile")}
          className={`min-h-11 rounded-xl text-sm font-bold ${
            tab === "profile"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted)]"
          }`}
        >
          {ar.patient.profile}
        </button>
      </div>

      {tab === "timeline" ? (
        entries.length === 0 ? (
          <EmptyState
            title={ar.patient.noNotesTitle}
            body={ar.patient.noNotesBody}
          />
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-[var(--primary)]">
                    {entry.kind === "visit"
                      ? visitTypeLabel[entry.visitType || "other"]
                      : ar.patient.quickNote}
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    {formatDisplayDate(entry.date)}
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-base leading-8">
                  {entry.notes}
                </p>
                {entry.nextVisitDate ? (
                  <p className="mt-3 text-sm font-bold text-[var(--ink-soft)]">
                    {ar.patient.nextVisit} ·{" "}
                    {formatDisplayDate(entry.nextVisitDate)}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-bold">{ar.patient.personal}</h3>
            <dl className="mt-3 space-y-2 text-base">
              <Row label={ar.patient.phone} value={patient.phone} ltr />
              <Row
                label={ar.patient.age}
                value={patient.age?.toString() || ar.common.dash}
              />
              <Row
                label={ar.patient.area}
                value={patient.area || ar.common.dash}
              />
              <Row
                label={ar.patient.emergency}
                value={
                  patient.emergencyName
                    ? `${patient.emergencyName} · ${patient.emergencyPhone || ""}`
                    : ar.common.dash
                }
              />
            </dl>
          </Card>

          <Card>
            <h3 className="text-lg font-bold">{ar.patient.condition}</h3>
            <dl className="mt-3 space-y-2 text-base">
              <Row
                label={ar.patient.type}
                value={patientTypeLabel[patient.patientType]}
              />
              {patient.patientType === "pregnant" ? (
                <>
                  <Row
                    label={ar.patient.dueDate}
                    value={formatDisplayDate(patient.dueDate)}
                  />
                  <Row
                    label={ar.patient.lmp}
                    value={formatDisplayDate(patient.lmpDate)}
                  />
                  <Row
                    label={ar.patient.previousPregnancies}
                    value={
                      patient.previousPregnancies?.toString() || ar.common.dash
                    }
                  />
                  <Row
                    label={ar.patient.previousCSection}
                    value={
                      patient.previousCSection === undefined
                        ? ar.common.dash
                        : patient.previousCSection
                          ? ar.patient.yes
                          : ar.patient.no
                    }
                  />
                </>
              ) : null}
              {patient.patientType === "postpartum" ? (
                <>
                  <Row
                    label={ar.patient.delivery}
                    value={formatDisplayDate(patient.deliveryDate)}
                  />
                  <Row
                    label={ar.patient.birthType}
                    value={
                      patient.birthType === "csection"
                        ? ar.patient.csection
                        : patient.birthType === "normal"
                          ? ar.patient.normalBirth
                          : ar.common.dash
                    }
                  />
                  <Row
                    label={ar.patient.babyNotes}
                    value={patient.babyNotes || ar.common.dash}
                  />
                </>
              ) : null}
              {patient.patientType === "gynecology" ||
              patient.patientType === "other" ? (
                <Row
                  label={ar.patient.reason}
                  value={patient.mainReason || ar.common.dash}
                />
              ) : null}
            </dl>
          </Card>

          <Card>
            <h3 className="text-lg font-bold">{ar.patient.history}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {patient.healthFlags.length === 0 ? (
                <p className="text-[var(--muted)]">{ar.patient.noFlags}</p>
              ) : (
                patient.healthFlags.map((flag) => (
                  <Chip key={flag}>{healthFlagLabel[flag]}</Chip>
                ))
              )}
            </div>
            <dl className="mt-4 space-y-2 text-base">
              <Row
                label={ar.patient.allergy}
                value={patient.allergyNote || ar.common.dash}
              />
              <Row
                label={ar.patient.medicines}
                value={patient.medicines || ar.common.dash}
              />
              <Row
                label={ar.patient.bloodType}
                value={patient.bloodType || ar.common.dash}
              />
              <Row
                label={ar.patient.notes}
                value={patient.historyNotes || ar.common.dash}
              />
            </dl>
          </Card>

          <Link
            href={`/patients/${patient.id}/edit`}
            className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 text-base font-bold text-[var(--ink)]"
          >
            {ar.patient.editDetails}
          </Link>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  ltr,
}: {
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <dt className="text-sm font-bold text-[var(--muted)]">{label}</dt>
      <dd
        className="mt-0.5 whitespace-pre-wrap leading-7"
        dir={ltr ? "ltr" : undefined}
      >
        {value}
      </dd>
    </div>
  );
}
