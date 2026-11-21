import { describe, expect, it } from "vitest";
import {
  removePatientRecords,
  removeTimelineEntry,
  restorePatientRecords,
  restoreTimelineEntry,
  searchPatients,
  type ClinicRecords,
} from "@/lib/clinic-utils";
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

describe("restorePatientRecords", () => {
  it("puts the patient and her visits back after a failed delete", () => {
    const current = records();
    const removed = current.patients[0];
    const removedEntries = current.timeline.filter((entry) => entry.patientId === "p1");
    const deleted = removePatientRecords(current, "p1");

    const restored = restorePatientRecords(deleted, removed, removedEntries);

    expect(restored.patients.map((item) => item.id)).toEqual(["p1", "p2"]);
    expect(restored.timeline.map((item) => item.id)).toEqual(["t1", "t2", "t3"]);
  });

  it("does not duplicate a patient who is already on the list", () => {
    const current = records();

    const restored = restorePatientRecords(current, current.patients[0], current.timeline);

    expect(restored.patients.map((item) => item.id)).toEqual(["p1", "p2"]);
    expect(restored.timeline).toBe(current.timeline);
  });
});

describe("restoreTimelineEntry", () => {
  it("puts one visit back and leaves the other entries", () => {
    const current = records();
    const removed = current.timeline[0];
    const deleted = removeTimelineEntry(current, removed.id);

    const restored = restoreTimelineEntry(deleted, removed);

    expect(restored.timeline.map((item) => item.id)).toEqual(["t1", "t2", "t3"]);
    expect(restored.patients).toBe(deleted.patients);
  });
});

describe("searchPatients", () => {
  it("finds a patient by name when she has no phone number", () => {
    const blank = { ...patient("p1"), phone: "" };

    expect(searchPatients([blank], "سارة").map((item) => item.id)).toEqual(["p1"]);
  });

  it("does not match an empty phone number against a digit search", () => {
    const blank = { ...patient("p1"), phone: "" };

    expect(searchPatients([blank], "0770")).toEqual([]);
  });
});
