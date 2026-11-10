"use client";

import { PatientRow } from "@/components/PatientRow";
import { EmptyState, PageHeader } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { getTodayItems } from "@/lib/clinic-utils";
import { useClientToday } from "@/lib/use-client-today";

export default function TodayPage() {
  const today = useClientToday();
  const { patients, timeline, ready } = useClinic();
  const items = getTodayItems(patients, timeline, today);
  const overdue = items.filter((i) => i.status === "overdue");
  const dueToday = items.filter((i) => i.status === "today");

  return (
    <div>
      <PageHeader
        title={ar.today.title}
        subtitle={
          ready
            ? ar.today.subtitle(dueToday.length, overdue.length)
            : "…"
        }
      />

      {!ready ? (
        <EmptyState
          title={ar.today.loadingTitle}
          body={ar.today.loadingBody}
        />
      ) : items.length === 0 ? (
        <EmptyState title={ar.today.emptyTitle} body={ar.today.emptyBody} />
      ) : (
        <div className="space-y-6">
          {overdue.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-[var(--warn-ink)]">
                {ar.today.needsFollowUp}
              </h2>
              {overdue.map((item) => (
                <PatientRow
                  key={item.patient.id}
                  patient={item.patient}
                  nextVisitDate={item.nextVisitDate}
                  badge="overdue"
                />
              ))}
            </section>
          ) : null}

          {dueToday.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-[var(--primary)]">
                {ar.today.scheduledToday}
              </h2>
              {dueToday.map((item) => (
                <PatientRow
                  key={item.patient.id}
                  patient={item.patient}
                  nextVisitDate={item.nextVisitDate}
                  badge="today"
                />
              ))}
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
