"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Card, FieldLabel, PrimaryButton, SecondaryButton, TextInput } from "@/components/ui";
import { useClinic } from "@/context/ClinicContext";
import { ar } from "@/lib/ar";
import { createClient } from "@/lib/supabase/client";
import { supabasePublicEnv } from "@/lib/supabase/env";

export function StaffAccount() {
  const { role } = useClinic();
  const configured = supabasePublicEnv() !== null;
  const [nextPassword, setNextPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (nextPassword.length < 8) {
      setMessage(ar.more.accountPasswordShort);
      return;
    }
    setPending(true);
    const { error } = await createClient().auth.updateUser({ password: nextPassword });
    setPending(false);
    if (error) {
      setMessage(ar.login.invalid);
      return;
    }
    setNextPassword("");
    setMessage(ar.more.accountPasswordSaved);
  }

  async function signOut() {
    setPending(true);
    await createClient().auth.signOut();
    window.location.assign("/login");
  }

  if (!configured) return null;

  return (
    <Card>
      <h2 className="text-lg font-extrabold">{ar.more.accountTitle}</h2>
      {role ? (
        <div className="mt-3 grid gap-4">
          <p className="text-sm leading-7 text-[var(--muted)]">
            {ar.more.accountSignedIn}
            {" · "}
            {role === "doctor" ? ar.more.roleDoctor : ar.more.roleSecretary}
          </p>
          <form className="grid gap-3" onSubmit={savePassword}>
            <div>
              <FieldLabel htmlFor="new-password">{ar.more.accountNewPassword}</FieldLabel>
              <TextInput
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                minLength={8}
              />
            </div>
            {message ? <p className="text-sm font-semibold text-[var(--ink-soft)]">{message}</p> : null}
            <PrimaryButton type="submit" disabled={pending || nextPassword.length < 8}>
              {ar.more.accountSavePassword}
            </PrimaryButton>
          </form>
          <SecondaryButton type="button" onClick={() => void signOut()} disabled={pending}>
            {ar.more.accountOut}
          </SecondaryButton>
        </div>
      ) : (
        <div className="mt-3">
          <Link href="/login" className="clinic-button clinic-button--primary w-full">
            {ar.more.signIn}
          </Link>
        </div>
      )}
    </Card>
  );
}
