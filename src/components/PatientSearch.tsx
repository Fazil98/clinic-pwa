import { useRef } from "react";
import { Icon } from "@/components/Icon";
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
      <Icon name="search" />
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
          <Icon name="x" />
        </button>
      )}
    </div>
  );
}
