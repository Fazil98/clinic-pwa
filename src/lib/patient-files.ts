import { createClient } from "@/lib/supabase/client";
import type { MedicalImageKind, PatientFile } from "@/lib/types";

const KINDS = new Set<MedicalImageKind>(["ultrasound", "lab", "other"]);

interface PatientFileRow {
  id: string;
  patient_id: string;
  kind: string;
  file_name: string;
  storage_path: string;
  created_at: string;
}

export function rowToPatientFile(row: PatientFileRow): PatientFile | null {
  if (!KINDS.has(row.kind as MedicalImageKind)) return null;
  return {
    id: row.id,
    patientId: row.patient_id,
    kind: row.kind as MedicalImageKind,
    fileName: row.file_name,
    storagePath: row.storage_path,
    createdAt: row.created_at,
  };
}

/** Store one already-compressed medical image for a patient. */
export async function storeMedicalImage(input: {
  patientId: string;
  kind: MedicalImageKind;
  blob: Blob;
  fileName: string;
}): Promise<PatientFile | null> {
  const supabase = createClient();
  const id = crypto.randomUUID();
  const path = `${input.patientId}/${id}.jpg`;
  const uploaded = await supabase.storage.from("patient-files").upload(path, input.blob, {
    contentType: "image/jpeg",
    upsert: false,
  });
  if (uploaded.error) return null;
  const inserted = await supabase
    .from("patient_files")
    .insert({
      id,
      patient_id: input.patientId,
      kind: input.kind,
      file_name: input.fileName.slice(0, 180) || "image.jpg",
      storage_path: path,
    })
    .select("id, patient_id, kind, file_name, storage_path, created_at")
    .single();
  if (inserted.error || !inserted.data) {
    await supabase.storage.from("patient-files").remove([path]);
    return null;
  }
  return rowToPatientFile(inserted.data as PatientFileRow);
}
