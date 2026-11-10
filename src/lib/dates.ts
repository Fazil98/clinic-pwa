/** Fixed calendar day used for mock demo data (not "now"). */
export const DEMO_ANCHOR_DATE = "2026-11-10";

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatDisplayDate(iso?: string): string {
  if (!iso) return "—";
  const d = parseISODate(iso);
  return d.toLocaleDateString("ar", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function addDaysISO(iso: string, days: number): string {
  const d = parseISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

/** Estimate gestational week from LMP or due date (due = LMP + 280 days). */
export function estimateGestationalWeek(opts: {
  lmpDate?: string;
  dueDate?: string;
  override?: number;
  /** Required for live calculation — pass today from the client. */
  onDate?: string;
}): number | undefined {
  if (typeof opts.override === "number") return opts.override;
  if (!opts.onDate) return undefined;
  const on = parseISODate(opts.onDate);
  let lmp: Date | undefined;
  if (opts.lmpDate) lmp = parseISODate(opts.lmpDate);
  else if (opts.dueDate) {
    lmp = parseISODate(opts.dueDate);
    lmp.setDate(lmp.getDate() - 280);
  }
  if (!lmp) return undefined;
  const diffMs = on.getTime() - lmp.getTime();
  const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
  if (weeks < 0) return 0;
  if (weeks > 42) return 42;
  return weeks;
}

export function isBeforeDay(a: string, b: string): boolean {
  return a < b;
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}
