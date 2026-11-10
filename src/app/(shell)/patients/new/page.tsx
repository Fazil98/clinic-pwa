"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Chip,
  FieldLabel,
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  TextArea,
  TextInput,
} from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar, gynReasonsAr } from "@/lib/ar";
import { estimateGestationalWeek } from "@/lib/dates";
import { healthFlagLabel, patientTypeLabel } from "@/lib/labels";
import type { HealthFlag, PatientType } from "@/lib/types";
import { useClientToday } from "@/lib/use-client-today";

const types: PatientType[] = [
  "pregnant",
  "postpartum",
  "gynecology",
  "other",
];

const flags = Object.keys(healthFlagLabel) as HealthFlag[];

export default function NewPatientPage() {
  const today = useClientToday();
  const router = useRouter();
  const { addPatient } = useClinic();
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [area, setArea] = useState("");
  const [patientType, setPatientType] = useState<PatientType>("pregnant");
  const [dueDate, setDueDate] = useState("");
  const [lmpDate, setLmpDate] = useState("");
  const [previousPregnancies, setPreviousPregnancies] = useState(0);
  const [previousCSection, setPreviousCSection] = useState<boolean | undefined>();
  const [deliveryDate, setDeliveryDate] = useState("");
  const [birthType, setBirthType] = useState<"normal" | "csection" | undefined>();
  const [babyNotes, setBabyNotes] = useState("");
  const [mainReason, setMainReason] = useState("");
  const [healthFlags, setHealthFlags] = useState<HealthFlag[]>([]);
  const [allergyNote, setAllergyNote] = useState("");
  const [medicines, setMedicines] = useState("");
  const [historyNotes, setHistoryNotes] = useState("");
  const [highRisk, setHighRisk] = useState(false);

  const week = useMemo(
    () =>
      estimateGestationalWeek({
        dueDate: dueDate || undefined,
        lmpDate: lmpDate || undefined,
        onDate: today,
      }),
    [dueDate, lmpDate, today],
  );

  const canStep1 = fullName.trim().length > 1 && phone.trim().length > 5;

  function toggleFlag(flag: HealthFlag) {
    setHealthFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
  }

  function save(andOpen: boolean) {
    const patient = addPatient({
      fullName: fullName.trim(),
      phone: phone.trim(),
      age: age ? Number(age) : undefined,
      area: area.trim() || undefined,
      patientType,
      dueDate: dueDate || undefined,
      lmpDate: lmpDate || undefined,
      previousPregnancies:
        patientType === "pregnant" ? previousPregnancies : undefined,
      previousCSection:
        patientType === "pregnant" ? previousCSection : undefined,
      deliveryDate: deliveryDate || undefined,
      birthType,
      babyNotes: babyNotes.trim() || undefined,
      mainReason: mainReason.trim() || undefined,
      healthFlags,
      allergyNote: allergyNote.trim() || undefined,
      medicines: medicines.trim() || undefined,
      historyNotes: historyNotes.trim() || undefined,
      highRisk,
      bloodType: "unknown",
    });
    if (andOpen) router.push(`/patients/${patient.id}`);
    else router.push("/patients");
  }

  return (
    <div>
      <PageHeader
        title={ar.newPatient.title}
        subtitle={ar.newPatient.stepOf(step)}
      />

      <div className="mb-5 flex gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-2 flex-1 rounded-full ${
              n <= step ? "bg-[var(--primary)]" : "bg-[var(--line)]"
            }`}
          />
        ))}
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <FieldLabel>{ar.newPatient.fullName}</FieldLabel>
            <TextInput
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={ar.newPatient.fullNamePh}
              autoFocus
            />
          </div>
          <div>
            <FieldLabel>{ar.newPatient.phone}</FieldLabel>
            <TextInput
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={ar.newPatient.phonePh}
              inputMode="tel"
              dir="ltr"
            />
          </div>
          <div>
            <FieldLabel>{ar.newPatient.age}</FieldLabel>
            <TextInput
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/\D/g, ""))}
              placeholder={ar.newPatient.agePh}
              inputMode="numeric"
            />
          </div>
          <div>
            <FieldLabel>{ar.newPatient.area}</FieldLabel>
            <TextInput
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={ar.newPatient.areaPh}
            />
          </div>
          <PrimaryButton
            type="button"
            disabled={!canStep1}
            onClick={() => setStep(2)}
          >
            {ar.newPatient.saveContinue}
          </PrimaryButton>
          <SecondaryButton
            type="button"
            disabled={!canStep1}
            onClick={() => save(true)}
          >
            {ar.newPatient.saveLater}
          </SecondaryButton>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div>
            <FieldLabel>{ar.newPatient.whyHere}</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {types.map((t) => (
                <Chip
                  key={t}
                  active={patientType === t}
                  onClick={() => setPatientType(t)}
                >
                  {patientTypeLabel[t]}
                </Chip>
              ))}
            </div>
          </div>

          {patientType === "pregnant" ? (
            <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div>
                <FieldLabel>{ar.newPatient.dueDate}</FieldLabel>
                <TextInput
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>{ar.newPatient.lmp}</FieldLabel>
                <TextInput
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                />
              </div>
              {week !== undefined ? (
                <p className="text-2xl font-extrabold text-[var(--primary)]">
                  {ar.newPatient.week(week)}
                </p>
              ) : null}
              <div>
                <FieldLabel>{ar.newPatient.previousPregnancies}</FieldLabel>
                <div className="flex items-center gap-3">
                  <SecondaryButton
                    type="button"
                    className="!w-14"
                    onClick={() =>
                      setPreviousPregnancies((n) => Math.max(0, n - 1))
                    }
                  >
                    −
                  </SecondaryButton>
                  <span className="min-w-8 text-center text-2xl font-bold">
                    {previousPregnancies}
                  </span>
                  <SecondaryButton
                    type="button"
                    className="!w-14"
                    onClick={() => setPreviousPregnancies((n) => n + 1)}
                  >
                    +
                  </SecondaryButton>
                </div>
              </div>
              <div>
                <FieldLabel>{ar.newPatient.previousCSection}</FieldLabel>
                <div className="flex gap-2">
                  <Chip
                    active={previousCSection === true}
                    onClick={() => setPreviousCSection(true)}
                  >
                    {ar.patient.yes}
                  </Chip>
                  <Chip
                    active={previousCSection === false}
                    onClick={() => setPreviousCSection(false)}
                  >
                    {ar.patient.no}
                  </Chip>
                </div>
              </div>
            </div>
          ) : null}

          {patientType === "postpartum" ? (
            <div className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <div>
                <FieldLabel>{ar.newPatient.deliveryDate}</FieldLabel>
                <TextInput
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>{ar.newPatient.birthType}</FieldLabel>
                <div className="flex gap-2">
                  <Chip
                    active={birthType === "normal"}
                    onClick={() => setBirthType("normal")}
                  >
                    {ar.patient.normalBirth}
                  </Chip>
                  <Chip
                    active={birthType === "csection"}
                    onClick={() => setBirthType("csection")}
                  >
                    {ar.patient.csection}
                  </Chip>
                </div>
              </div>
              <div>
                <FieldLabel>{ar.newPatient.babyNotes}</FieldLabel>
                <TextArea
                  value={babyNotes}
                  onChange={(e) => setBabyNotes(e.target.value)}
                  placeholder={ar.newPatient.optional}
                />
              </div>
            </div>
          ) : null}

          {patientType === "gynecology" || patientType === "other" ? (
            <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <FieldLabel>{ar.newPatient.mainReason}</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {gynReasonsAr.map((reason) => (
                  <Chip
                    key={reason}
                    active={mainReason === reason}
                    onClick={() => setMainReason(reason)}
                  >
                    {reason}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}

          <PrimaryButton type="button" onClick={() => setStep(3)}>
            {ar.newPatient.continue}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => setStep(1)}>
            {ar.newPatient.back}
          </SecondaryButton>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div>
            <FieldLabel>{ar.newPatient.healthFlags}</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {flags.map((flag) => (
                <Chip
                  key={flag}
                  active={healthFlags.includes(flag)}
                  onClick={() => toggleFlag(flag)}
                >
                  {healthFlagLabel[flag]}
                </Chip>
              ))}
            </div>
          </div>

          {healthFlags.includes("allergy") ? (
            <div>
              <FieldLabel>{ar.newPatient.allergyWhat}</FieldLabel>
              <TextInput
                value={allergyNote}
                onChange={(e) => setAllergyNote(e.target.value)}
                placeholder={ar.newPatient.allergyPh}
              />
            </div>
          ) : null}

          <div>
            <FieldLabel>{ar.newPatient.medicines}</FieldLabel>
            <TextArea
              value={medicines}
              onChange={(e) => setMedicines(e.target.value)}
              placeholder={ar.newPatient.medicinesPh}
            />
          </div>

          <div>
            <FieldLabel>{ar.newPatient.anythingElse}</FieldLabel>
            <TextArea
              value={historyNotes}
              onChange={(e) => setHistoryNotes(e.target.value)}
              placeholder={ar.newPatient.anythingElsePh}
            />
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-bold">{ar.newPatient.highRiskTitle}</p>
                <p className="text-sm text-[var(--muted)]">
                  {ar.newPatient.highRiskBody}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHighRisk((v) => !v)}
                className={`relative h-8 w-14 rounded-full transition ${
                  highRisk ? "bg-[var(--danger)]" : "bg-[var(--line)]"
                }`}
                aria-pressed={highRisk}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                    highRisk ? "start-7" : "start-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <PrimaryButton type="button" onClick={() => save(true)}>
            {ar.newPatient.done}
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => setStep(2)}>
            {ar.newPatient.back}
          </SecondaryButton>
        </div>
      ) : null}
    </div>
  );
}
