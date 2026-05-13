/**
 * Componentes UI reutilizables para formularios del admin.
 */

import type { TextareaHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function Label({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-sans text-sm font-medium text-clementina-900 mb-2"
    >
      {children}
      {required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600 disabled:opacity-60 ${props.className ?? ""}`}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600 resize-y min-h-[120px] disabled:opacity-60 ${props.className ?? ""}`}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full px-4 py-2.5 rounded-lg border border-clementina-200 bg-white font-sans text-base focus:outline-none focus:border-clementina-600 ${props.className ?? ""}`}
    />
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-clementina-800 text-cream-50 hover:bg-clementina-700 disabled:bg-clementina-300",
    secondary:
      "bg-cream-100 text-clementina-800 hover:bg-cream-200 border border-clementina-200",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost: "text-clementina-700 hover:bg-clementina-50",
  } as const;

  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-5">{children}</div>;
}

export function Field({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
