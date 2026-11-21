export type IconName =
  | "calendar"
  | "users"
  | "plus"
  | "ellipsis"
  | "userPlus"
  | "search"
  | "clipboardPlus"
  | "chevronForward"
  | "chevronBack"
  | "x"
  | "phone"
  | "smartphone"
  | "stethoscope";

export function Icon({
  name,
  className = "clinic-icon",
  weight = "regular",
}: {
  name: IconName;
  className?: string;
  weight?: "regular" | "bold";
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight === "bold" ? 2.25 : 1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <Glyph name={name} />
    </svg>
  );
}

function Glyph({ name }: { name: IconName }) {
  switch (name) {
    case "calendar":
      return (
        <>
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </>
      );
    case "users":
      return (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
      );
    case "plus":
      return (
        <>
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </>
      );
    case "ellipsis":
      return (
        <g fill="currentColor" stroke="none">
          <circle cx="5" cy="12" r="1.35" />
          <circle cx="12" cy="12" r="1.35" />
          <circle cx="19" cy="12" r="1.35" />
        </g>
      );
    case "userPlus":
      return (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M19 8v6" />
          <path d="M22 11h-6" />
        </>
      );
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      );
    case "clipboardPlus":
      return (
        <>
          <rect width="8" height="4" x="8" y="2" rx="1" />
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <path d="M9 14h6" />
          <path d="M12 11v6" />
        </>
      );
    case "chevronForward":
      return <path d="m15 18-6-6 6-6" />;
    case "chevronBack":
      return <path d="m9 18 6-6-6-6" />;
    case "x":
      return (
        <>
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </>
      );
    case "phone":
      return (
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      );
    case "smartphone":
      return (
        <>
          <rect width="14" height="20" x="5" y="2" rx="2" />
          <path d="M12 18h.01" />
        </>
      );
    case "stethoscope":
      return (
        <>
          <path d="M11 2v2" />
          <path d="M5 2v2" />
          <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
          <path d="M8 15a6 6 0 0 0 12 0v-3" />
          <circle cx="20" cy="10" r="2" />
        </>
      );
  }
}
