"use client";

import Link from "next/link";
import { PatientRow } from "@/components/PatientRow";
import { EmptyState, ListSkeleton, PageHeader } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { getTodayItems, type TodayItem } from "@/lib/clinic-utils";
import { parseISODate } from "@/lib/dates";
import { useClientToday } from "@/lib/use-client-today";

const dateFormat = new Intl.DateTimeFormat("ar-IQ-u-nu-latn", {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const numberFormat = new Intl.NumberFormat("ar-IQ-u-nu-latn");

export default function TodayPage() {
  const today = useClientToday();
  const { patients, timeline, ready } = useClinic();
  const items = getTodayItems(patients, timeline, today);
  const overdue = items.filter((item) => item.status === "overdue");
  const dueToday = items.filter((item) => item.status === "today");

  return (
    <>
      <PageHeader title={ar.today.title}>
        <time dateTime={today} suppressHydrationWarning>
          {dateFormat.format(parseISODate(today))}
        </time>
      </PageHeader>

      <section className="schedule-card" aria-label={ar.today.title}>
        <div className="schedule-art" aria-hidden="true">
          <span className="schedule-scope" />
          <span className="schedule-chestpiece" />
          <span className="schedule-cross" />
        </div>
        <dl className="schedule-counts">
          <div>
            <dt>{ar.today.scheduledToday}</dt>
            <dd>{ready ? numberFormat.format(dueToday.length) : "—"}</dd>
          </div>
          <div>
            <dt>{ar.today.overdueLabel}</dt>
            <dd className="schedule-overdue">{ready ? numberFormat.format(overdue.length) : "—"}</dd>
          </div>
        </dl>
      </section>

      <div className="today-actions">
        <Link href="/patients/new" className="action-tile">
          <span className="action-icon action-icon--blue" aria-hidden="true"><span className="glyph-plus" /></span>
          <strong>{ar.add.newPatientTitle}</strong>
        </Link>
        <Link href="/patients" className="action-tile action-tile--mint">
          <span className="action-icon action-icon--mint" aria-hidden="true"><span className="glyph-search" /></span>
          <strong>{ar.today.findPatient}</strong>
        </Link>
      </div>

      {!ready ? (
        <ListSkeleton />
      ) : items.length ? (
        <div className="follow-up-lists">
          <FollowUpList title={ar.today.needsFollowUp} items={overdue} tone="overdue" />
          <FollowUpList title={ar.today.scheduledToday} items={dueToday} tone="due" />
        </div>
      ) : (
        <EmptyState
          title={ar.today.emptyTitle}
          body={ar.today.emptyBody}
          action={
            <Link href="/patients/new" className="clinic-button clinic-button--primary">
              {ar.add.newPatientTitle}
            </Link>
          }
        />
      )}
    </>
  );
}

function FollowUpList({ title, items, tone }: { title: string; items: TodayItem[]; tone: "due" | "overdue" }) {
  if (!items.length) return null;

  return (
    <section className="follow-up-list" data-tone={tone}>
      <h2>{title}</h2>
      <ul className="space-y-2">
        {items.map(({ patient, nextVisitDate, status }) => (
          <li key={patient.id}>
            <PatientRow patient={patient} nextVisitDate={nextVisitDate} badge={status} />
          </li>
        ))}
      </ul>
    </section>
  );
}
