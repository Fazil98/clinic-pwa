import { describe, expect, it } from "vitest";
import { patientToInsert, patientToUpdate } from "@/lib/clinic-db";
import type { Patient } from "@/lib/types";

const input = {
  fullName: "سارة أحمد",
  phone: "",
  patientType: "other",
  healthFlags: [],
  highRisk: false,
} satisfies Omit<Patient, "id" | "createdAt" | "updatedAt">;

describe("patient phone", () => {
  it("stores a blank phone when the number is left out", () => {
    expect(patientToInsert(input).phone).toBe("");
  });

  it("clears a saved phone when the field is emptied", () => {
    expect(patientToUpdate({ phone: "  " }).phone).toBe("");
  });
});
