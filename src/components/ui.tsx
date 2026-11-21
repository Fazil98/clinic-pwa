import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentPropsWithRef, ReactNode, TextareaHTMLAttributes } from "react";
import { ar } from "@/lib/ar";

export function PageHeader({
  title,
  subtitle,
  action,
  backHref,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backHref?: string;
  children?: ReactNode;
}) {
  return (
    <header className="page-header">
      {backHref ? <AppBack href={backHref} /> : null}
      <div className="page-heading">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
        {children}
      </div>
      {action}
    </header>
  );
}

export function AppBack({ href }: { href: string }) {
  return (
    <Link href={href} className="icon-button app-back" aria-label={ar.common.back}>
      <span className="chevron" aria-hidden="true" />
    </Link>
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
    "clinic-card";
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} w-full text-start ${className}`}>
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
  const className = `inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${tones[tone]}`;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={active} className={className}>
        {children}
      </button>
    );
  }
  return <span className={className}>{children}</span>;
}

export function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  const Tag = htmlFor ? "label" : "p";
  return (
    <Tag htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[var(--ink)]">
      {children}
    </Tag>
  );
}

export function TextInput(props: ComponentPropsWithRef<"input">) {
  return (
    <input
      {...props}
      className={`clinic-control min-h-12 px-4 ${props.className || ""}`}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`clinic-control min-h-32 px-4 py-3 ${props.className || ""}`}
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
      className={`clinic-button clinic-button--primary w-full ${className}`}
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
      className={`clinic-button clinic-button--secondary w-full ${className}`}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <p className="text-lg font-bold text-[var(--ink)]">{title}</p>
      <p className="mt-2 text-base text-[var(--muted)]">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function SavedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div role="status" className="saved-toast">
      <div className="rounded-xl bg-[var(--ink)] px-4 py-2 text-sm font-bold text-white">
        {ar.common.saved}
      </div>
    </div>
  );
}
