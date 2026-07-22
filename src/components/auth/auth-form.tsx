"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  type?: string;
  placeholder: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
};

export function Field({ label, type = "text", placeholder, value, onChange, required }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-banking-text">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="h-12 w-full rounded-md border border-banking-border bg-white px-4 text-sm text-banking-text outline-none transition placeholder:text-slate-400 focus:border-banking-blue focus:ring-4 focus:ring-banking-blue/12"
      />
    </label>
  );
}

type PrimaryButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function PrimaryButton({ children, className, type = "button", disabled }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-banking-blue px-4 text-sm font-semibold text-white shadow-glow transition hover:bg-banking-navy focus:outline-none focus:ring-4 focus:ring-banking-blue/20 disabled:opacity-60",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

export function FinePrint({
  href,
  link,
  text,
}: {
  href: string;
  link: string;
  text: string;
}) {
  return (
    <p className="text-center text-sm text-banking-muted">
      {text}{" "}
      <Link href={href} className="font-semibold text-banking-blue">
        {link}
      </Link>
    </p>
  );
}

export function OtpInput() {
  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  function updateDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...values];
    next[index] = digit;
    setValues(next);
    if (digit && index < refs.current.length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  return (
    <div className="grid grid-cols-6 gap-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={values[index]}
          onChange={(event) => updateDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !values[index] && index > 0) {
              refs.current[index - 1]?.focus();
            }
          }}
          inputMode="numeric"
          maxLength={1}
          aria-label={`OTP digit ${index + 1}`}
          className="h-12 rounded-md border border-banking-border bg-white text-center text-lg font-semibold text-banking-text outline-none transition focus:border-banking-blue focus:ring-4 focus:ring-banking-blue/12"
        />
      ))}
    </div>
  );
}
