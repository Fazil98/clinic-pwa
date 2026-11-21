"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { AppBack, Card, EmptyState, ListSkeleton } from "@/components/ui";
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
import type { TimelineEntry } from "@/lib/types";

export default function PatientDetailPage() {
  const today = useClientToday();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getPatient, getPatientTimeline, timeline, ready, deletePatient, deleteTimelineEntry } = useClinic();
  const patient = getPatient(params.id);
  const entries = getPatientTimeline(params.id);
  const [tab, setTab] = useState<"timeline" | "profile">("timeline");
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "patient" } | { kind: "entry"; entry: TimelineEntry } | null
  >(null);
  const nextVisit = patient
    ? activeNextVisit(timeline, patient.id)
    : undefined;

  const visitStatus = nextVisit === today ? "today" : nextVisit && nextVisit < today ? "overdue" : undefined;

  if (!ready) {
    return <ListSkeleton />;
  }

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
      <div className="mb-3">
        <AppBack href="/patients" />
      </div>
      <Card className="patient-identity">
        <div className="identity-header">
          <div className="min-w-0">
            <h1 className="identity-title" dir="auto">{patient.fullName}</h1>
            <p className="identity-condition">{patientStatusLabel(patient, today)}</p>
          </div>
          {patient.age || patient.highRisk ? (
            <div className="patient-tags">
              {patient.age ? <span className="patient-tag">{ar.patient.agePrefix} {patient.age}</span> : null}
              {patient.highRisk ? (
                <span className="patient-tag" data-tone="attention">{ar.patients.highRisk}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="identity-meta">
          <div className="identity-tile identity-tile--visit" data-tone={visitStatus}>
            <span className="patient-calendar" aria-hidden="true" />
            <div className="min-w-0">
              <span className="identity-label">{ar.patient.nextVisit}</span>
              {nextVisit ? (
                <time dateTime={nextVisit}>{formatDisplayDate(nextVisit)}</time>
              ) : (
                <span>{ar.patient.noNext}</span>
              )}
            </div>
            {visitStatus ? (
              <span className="patient-tag" data-tone={visitStatus}>
                {visitStatus === "overdue" ? ar.patients.badgeOverdue : ar.patients.badgeToday}
              </span>
            ) : null}
          </div>

          <a href={`tel:${patient.phone}`} className="identity-tile identity-tile--call">
            <PhoneIcon />
            <div className="min-w-0">
              <span className="identity-label">{ar.patient.call}</span>
              <bdi dir="ltr" className="patient-phone">{patient.phone}</bdi>
            </div>
          </a>
        </div>

        <div className="profile-actions">
          <Link href={`/patients/${patient.id}/visit`} className="clinic-button clinic-button--primary">
            {ar.patient.addVisit}
          </Link>
          <Link href={`/patients/${patient.id}/note`} className="clinic-button clinic-button--secondary">
            {ar.patient.addNote}
          </Link>
        </div>
      </Card>

      <div className="profile-tabs" data-tab={tab}>
        <span className="profile-tabs-thumb" aria-hidden="true" />
        <button type="button" onClick={() => setTab("timeline")} aria-pressed={tab === "timeline"}>
          {ar.patient.timeline}
        </button>
        <button type="button" onClick={() => setTab("profile")} aria-pressed={tab === "profile"}>
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
          <div className="timeline-list">
            {entries.map((entry) => {
              const kindLabel = entry.kind === "visit"
                ? visitTypeLabel[entry.visitType || "other"]
                : ar.patient.quickNote;
              return (
                <Card key={entry.id} className="timeline-entry">
                  <span className="timeline-rail" data-kind={entry.kind} aria-hidden="true" />
                  <div className="min-w-0">
                    <div className="timeline-entry-head">
                      <p>{kindLabel}</p>
                      <time dateTime={entry.date}>{formatDisplayDate(entry.date)}</time>
                    </div>
                    <p className="timeline-notes">{entry.notes}</p>
                    {entry.nextVisitDate ? (
                      <p className="timeline-next">
                        {ar.patient.nextVisit} · {formatDisplayDate(entry.nextVisitDate)}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      className="timeline-delete"
                      onClick={() => setPendingDelete({ kind: "entry", entry })}
                    >
                      {ar.patient.deleteEntry}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <Card className="profile-section profile-section--contact">
            <h3 className="profile-section-title">{ar.patient.personal}</h3>
            <dl className="profile-facts">
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
                wide
                value={
                  patient.emergencyName
                    ? `${patient.emergencyName} · ${patient.emergencyPhone || ""}`
                    : ar.common.dash
                }
              />
            </dl>
          </Card>

          <Card className="profile-section profile-section--condition">
            <h3 className="profile-section-title">{ar.patient.condition}</h3>
            <dl className="profile-facts">
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
                    wide
                    value={patient.babyNotes || ar.common.dash}
                  />
                </>
              ) : null}
              {patient.patientType === "gynecology" ||
              patient.patientType === "other" ? (
                <Row
                  label={ar.patient.reason}
                  wide
                  value={patient.mainReason || ar.common.dash}
                />
              ) : null}
            </dl>
          </Card>

          <Card className="profile-section profile-section--history">
            <h3 className="profile-section-title">{ar.patient.history}</h3>
            <div className="profile-flag-list">
              {patient.healthFlags.length === 0 ? (
                <p className="text-[var(--muted)]">{ar.patient.noFlags}</p>
              ) : (
                patient.healthFlags.map((flag) => (
                  <span key={flag}>{healthFlagLabel[flag]}</span>
                ))
              )}
            </div>
            <dl className="profile-facts">
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
                ltr
                value={patient.bloodType || ar.common.dash}
              />
              <Row
                label={ar.patient.notes}
                wide
                value={patient.historyNotes || ar.common.dash}
              />
            </dl>
          </Card>

          <section className="profile-manage" aria-label={ar.patient.manage}>
            <Link href={`/patients/${patient.id}/edit`} className="clinic-button clinic-button--secondary">
              {ar.patient.editDetails}
            </Link>
            <button type="button" className="timeline-delete" onClick={() => setPendingDelete({ kind: "patient" })}>
              {ar.patient.deletePatient}
            </button>
          </section>
        </div>
      )}
      <ConfirmDialog
        open={pendingDelete !== null}
        title={pendingDelete?.kind === "entry" ? ar.patient.deleteEntryTitle : ar.patient.deletePatientTitle}
        description={
          pendingDelete?.kind === "entry"
            ? ar.patient.deleteEntryBody(entryDeleteLabel(pendingDelete.entry))
            : ar.patient.deletePatientBody(patient.fullName)
        }
        confirmLabel={ar.common.delete}
        onConfirm={() => {
          if (pendingDelete?.kind === "entry") {
            deleteTimelineEntry(pendingDelete.entry.id);
            setPendingDelete(null);
            return;
          }
          const id = patient.id;
          setPendingDelete(null);
          router.replace("/patients");
          deletePatient(id);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function entryDeleteLabel(entry: TimelineEntry) {
  const kind = entry.kind === "visit"
    ? visitTypeLabel[entry.visitType || "other"]
    : ar.patient.quickNote;
  return `${kind} · ${formatDisplayDate(entry.date)}`;
}

function PhoneIcon() {
  return (
    <span className="identity-call-icon" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M7.2 4.8h2.1l1.2 3-1.6 1a12 12 0 0 0 5.3 5.3l1-1.6 3 1.2v2.1c0 .8-.7 1.5-1.5 1.4A15.5 15.5 0 0 1 5.8 6.3c-.1-.8.6-1.5 1.4-1.5Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Row({
  label,
  value,
  ltr,
  wide,
}: {
  label: string;
  value: string;
  ltr?: boolean;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "profile-fact profile-fact--wide" : "profile-fact"}>
      <dt>{label}</dt>
      <dd dir={ltr ? "ltr" : undefined}>{value}</dd>
    </div>
  );
}
