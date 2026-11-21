"use client";

import Link from "next/link";
import { useEffect, useState, type ButtonHTMLAttributes, type ComponentPropsWithRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Icon } from "@/components/Icon";
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
      <Icon name="chevronBack" />
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
  const className = `clinic-chip${active ? " is-active" : ""}${tone === "default" ? "" : ` clinic-chip--${tone}`}`;
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

export function ListSkeleton() {
  return (
    <div className="skeleton-list" role="status" aria-label={ar.today.loadingTitle}>
      <div className="skeleton-row" />
      <div className="skeleton-row" />
      <div className="skeleton-row" />
    </div>
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [show]);

  if (!visible) return null;
  return (
    <div role="status" className="saved-toast">
      <div className="notice-card">{ar.common.saved}</div>
    </div>
  );
}
