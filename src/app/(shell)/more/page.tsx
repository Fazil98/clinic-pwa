"use client";

import { PageHeader, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";

export default function MorePage() {
  const { resetDemoData } = useClinic();

  return (
    <div>
      <PageHeader title={ar.more.title} subtitle={ar.more.subtitle} />

      <section className="mb-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl font-bold">{ar.more.installTitle}</h2>
        <ol className="mt-4 space-y-3 text-base text-[var(--ink-soft)]">
          <li>{ar.more.install1}</li>
          <li>{ar.more.install2}</li>
          <li>{ar.more.install3}</li>
          <li>{ar.more.install4}</li>
        </ol>
      </section>

      <section className="mb-6 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="text-xl font-bold">{ar.more.aboutTitle}</h2>
        <p className="mt-2 text-base leading-7 text-[var(--muted)]">
          {ar.more.aboutBody}
        </p>
        <div className="mt-4 space-y-3">
          <SecondaryButton
            type="button"
            onClick={() => {
              if (confirm(ar.more.resetConfirm)) {
                resetDemoData();
              }
            }}
          >
            {ar.more.reset}
          </SecondaryButton>
          <PrimaryButton
            type="button"
            onClick={() => alert(ar.more.lockAlert)}
          >
            {ar.more.lockSoon}
          </PrimaryButton>
        </div>
      </section>
    </div>
  );
}
