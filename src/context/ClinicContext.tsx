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
import { canDeleteRecords, staffRole, type StaffRole } from "@/lib/access";
import {
  patientToInsert,
  patientToUpdate,
  rowToEntry,
  rowToPatient,
  type PatientRow,
  type TimelineRow,
} from "@/lib/clinic-db";
import { createClient } from "@/lib/supabase/client";
import { supabasePublicEnv } from "@/lib/supabase/env";
import type { Patient, TimelineEntry } from "@/lib/types";

const LEGACY_STORAGE_KEY = "clinic-pwa-mock-v2-ar";

interface ClinicContextValue {
  ready: boolean;
  loadError: boolean;
  role: StaffRole | null;
  canDelete: boolean;
  patients: Patient[];
  timeline: TimelineEntry[];
  getPatient: (id: string) => Patient | undefined;
  getPatientTimeline: (id: string) => TimelineEntry[];
  addPatient: (input: Omit<Patient, "id" | "createdAt" | "updatedAt">) => Promise<Patient | null>;
  updatePatient: (id: string, patch: Partial<Patient>) => Promise<boolean>;
  addVisit: (input: {
    patientId: string;
    date: string;
    visitType: NonNullable<TimelineEntry["visitType"]>;
    notes: string;
    nextVisitDate?: string;
  }) => Promise<TimelineEntry | null>;
  addNote: (input: {
    patientId: string;
    date: string;
    notes: string;
  }) => Promise<TimelineEntry | null>;
  deletePatient: (id: string) => Promise<boolean>;
  deleteTimelineEntry: (id: string) => Promise<boolean>;
}

const ClinicContext = createContext<ClinicContextValue | null>(null);

function clearLegacyStore() {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Private mode can refuse storage. There is nothing else to keep.
  }
}

async function readRole(): Promise<StaffRole | null> {
  if (!supabasePublicEnv()) return null;
  const { data, error } = await createClient().auth.getClaims();
  if (error || !data?.claims) return null;
  const metadata = data.claims.app_metadata as { role?: unknown } | undefined;
  return staffRole(metadata?.role);
}

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [role, setRole] = useState<StaffRole | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);

  const load = useCallback(async () => {
    clearLegacyStore();
    if (!supabasePublicEnv()) {
      setRole(null);
      setPatients([]);
      setTimeline([]);
      setLoadError(false);
      setReady(true);
      return;
    }
    const nextRole = await readRole();
    setRole(nextRole);
    if (!nextRole) {
      setPatients([]);
      setTimeline([]);
      setLoadError(false);
      setReady(true);
      return;
    }
    const supabase = createClient();
    const [patientResult, timelineResult] = await Promise.all([
      supabase.from("patients").select("*").order("updated_at", { ascending: false }),
      supabase.from("timeline_entries").select("*").order("created_at", { ascending: false }),
    ]);
    if (patientResult.error || timelineResult.error) {
      setPatients([]);
      setTimeline([]);
      setLoadError(true);
      setReady(true);
      return;
    }
    setPatients((patientResult.data as PatientRow[]).map(rowToPatient));
    setTimeline((timelineResult.data as TimelineRow[]).map(rowToEntry));
    setLoadError(false);
    setReady(true);
  }, []);

  useEffect(() => {
    let active = true;
    void load().then(() => {
      if (!active) return;
    });
    if (!supabasePublicEnv()) return () => {
      active = false;
    };
    const { data } = createClient().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setRole(null);
        setPatients([]);
        setTimeline([]);
        setLoadError(false);
        setReady(true);
        return;
      }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void load();
      }
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [load]);

  const getPatient = useCallback(
    (id: string) => patients.find((patient) => patient.id === id),
    [patients],
  );

  const getPatientTimeline = useCallback(
    (id: string) =>
      timeline
        .filter((entry) => entry.patientId === id)
        .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)),
    [timeline],
  );

  const touchPatient = useCallback(async (patientId: string) => {
    const updatedAt = new Date().toISOString();
    const { error } = await createClient()
      .from("patients")
      .update({ updated_at: updatedAt })
      .eq("id", patientId);
    if (error) return;
    setPatients((prev) =>
      prev.map((patient) => (patient.id === patientId ? { ...patient, updatedAt } : patient)),
    );
  }, []);

  const addPatient = useCallback(async (input: Omit<Patient, "id" | "createdAt" | "updatedAt">) => {
    const { data, error } = await createClient()
      .from("patients")
      .insert(patientToInsert(input))
      .select("*")
      .single();
    if (error || !data) return null;
    const patient = rowToPatient(data as PatientRow);
    setPatients((prev) => [patient, ...prev.filter((item) => item.id !== patient.id)]);
    return patient;
  }, []);

  const updatePatient = useCallback(async (id: string, patch: Partial<Patient>) => {
    const { data, error } = await createClient()
      .from("patients")
      .update(patientToUpdate(patch))
      .eq("id", id)
      .select("*")
      .single();
    if (error || !data) return false;
    const patient = rowToPatient(data as PatientRow);
    setPatients((prev) => prev.map((item) => (item.id === id ? patient : item)));
    return true;
  }, []);

  const addVisit = useCallback(async (input: {
    patientId: string;
    date: string;
    visitType: NonNullable<TimelineEntry["visitType"]>;
    notes: string;
    nextVisitDate?: string;
  }) => {
    const { data, error } = await createClient()
      .from("timeline_entries")
      .insert({
        patient_id: input.patientId,
        kind: "visit",
        entry_date: input.date,
        visit_type: input.visitType,
        notes: input.notes,
        next_visit_date: input.nextVisitDate || null,
      })
      .select("*")
      .single();
    if (error || !data) return null;
    const entry = rowToEntry(data as TimelineRow);
    setTimeline((prev) => [entry, ...prev]);
    await touchPatient(input.patientId);
    return entry;
  }, [touchPatient]);

  const addNote = useCallback(async (input: { patientId: string; date: string; notes: string }) => {
    const { data, error } = await createClient()
      .from("timeline_entries")
      .insert({
        patient_id: input.patientId,
        kind: "note",
        entry_date: input.date,
        notes: input.notes,
      })
      .select("*")
      .single();
    if (error || !data) return null;
    const entry = rowToEntry(data as TimelineRow);
    setTimeline((prev) => [entry, ...prev]);
    await touchPatient(input.patientId);
    return entry;
  }, [touchPatient]);

  const deletePatient = useCallback(async (id: string) => {
    if (!canDeleteRecords(role)) return false;
    const { data, error } = await createClient()
      .from("patients")
      .delete()
      .eq("id", id)
      .select("id");
    if (error || !data?.length) return false;
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
    setTimeline((prev) => prev.filter((entry) => entry.patientId !== id));
    return true;
  }, [role]);

  const deleteTimelineEntry = useCallback(async (id: string) => {
    if (!canDeleteRecords(role)) return false;
    const { data, error } = await createClient()
      .from("timeline_entries")
      .delete()
      .eq("id", id)
      .select("id");
    if (error || !data?.length) return false;
    setTimeline((prev) => prev.filter((entry) => entry.id !== id));
    return true;
  }, [role]);

  const value = useMemo(
    () => ({
      ready,
      loadError,
      role,
      canDelete: canDeleteRecords(role),
      patients,
      timeline,
      getPatient,
      getPatientTimeline,
      addPatient,
      updatePatient,
      addVisit,
      addNote,
      deletePatient,
      deleteTimelineEntry,
    }),
    [
      ready,
      loadError,
      role,
      patients,
      timeline,
      getPatient,
      getPatientTimeline,
      addPatient,
      updatePatient,
      addVisit,
      addNote,
      deletePatient,
      deleteTimelineEntry,
    ],
  );

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
}

export function useClinic() {
  const ctx = useContext(ClinicContext);
  if (!ctx) throw new Error("useClinic must be used within ClinicProvider");
  return ctx;
}
