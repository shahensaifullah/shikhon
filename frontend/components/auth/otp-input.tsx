"use client";

import { ClipboardEvent, KeyboardEvent, useRef } from "react";
import { useI18n } from "@/i18n/provider";

export function OtpInput({ value, onChange, disabled, error }: {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: string;
}) {
  const { messages } = useI18n();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  function setDigit(index: number, rawValue: string) {
    const digits = rawValue.replace(/\D/g, "");
    if (!digits) {
      const next = [...value];
      next[index] = "";
      onChange(next);
      return;
    }
    const next = [...value];
    digits.slice(0, 6 - index).split("").forEach((digit, offset) => { next[index + offset] = digit; });
    onChange(next);
    inputs.current[Math.min(index + digits.length, 5)]?.focus();
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) inputs.current[index + 1]?.focus();
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!digits) return;
    event.preventDefault();
    onChange(Array.from({ length: 6 }, (_, index) => digits[index] ?? ""));
    inputs.current[Math.min(digits.length, 5)]?.focus();
  }

  return (
    <div onPaste={handlePaste}>
      <div className="grid grid-cols-6 gap-2 sm:gap-3" role="group" aria-label={messages.auth.otpGroup}>
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(element) => { inputs.current[index] = element; }}
            value={digit}
            disabled={disabled}
            onChange={(event) => setDigit(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            autoFocus={index === 0}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`${messages.auth.digit} ${index + 1}`}
            aria-invalid={Boolean(error)}
            className={`h-14 min-w-0 rounded-xl border-2 bg-white text-center text-xl font-bold outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/15 sm:h-16 ${error ? "border-error/70" : digit ? "border-primary" : "border-otp-inactive"}`}
          />
        ))}
      </div>
      {error && <p className="mt-3 text-sm font-medium text-error" role="alert">{error}</p>}
    </div>
  );
}
