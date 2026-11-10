"use client";

import { useSyncExternalStore } from "react";
import { DEMO_ANCHOR_DATE, todayISO } from "@/lib/dates";

function subscribe() {
  return () => {};
}

/** Client calendar day without breaking Next.js prerender rules. */
export function useClientToday(): string {
  return useSyncExternalStore(subscribe, todayISO, () => DEMO_ANCHOR_DATE);
}
