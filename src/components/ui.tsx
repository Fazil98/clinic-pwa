import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { ar } from "@/lib/ar";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-bold text-[var(--primary)]">{ar.brand}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-base text-[var(--muted)]">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const base =
    "rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_1px_0_rgba(20,32,30,0.03)]";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} w-full text-left ${className}`}>
        {children}
      </button>
    );
  }
  return <div className={`${base} ${className}`}>{children}</div>;
}

export function Chip({
  children,
  active,
  onClick,
  tone = "default",
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: "default" | "danger" | "warn";
}) {
  const tones = {
    default: active
      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
      : "bg-[var(--surface)] text-[var(--ink)] border-[var(--line)]",
    danger: active
      ? "bg-[var(--danger)] text-white border-[var(--danger)]"
      : "bg-[var(--danger-soft)] text-[var(--danger)] border-transparent",
    warn: active
      ? "bg-[var(--warn)] text-white border-[var(--warn)]"
      : "bg-[var(--warn-soft)] text-[var(--warn-ink)] border-transparent",
  };
  const className = `inline-flex min-h-11 items-center justify-center rounded-xl border px-3.5 text-sm font-semibold transition ${tones[tone]}`;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }
  return <span className={className}>{children}</span>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`min-h-12 w-full rounded-xl border border-[var(--line)] bg-white px-4 text-base text-[var(--ink)] outline-none ring-[var(--primary)] placeholder:text-[var(--muted)] focus:ring-2 ${props.className || ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`min-h-28 w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-base text-[var(--ink)] outline-none ring-[var(--primary)] placeholder:text-[var(--muted)] focus:ring-2 ${props.className || ""}`}
    />
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-base font-bold text-white shadow-[0_10px_24px_rgba(15,118,110,0.25)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 text-base font-bold text-[var(--ink)] ${className}`}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface-soft)] px-5 py-10 text-center">
      <p className="text-lg font-bold text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-base text-[var(--muted)]">{body}</p>
    </div>
  );
}

export function SavedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="rounded-full bg-[var(--ink)] px-4 py-2 text-sm font-bold text-white shadow-lg">
        {ar.common.saved}
      </div>
    </div>
  );
}
