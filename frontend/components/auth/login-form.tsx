"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BookOpenCheck, Lightbulb, LoaderCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { getAuthApiError, requestLoginOtp } from "@/lib/auth-api";
import { createLoginPhoneSchema, toBangladeshE164, type LoginPhoneFormValues } from "@/lib/auth-schemas";
import { PhoneField } from "@/components/auth/phone-field";
import { OtpDialog } from "@/components/auth/otp-dialog";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";

type LoginFormProps = {
  initialPhone?: string;
  sessionExpired?: boolean;
  nextPath?: string;
};

export function LoginForm({ initialPhone = "", sessionExpired = false, nextPath = "/student" }: LoginFormProps) {
  const { messages } = useI18n();
  const copy = messages.auth;
  const schema = useMemo(() => createLoginPhoneSchema(messages.validation), [messages]);
  const [otpRequest, setOtpRequest] = useState<{ phone: string; expiresIn: number; developmentMode: boolean } | null>(null);
  const form = useForm<LoginPhoneFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: initialPhone.replace(/\D/g, "").slice(-11) },
    mode: "onTouched",
  });

  const requestCode = form.handleSubmit(async ({ phone }) => {
    try {
      const response = await requestLoginOtp(toBangladeshE164(phone));
      setOtpRequest({ phone, expiresIn: response.expires_in, developmentMode: Boolean(response.development_code) });
    } catch (requestError) {
      const apiError = getAuthApiError(requestError);
      if (apiError.fields.phone_number) form.setError("phone", { message: apiError.fields.phone_number });
      if (apiError.message) form.setError("root.server", { message: apiError.message });
    }
  });

  return (
    <div className="card p-5 shadow-ambient sm:p-8">
      {sessionExpired && <div className="mb-6 rounded-xl border border-primary/15 bg-primary-fixed/50 px-4 py-3 text-sm font-medium text-primary">{copy.sessionExpired}</div>}
      <div className="mb-8">
        <p className="text-sm font-bold text-primary">{copy.welcome}</p>
        <h1 className="mt-2 text-3xl font-bold leading-[1.35] text-on-surface">{copy.loginTitle}</h1>
        <p className="mt-3 leading-7 text-on-surface-variant">{copy.loginBody}</p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-on-surface-variant">
          <span className="flex items-center gap-1.5 rounded-full bg-math-bg px-3 py-2"><Lightbulb className="size-3.5 text-primary" /> {copy.understandWhy}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-chemistry-bg px-3 py-2"><BookOpenCheck className="size-3.5 text-tertiary" /> {copy.practice}</span>
        </div>
      </div>
      <form onSubmit={requestCode} className="space-y-5" noValidate>
        {form.formState.errors.root?.server?.message && <div className="rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm font-medium text-error" role="alert">{form.formState.errors.root.server.message}</div>}
        <Controller name="phone" control={form.control} render={({ field }) => <PhoneField value={field.value} onChange={(value) => { field.onChange(value); form.clearErrors(); }} error={form.formState.errors.phone?.message} disabled={form.formState.isSubmitting} autoFocus />} />
        <button type="submit" disabled={form.formState.isSubmitting} className="btn btn-primary min-h-14 w-full text-base disabled:cursor-not-allowed disabled:opacity-60">
          {form.formState.isSubmitting ? <><LoaderCircle className="size-5 animate-spin" /> {copy.sending}</> : <>{copy.continuePhone} <ArrowRight className="size-5" /></>}
        </button>
      </form>
      <p className="mt-7 border-t border-outline-variant/40 pt-6 text-center text-sm text-on-surface-variant">{copy.newLearner} <Link href="/register" className="font-bold text-primary hover:underline">{copy.freeAccount}</Link></p>
      {otpRequest && (
        <OtpDialog
          open
          phone={otpRequest.phone}
          purpose="login"
          expiresIn={otpRequest.expiresIn}
          developmentMode={otpRequest.developmentMode}
          nextPath={nextPath}
          onResend={() => requestLoginOtp(toBangladeshE164(otpRequest.phone))}
          onCancel={() => setOtpRequest(null)}
        />
      )}
    </div>
  );
}
