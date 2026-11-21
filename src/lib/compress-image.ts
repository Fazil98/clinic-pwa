export const MEDICAL_IMAGE_MAX_EDGE = 1600;
export const MEDICAL_IMAGE_TARGET_BYTES = 500_000;

const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Longest side stays within the limit. Smaller pictures are not enlarged. */
export function fittedSize(width: number, height: number, maxEdge = MEDICAL_IMAGE_MAX_EDGE) {
  const longest = Math.max(width, height, 1);
  const scale = Math.min(1, maxEdge / longest);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Shrink a sonar or lab picture on the phone before it is stored. */
export async function compressMedicalImage(file: File): Promise<Blob> {
  if (!ACCEPTED_TYPES.has(file.type)) throw new Error("unsupported");
  const bitmap = await createImageBitmap(file);
  try {
    const size = fittedSize(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas");
    context.drawImage(bitmap, 0, 0, size.width, size.height);
    let last: Blob | null = null;
    for (const quality of [0.82, 0.7, 0.55]) {
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", quality);
      });
      if (!blob) continue;
      last = blob;
      if (blob.size <= MEDICAL_IMAGE_TARGET_BYTES) return blob;
    }
    if (!last || last.size > 1_500_000) throw new Error("large");
    return last;
  } finally {
    bitmap.close();
  }
}
