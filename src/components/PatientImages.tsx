"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { MedicalThumb } from "@/components/MedicalThumb";
import { Card, Chip } from "@/components/ui";
import { ar, medicalImageKindAr } from "@/lib/ar";
import { compressMedicalImage } from "@/lib/compress-image";
import { formatDisplayDate, toISODate } from "@/lib/dates";
import { rowToPatientFile, storeMedicalImage } from "@/lib/patient-files";
import { createClient } from "@/lib/supabase/client";
import type { MedicalImageKind, PatientFile } from "@/lib/types";

const KINDS = Object.keys(medicalImageKindAr) as MedicalImageKind[];
const SIGNED_URL_SECONDS = 60 * 30;

interface PatientFileRow {
  id: string;
  patient_id: string;
  kind: string;
  file_name: string;
  storage_path: string;
  created_at: string;
}

async function signedUrl(path: string) {
  const { data } = await createClient()
    .storage
    .from("patient-files")
    .createSignedUrl(path, SIGNED_URL_SECONDS);
  return data?.signedUrl ?? "";
}

export function PatientImages({
  patientId,
  canDelete,
}: {
  patientId: string;
  canDelete: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const savingRef = useRef(false);
  const deletingRef = useRef(false);
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [kind, setKind] = useState<MedicalImageKind>("ultrasound");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<PatientFile | null>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data, error: loadError } = await createClient()
        .from("patient_files")
        .select("id, patient_id, kind, file_name, storage_path, created_at")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });
      if (!active) return;
      if (loadError || !data) {
        setError(ar.common.loadFailed);
        return;
      }
      const next = (data as PatientFileRow[])
        .map(rowToPatientFile)
        .filter((file): file is PatientFile => file !== null);
      const nextUrls = Object.fromEntries(
        await Promise.all(next.map(async (file) => [file.id, await signedUrl(file.storagePath)] as const)),
      );
      if (!active) return;
      setFiles((current) => {
        const ids = new Set(next.map((file) => file.id));
        return [...current.filter((file) => !ids.has(file.id)), ...next];
      });
      setUrls((current) => ({ ...current, ...nextUrls }));
    })();
    return () => {
      active = false;
    };
  }, [patientId]);

  async function onPick(file: File | undefined) {
    if (!file || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      const blob = await compressMedicalImage(file);
      const saved = await storeMedicalImage({
        patientId,
        kind,
        blob,
        fileName: file.name,
      });
      if (!saved) throw new Error("upload");
      const url = await signedUrl(saved.storagePath);
      setFiles((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      setUrls((current) => ({ ...current, [saved.id]: url }));
    } catch (caught) {
      const unsupported = caught instanceof Error && caught.message === "unsupported";
      setError(unsupported ? ar.patient.imagesUnsupported : ar.common.saveFailed);
    } finally {
      savingRef.current = false;
      setSaving(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function confirmDelete() {
    if (!pending || deletingRef.current) return;
    const file = pending;
    deletingRef.current = true;
    setDeleting(true);
    setError("");
    setFiles((current) => current.filter((item) => item.id !== file.id));
    const { data, error: deleteError } = await createClient()
      .from("patient_files")
      .delete()
      .eq("id", file.id)
      .select("id");
    if (deleteError || !data?.length) {
      setFiles((current) => (current.some((item) => item.id === file.id) ? current : [file, ...current]));
      setError(ar.common.saveFailed);
      deletingRef.current = false;
      setDeleting(false);
      return;
    }
    await createClient().storage.from("patient-files").remove([file.storagePath]);
    setPending(null);
    deletingRef.current = false;
    setDeleting(false);
  }

  return (
    <Card className="profile-section profile-section--history">
      <h3 className="profile-section-title">{ar.patient.imagesTitle}</h3>
      <p className="text-sm leading-6 text-[var(--muted)]">{ar.patient.imagesBody}</p>
      <div className="mt-3">
        <p className="text-sm font-semibold">{ar.patient.imagesKind}</p>
        <div className="medical-kind" role="group" aria-label={ar.patient.imagesKind}>
          {KINDS.map((item) => (
            <Chip
              key={item}
              active={kind === item}
              onClick={() => {
                if (!saving) setKind(item);
              }}
            >
              {medicalImageKindAr[item]}
            </Chip>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="clinic-button clinic-button--primary mt-3 w-full"
        disabled={saving}
        onClick={() => inputRef.current?.click()}
      >
        {saving ? ar.common.saving : ar.patient.imagesAdd}
      </button>
      <input
        ref={inputRef}
        id={inputId}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={saving}
        onChange={(event) => void onPick(event.target.files?.[0])}
      />
      {error ? <p className="mt-3 text-sm font-semibold text-[var(--danger)]" role="alert">{error}</p> : null}
      {files.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">{ar.patient.imagesEmpty}</p>
      ) : (
        <div className="medical-images">
          {files.map((file) => {
            const label = medicalImageKindAr[file.kind];
            const day = formatDisplayDate(toISODate(new Date(file.createdAt)));
            return (
              urls[file.id] ? (
                <MedicalThumb
                  key={file.id}
                  src={urls[file.id]}
                  label={label}
                  when={file.createdAt}
                  whenLabel={day}
                  onDelete={canDelete ? () => setPending(file) : undefined}
                  deleteDisabled={deleting}
                />
              ) : (
                <div key={file.id} className="skeleton-row" />
              )
            );
          })}
        </div>
      )}
      <ConfirmDialog
        open={pending !== null}
        busy={deleting}
        error={error && pending ? error : undefined}
        title={ar.patient.imagesDeleteTitle}
        description={ar.patient.imagesDeleteBody(pending ? medicalImageKindAr[pending.kind] : "")}
        confirmLabel={ar.common.delete}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (deletingRef.current) return;
          setPending(null);
          setError("");
        }}
      />
    </Card>
  );
}
