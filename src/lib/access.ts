export type StaffRole = "doctor" | "secretary";

export function staffRole(value: unknown): StaffRole | null {
  if (value === "doctor" || value === "secretary") return value;
  return null;
}

/** Delete is a doctor action. The database enforces the same rule. */
export function canDeleteRecords(role: StaffRole | null): boolean {
  return role === "doctor";
}
