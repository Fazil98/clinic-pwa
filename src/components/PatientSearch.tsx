import { useRef } from "react";
import { TextInput } from "@/components/ui";
import { ar } from "@/lib/ar";

export function PatientSearch({
  query,
  onChange,
}: {
  query: string;
  onChange: (query: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <div className="patient-search">
      <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="10.5" cy="10.5" r="6" />
        <path d="m15 15 4.5 4.5" />
      </svg>
      <TextInput
        ref={input}
        value={query}
        onChange={(event) => onChange(event.target.value)}
        placeholder={ar.patients.searchPlaceholder}
        inputMode="search"
        aria-label={ar.patients.searchPlaceholder}
        autoComplete="off"
      />
      {query && (
        <button type="button" aria-label={ar.patients.clearSearch} onClick={() => {
          onChange("");
          input.current?.focus();
        }}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </div>
  );
}
