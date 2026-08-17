"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle, LockKeyhole, ShieldCheck } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OtpInput } from "@/components/auth/otp-input";
import { getAuthApiError, verifyOtp, type OtpPurpose } from "@/lib/auth-api";
import { createOtpSchema, toBangladeshE164, type OtpFormValues } from "@/lib/auth-schemas";
import { useAuthStore } from "@/src/stores/auth.store";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";
import { localizeHref } from "@/i18n/config";

type OtpDialogProps = {
  open: boolean;
  phone: string;
  purpose: OtpPurpose;
  expiresIn: number;
  developmentMode?: boolean;
  nextPath?: string;
  onResend: () => Promise<{ expires_in: number }>;
  onCancel: () => void;
};

export function OtpDialog({ open, phone, purpose, expiresIn, developmentMode = false, nextPath = "/student", onResend, onCancel }: OtpDialogProps) {
  const router = useRouter();
  const { locale, messages } = useI18n();
  const copy = messages.auth;
  const schema = useMemo(() => createOtpSchema(messages.validation), [messages]);
  const setSession = useAuthStore((state) => state.setSession);
  const [seconds, setSeconds] = useState(Math.min(expiresIn, 30));
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
    mode: "onSubmit",
  });
  const code = useWatch({ control: form.control, name: "code" });

  useEffect(() => {
    if (!open || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [open, seconds]);

  const submitOtp = form.handleSubmit(async ({ code: submittedCode }) => {
    try {
      const session = await verifyOtp({ phone: toBangladeshE164(phone), code: submittedCode, purpose });
      setSession(session);
      router.replace(localizeHref(locale, safeNextPath(nextPath)));
    } catch (verifyError) {
      const apiError = getAuthApiError(verifyError);
      if (apiError.fields.code) form.setError("code", { message: apiError.fields.code });
      if (apiError.message) form.setError("root.server", { message: apiError.message });
    }
  });

  async function resendCode() {
    form.clearErrors();
    try {
      const response = await onResend();
      form.reset({ code: "" });
      setSeconds(Math.min(response.expires_in, 30));
    } catch (requestError) {
      const apiError = getAuthApiError(requestError);
      form.setError("root.server", { message: apiError.message || messages.validation.resend });
    }
  }

  const isRegistration = purpose === "register";

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!nextOpen && !form.formState.isSubmitting) onCancel(); }}>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl border border-outline-variant/50 p-0 shadow-ambient sm:max-w-[31rem]" showCloseButton={!form.formState.isSubmitting}>
        <div className="p-5 sm:p-8">
          <DialogHeader className="text-left">
            <span className="icon-tile mb-3 bg-primary-fixed text-primary"><ShieldCheck className="size-6" /></span>
            <DialogTitle className="text-2xl font-bold leading-9 text-on-surface sm:text-3xl sm:leading-[1.4]">
              {isRegistration ? copy.otpRegisterTitle : copy.otpLoginTitle}
            </DialogTitle>
            <DialogDescription className="pt-1 text-base leading-7 text-on-surface-variant">
              <strong className="whitespace-nowrap text-on-surface">+88 {phone}</strong> {copy.otpInstructionSuffix}
            </DialogDescription>
          </DialogHeader>

          {isRegistration && <div className="mt-5 rounded-xl border border-tertiary/15 bg-chemistry-bg px-4 py-3 text-sm font-medium leading-6 text-tertiary">{copy.registrationReady}</div>}
          {developmentMode && <div className="mt-5 rounded-xl bg-secondary-fixed/70 px-4 py-3 text-sm font-semibold text-secondary">{copy.development}</div>}

          <form onSubmit={submitOtp} className="mt-6" noValidate>
            {form.formState.errors.root?.server?.message && <div className="mb-5 rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm font-medium text-error" role="alert">{form.formState.errors.root.server.message}</div>}
            <Controller
              name="code"
              control={form.control}
              render={({ field }) => (
                <OtpInput
                  value={Array.from({ length: 6 }, (_, index) => field.value[index] ?? "")}
                  onChange={(digits) => { field.onChange(digits.join("")); form.clearErrors(); }}
                  error={form.formState.errors.code?.message}
                  disabled={form.formState.isSubmitting}
                />
              )}
            />
            <button type="submit" disabled={form.formState.isSubmitting || code.length !== 6} className="btn btn-primary mt-7 min-h-14 w-full text-base disabled:cursor-not-allowed disabled:opacity-50">
              {form.formState.isSubmitting ? <><LoaderCircle className="size-5 animate-spin" /> {copy.verifying}</> : <>{isRegistration ? copy.createAndLogin : messages.common.login} <ArrowRight className="size-5" /></>}
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-on-surface-variant" aria-live="polite">
            {seconds > 0 ? <><strong className="text-on-surface">0:{String(seconds).padStart(2, "0")}</strong> {copy.resendWait}</> : <button type="button" disabled={form.formState.isSubmitting} onClick={resendCode} className="font-bold text-primary hover:underline">{copy.resend}</button>}
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-outline"><LockKeyhole className="size-3.5" /> {copy.otpExpiry}</p>
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-3 border-t border-outline-variant/40 bg-surface px-5 py-4 sm:flex-row sm:px-8">
          <button type="button" disabled={form.formState.isSubmitting} onClick={onCancel} className="text-sm font-bold text-on-surface-variant hover:text-primary">{copy.cancelEdit}</button>
          <p className="text-sm text-on-surface-variant">{isRegistration ? <>{copy.alreadyLearner} <Link href="/login" className="font-bold text-primary hover:underline">{messages.common.login}</Link></> : <>{copy.newHere} <Link href="/register" className="font-bold text-primary hover:underline">{messages.common.register}</Link></>}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function safeNextPath(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/student";
}
