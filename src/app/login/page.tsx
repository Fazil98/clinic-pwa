"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Card, FieldLabel, PageHeader, PrimaryButton, TextInput } from "@/components/ui";
import { ar } from "@/lib/ar";
import { staffEmail } from "@/lib/staff";
import { createClient } from "@/lib/supabase/client";
import { supabasePublicEnv } from "@/lib/supabase/env";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const configured = supabasePublicEnv() !== null;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "");
    const password = String(data.get("password") ?? "");
    const email = staffEmail(name) ?? "unknown@obgyn.clinic";
    setPending(true);
    const { error: signInError } = await createClient().auth.signInWithPassword({
      email,
      password,
    });
    setPending(false);
    if (signInError) {
      setError(ar.login.invalid);
      return;
    }
    router.replace("/today");
    router.refresh();
  }

  return (
    <div className="login-screen">
      <PageHeader title={ar.login.title} subtitle={ar.login.subtitle} />
      <Card>
        {configured ? (
          <form className="grid gap-4" method="post" onSubmit={onSubmit}>
            <div>
              <FieldLabel htmlFor="staff-name">{ar.login.name}</FieldLabel>
              <TextInput
                id="staff-name"
                name="name"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="staff-password">{ar.login.password}</FieldLabel>
              <TextInput
                id="staff-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {error ? (
              <p className="text-sm font-semibold text-[var(--danger)]" role="alert">
                {error}
              </p>
            ) : null}
            <PrimaryButton type="submit" disabled={pending}>
              {pending ? ar.login.pending : ar.login.submit}
            </PrimaryButton>
          </form>
        ) : (
          <p className="text-sm leading-7 text-[var(--muted)]">{ar.login.missing}</p>
        )}
      </Card>
    </div>
  );
}
