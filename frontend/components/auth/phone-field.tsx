"use client";

import { forwardRef } from "react";
import { useI18n } from "@/i18n/provider";

type PhoneFieldProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(function PhoneField(
  { value, onChange, error, disabled, autoFocus },
  ref,
) {
  const { messages } = useI18n();
  return (
    <div>
      <label htmlFor="phone" className="mb-2 block text-sm font-bold text-on-surface">{messages.auth.phone} <span className="text-error">*</span></label>
      <div className={`flex h-14 overflow-hidden rounded-xl border bg-white transition-shadow focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${error ? "border-error" : "border-outline-variant"}`}>
        <div className="flex shrink-0 select-none items-center gap-2 border-r border-outline-variant bg-surface-container-low px-3 sm:px-4">
          <span className="text-lg" aria-hidden="true">🇧🇩</span><span className="font-semibold text-on-surface">+88</span>
        </div>
        <input
          ref={ref}
          id="phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          autoFocus={autoFocus}
          disabled={disabled}
          value={value}
          maxLength={11}
          placeholder="017XXXXXXXX"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "phone-error" : "phone-help"}
          onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 11))}
          className="min-w-0 flex-1 border-0 bg-transparent px-4 text-lg font-medium tracking-[0.04em] outline-none placeholder:text-outline-variant disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
      {error ? <p id="phone-error" className="mt-2 text-sm font-medium text-error" role="alert">{error}</p> : <p id="phone-help" className="mt-2 text-xs leading-5 text-on-surface-variant">{messages.auth.phoneHelp}</p>}
    </div>
  );
});
