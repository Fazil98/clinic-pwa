"use client";

import { useSyncExternalStore } from "react";
import { todayISO } from "@/lib/dates";

function subscribe() {
  return () => {};
}

/** Client calendar day without breaking Next.js prerender rules. */
export function useClientToday(): string {
  return useSyncExternalStore(subscribe, todayISO, todayISO);
}
