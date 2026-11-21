import { describe, expect, it } from "vitest";
import { removePatientRecords, removeTimelineEntry, type ClinicRecords } from "@/lib/clinic-utils";
import type { Patient, TimelineEntry } from "@/lib/types";

function patient(id: string): Patient {
  return {
    id,
    fullName: id === "p1" ? "سارة أحمد" : "مريم حسن",
    phone: "0770000000",
    patientType: "pregnant",
    healthFlags: [],
    highRisk: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
  };
}

function entry(id: string, patientId: string): TimelineEntry {
  return {
    id,
    patientId,
    kind: "visit",
    date: "2026-11-21",
    visitType: "checkup",
    notes: "متابعة",
    nextVisitDate: "2026-11-21",
    createdAt: "2026-11-21T00:00:00.000Z",
  };
}

function records(): ClinicRecords {
  return {
    patients: [patient("p1"), patient("p2")],
    timeline: [entry("t1", "p1"), entry("t2", "p1"), entry("t3", "p2")],
  };
}

describe("removePatientRecords", () => {
  it("removes the patient and every visit or note that belongs to her", () => {
    const current = records();

    const next = removePatientRecords(current, "p1");

    expect(next.patients.map((item) => item.id)).toEqual(["p2"]);
    expect(next.timeline.map((item) => item.id)).toEqual(["t3"]);
  });

  it("returns the same records when the patient id is unknown", () => {
    const current = records();

    expect(removePatientRecords(current, "missing")).toBe(current);
  });
});

describe("removeTimelineEntry", () => {
  it("removes one entry and leaves the patient and her other entries", () => {
    const current = records();

    const next = removeTimelineEntry(current, "t1");

    expect(next.patients).toBe(current.patients);
    expect(next.timeline.map((item) => item.id)).toEqual(["t2", "t3"]);
    expect(next.patients.map((item) => item.id)).toEqual(["p1", "p2"]);
  });

  it("returns the same records when the entry id is unknown", () => {
    const current = records();

    expect(removeTimelineEntry(current, "missing")).toBe(current);
  });
});
