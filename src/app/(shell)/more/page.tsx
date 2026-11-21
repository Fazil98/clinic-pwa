"use client";

import { usePwa } from "@/components/PwaProvider";
import { Card, PageHeader, PrimaryButton, SecondaryButton } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";

const installSteps = [ar.more.install1, ar.more.install2, ar.more.install3, ar.more.install4];

export default function MorePage() {
  const { resetDemoData } = useClinic();
  const { canInstall, install } = usePwa();

  return (
    <>
      <PageHeader title={ar.more.title} subtitle={ar.more.subtitle} />
      <div className="space-y-3">
        <Card className="install-card">
          <div className="flex items-center gap-3">
            <span className="action-icon action-icon--mint" aria-hidden="true"><span className="glyph-plus" /></span>
            <h2 className="text-lg font-extrabold">{ar.more.installAppTitle}</h2>
          </div>
          {canInstall ? (
            <div className="mt-3">
              <PrimaryButton type="button" onClick={() => void install()}>
                {ar.pwa.installAndroid}
              </PrimaryButton>
            </div>
          ) : null}
          <details className="mt-3 rounded-xl bg-white p-3">
            <summary className="flex min-h-11 items-center font-extrabold text-[var(--primary-deep)]">
              {ar.more.installTitle}
            </summary>
            <ol className="space-y-2 pb-2 text-sm text-[var(--ink-soft)]">
              {installSteps.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </details>
        </Card>
        <Card>
          <h2 className="text-lg font-extrabold">{ar.more.aboutTitle}</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{ar.more.aboutBody}</p>
          <div className="mt-4">
            <SecondaryButton
              type="button"
              onClick={() => {
                if (confirm(ar.more.resetConfirm)) resetDemoData();
              }}
            >
              {ar.more.reset}
            </SecondaryButton>
          </div>
        </Card>
      </div>
    </>
  );
}
