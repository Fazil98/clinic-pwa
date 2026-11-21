"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Icon } from "@/components/Icon";
import { PatientImages } from "@/components/PatientImages";
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
import type { Patient, TimelineEntry } from "@/lib/types";

export default function PatientDetailPage() {
  const today = useClientToday();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { getPatient, getPatientTimeline, timeline, ready, canDelete, deletePatient, deleteTimelineEntry } = useClinic();
  const patient = getPatient(params.id);
  const entries = getPatientTimeline(params.id);
  const [tab, setTab] = useState<"timeline" | "profile">("timeline");
  const [pendingDelete, setPendingDelete] = useState<
    { kind: "patient" } | { kind: "entry"; entry: TimelineEntry } | null
  >(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [heldPatient, setHeldPatient] = useState<Patient | null>(null);
  const deletingRef = useRef(false);
  const shown = patient ?? heldPatient;

  useEffect(() => {
    if (patient) setHeldPatient(null);
  }, [patient]);
  const nextVisit = shown
    ? activeNextVisit(timeline, shown.id)
    : undefined;

  const visitStatus = nextVisit === today ? "today" : nextVisit && nextVisit < today ? "overdue" : undefined;

  if (!ready) {
    return <ListSkeleton />;
  }

  if (!shown) {
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
            <h1 className="identity-title" dir="auto">{shown.fullName}</h1>
            <p className="identity-condition">{patientStatusLabel(shown, today)}</p>
            {shown.age || shown.highRisk ? (
              <div className="patient-tags">
                {shown.age ? <span className="patient-tag">{ar.patient.agePrefix} {shown.age}</span> : null}
                {shown.highRisk ? (
                  <span className="patient-tag" data-tone="attention">{ar.patients.highRisk}</span>
                ) : null}
              </div>
            ) : null}
          </div>
          <div className="identity-tools" aria-label={ar.patient.manage}>
            <Link href={`/patients/${shown.id}/edit`} className="identity-tool">
              {ar.patient.editDetails}
            </Link>
            {canDelete ? (
              <button type="button" className="identity-tool identity-tool--danger" onClick={() => setPendingDelete({ kind: "patient" })}>
                {ar.patient.deletePatient}
              </button>
            ) : null}
          </div>
        </div>

        <div className="identity-meta">
          <div className="identity-tile identity-tile--visit" data-tone={visitStatus}>
            <Icon name="calendar" className="patient-calendar" />
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

          {shown.phone.trim() ? (
            <a href={`tel:${shown.phone}`} className="identity-tile identity-tile--call">
              <PhoneIcon />
              <div className="min-w-0">
                <span className="identity-label">{ar.patient.call}</span>
                <bdi dir="ltr" className="patient-phone">{shown.phone}</bdi>
              </div>
            </a>
          ) : null}
        </div>

        <div className="profile-actions">
          <Link href={`/patients/${shown.id}/visit`} className="clinic-button clinic-button--primary">
            {ar.patient.addVisit}
          </Link>
          <Link href={`/patients/${shown.id}/note`} className="clinic-button clinic-button--secondary">
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
                    {canDelete ? (
                      <button
                        type="button"
                        className="timeline-delete"
                        onClick={() => setPendingDelete({ kind: "entry", entry })}
                      >
                        {ar.patient.deleteEntry}
                      </button>
                    ) : null}
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
              <Row label={ar.patient.phone} value={shown.phone.trim() || ar.common.dash} ltr />
              <Row
                label={ar.patient.age}
                value={shown.age?.toString() || ar.common.dash}
              />
              <Row
                label={ar.patient.area}
                value={shown.area || ar.common.dash}
              />
              <Row
                label={ar.patient.emergency}
                wide
                value={
                  shown.emergencyName
                    ? `${shown.emergencyName} · ${shown.emergencyPhone || ""}`
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
                value={patientTypeLabel[shown.patientType]}
              />
              {shown.patientType === "pregnant" ? (
                <>
                  <Row
                    label={ar.patient.dueDate}
                    value={formatDisplayDate(shown.dueDate)}
                  />
                  <Row
                    label={ar.patient.lmp}
                    value={formatDisplayDate(shown.lmpDate)}
                  />
                  <Row
                    label={ar.patient.previousPregnancies}
                    value={
                      shown.previousPregnancies?.toString() || ar.common.dash
                    }
                  />
                  <Row
                    label={ar.patient.previousCSection}
                    value={
                      shown.previousCSection === undefined
                        ? ar.common.dash
                        : shown.previousCSection
                          ? ar.patient.yes
                          : ar.patient.no
                    }
                  />
                </>
              ) : null}
              {shown.patientType === "postpartum" ? (
                <>
                  <Row
                    label={ar.patient.delivery}
                    value={formatDisplayDate(shown.deliveryDate)}
                  />
                  <Row
                    label={ar.patient.birthType}
                    value={
                      shown.birthType === "csection"
                        ? ar.patient.csection
                        : shown.birthType === "normal"
                          ? ar.patient.normalBirth
                          : ar.common.dash
                    }
                  />
                  <Row
                    label={ar.patient.babyNotes}
                    wide
                    value={shown.babyNotes || ar.common.dash}
                  />
                </>
              ) : null}
              {shown.patientType === "gynecology" ||
              shown.patientType === "other" ? (
                <Row
                  label={ar.patient.reason}
                  wide
                  value={shown.mainReason || ar.common.dash}
                />
              ) : null}
            </dl>
          </Card>

          <Card className="profile-section profile-section--history">
            <h3 className="profile-section-title">{ar.patient.history}</h3>
            <div className="profile-flag-list">
              {shown.healthFlags.length === 0 ? (
                <p className="text-[var(--muted)]">{ar.patient.noFlags}</p>
              ) : (
                shown.healthFlags.map((flag) => (
                  <span key={flag}>{healthFlagLabel[flag]}</span>
                ))
              )}
            </div>
            <dl className="profile-facts">
              <Row
                label={ar.patient.allergy}
                value={shown.allergyNote || ar.common.dash}
              />
              <Row
                label={ar.patient.medicines}
                value={shown.medicines || ar.common.dash}
              />
              <Row
                label={ar.patient.bloodType}
                ltr
                value={shown.bloodType || ar.common.dash}
              />
              <Row
                label={ar.patient.notes}
                wide
                value={shown.historyNotes || ar.common.dash}
              />
            </dl>
          </Card>
          <PatientImages patientId={shown.id} canDelete={canDelete} />
        </div>
      )}
      <ConfirmDialog
        open={pendingDelete !== null}
        busy={deleting}
        error={deleteError ? ar.common.saveFailed : undefined}
        title={pendingDelete?.kind === "entry" ? ar.patient.deleteEntryTitle : ar.patient.deletePatientTitle}
        description={
          pendingDelete?.kind === "entry"
            ? ar.patient.deleteEntryBody(entryDeleteLabel(pendingDelete.entry))
            : ar.patient.deletePatientBody(shown.fullName)
        }
        confirmLabel={ar.common.delete}
        onConfirm={() => {
          if (deletingRef.current || !pendingDelete) return;
          deletingRef.current = true;
          setDeleting(true);
          setDeleteError(false);
          const request = pendingDelete;
          void (async () => {
            if (request.kind === "entry") {
              const ok = await deleteTimelineEntry(request.entry.id);
              deletingRef.current = false;
              setDeleting(false);
              if (ok) setPendingDelete(null);
              else setDeleteError(true);
              return;
            }
            setHeldPatient(shown);
            const ok = await deletePatient(shown.id);
            deletingRef.current = false;
            setDeleting(false);
            if (ok) {
              setPendingDelete(null);
              router.replace("/patients");
              return;
            }
            setDeleteError(true);
          })();
        }}
        onCancel={() => {
          if (deletingRef.current) return;
          setPendingDelete(null);
          setDeleteError(false);
        }}
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
      <Icon name="phone" />
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
