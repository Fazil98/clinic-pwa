"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { newId } from "@/lib/clinic-utils";
import { MOCK_PATIENTS, MOCK_TIMELINE } from "@/lib/mock-data";
import type { Patient, TimelineEntry } from "@/lib/types";

const STORAGE_KEY = "clinic-pwa-mock-v2-ar";

interface StoredState {
  patients: Patient[];
  timeline: TimelineEntry[];
}

interface ClinicContextValue {
  ready: boolean;
  patients: Patient[];
  timeline: TimelineEntry[];
  getPatient: (id: string) => Patient | undefined;
  getPatientTimeline: (id: string) => TimelineEntry[];
  addPatient: (
    input: Omit<Patient, "id" | "createdAt" | "updatedAt">,
  ) => Patient;
  updatePatient: (id: string, patch: Partial<Patient>) => void;
  addVisit: (input: {
    patientId: string;
    date: string;
    visitType: NonNullable<TimelineEntry["visitType"]>;
    notes: string;
    nextVisitDate?: string;
  }) => TimelineEntry;
  addNote: (input: {
    patientId: string;
    date: string;
    notes: string;
  }) => TimelineEntry;
  resetDemoData: () => void;
}

const ClinicContext = createContext<ClinicContextValue | null>(null);

function loadState(): StoredState {
  if (typeof window === "undefined") {
    return { patients: MOCK_PATIENTS, timeline: MOCK_TIMELINE };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { patients: MOCK_PATIENTS, timeline: MOCK_TIMELINE };
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed.patients?.length) {
      return { patients: MOCK_PATIENTS, timeline: MOCK_TIMELINE };
    }
    return parsed;
  } catch {
    return { patients: MOCK_PATIENTS, timeline: MOCK_TIMELINE };
  }
}

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(MOCK_TIMELINE);

  useEffect(() => {
    const state = loadState();
    setPatients(state.patients);
    setTimeline(state.timeline);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ patients, timeline } satisfies StoredState),
    );
  }, [patients, timeline, ready]);

  const getPatient = useCallback(
    (id: string) => patients.find((p) => p.id === id),
    [patients],
  );

  const getPatientTimeline = useCallback(
    (id: string) =>
      timeline
        .filter((e) => e.patientId === id)
        .sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.createdAt.localeCompare(a.createdAt),
        ),
    [timeline],
  );

  const addPatient = useCallback(
    (input: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const patient: Patient = {
        ...input,
        id: newId("p"),
        createdAt: now,
        updatedAt: now,
      };
      setPatients((prev) => [patient, ...prev]);
      return patient;
    },
    [],
  );

  const updatePatient = useCallback((id: string, patch: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...patch, id: p.id, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  }, []);

  const addVisit = useCallback(
    (input: {
      patientId: string;
      date: string;
      visitType: NonNullable<TimelineEntry["visitType"]>;
      notes: string;
      nextVisitDate?: string;
    }) => {
      const entry: TimelineEntry = {
        id: newId("t"),
        patientId: input.patientId,
        kind: "visit",
        date: input.date,
        visitType: input.visitType,
        notes: input.notes,
        nextVisitDate: input.nextVisitDate || undefined,
        createdAt: new Date().toISOString(),
      };
      setTimeline((prev) => [entry, ...prev]);
      setPatients((prev) =>
        prev.map((p) =>
          p.id === input.patientId
            ? { ...p, updatedAt: new Date().toISOString() }
            : p,
        ),
      );
      return entry;
    },
    [],
  );

  const addNote = useCallback(
    (input: { patientId: string; date: string; notes: string }) => {
      const entry: TimelineEntry = {
        id: newId("t"),
        patientId: input.patientId,
        kind: "note",
        date: input.date,
        notes: input.notes,
        createdAt: new Date().toISOString(),
      };
      setTimeline((prev) => [entry, ...prev]);
      setPatients((prev) =>
        prev.map((p) =>
          p.id === input.patientId
            ? { ...p, updatedAt: new Date().toISOString() }
            : p,
        ),
      );
      return entry;
    },
    [],
  );

  const resetDemoData = useCallback(() => {
    setPatients(MOCK_PATIENTS);
    setTimeline(MOCK_TIMELINE);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        patients: MOCK_PATIENTS,
        timeline: MOCK_TIMELINE,
      } satisfies StoredState),
    );
  }, []);

  const value = useMemo(
    () => ({
      ready,
      patients,
      timeline,
      getPatient,
      getPatientTimeline,
      addPatient,
      updatePatient,
      addVisit,
      addNote,
      resetDemoData,
    }),
    [
      ready,
      patients,
      timeline,
      getPatient,
      getPatientTimeline,
      addPatient,
      updatePatient,
      addVisit,
      addNote,
      resetDemoData,
    ],
  );

  return (
    <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>
  );
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}
