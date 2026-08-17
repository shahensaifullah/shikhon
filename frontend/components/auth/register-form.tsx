"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Brain, Eye, LoaderCircle, MapPin, UserRound } from "lucide-react";
import { Controller, useForm, type UseFormRegisterReturn } from "react-hook-form";
import { useMemo, useState } from "react";
import { getAuthApiError, registerAndSendOtp } from "@/lib/auth-api";
import { createRegisterSchema, toBangladeshE164, type RegisterFormValues } from "@/lib/auth-schemas";
import { PhoneField } from "@/components/auth/phone-field";
import { OtpDialog } from "@/components/auth/otp-dialog";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";

export function RegisterForm() {
  const { messages } = useI18n();
  const copy = messages.auth;
  const schema = useMemo(() => createRegisterSchema(messages.validation), [messages]);
  const [otpRequest, setOtpRequest] = useState<{ phone: string; fullName: string; address: string; expiresIn: number; developmentMode: boolean } | null>(null);
  const { register, control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", phone: "", address: "", terms: false },
    mode: "onTouched",
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await registerAndSendOtp({
        phone: toBangladeshE164(values.phone),
        fullName: values.fullName,
        address: values.address || undefined,
      });
      setOtpRequest({
        phone: values.phone,
        fullName: values.fullName,
        address: values.address,
        expiresIn: response.expires_in,
        developmentMode: Boolean(response.development_code),
      });
    } catch (requestError) {
      const apiError = getAuthApiError(requestError);
      if (apiError.fields.full_name) setError("fullName", { message: apiError.fields.full_name });
      if (apiError.fields.phone_number) setError("phone", { message: apiError.fields.phone_number });
      if (apiError.fields.address) setError("address", { message: apiError.fields.address });
      if (apiError.message) setError("root.server", { message: apiError.message });
    }
  });

  return (
    <div className="card p-5 shadow-ambient sm:p-8">
      <div className="mb-8">
        <p className="text-sm font-bold text-primary">{copy.slogan}</p>
        <h1 className="mt-2 text-3xl font-bold leading-[1.35] text-on-surface">{copy.registerTitle}</h1>
        <p className="mt-3 leading-7 text-on-surface-variant">{copy.registerBody}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-semibold text-on-surface-variant">
          <span className="flex items-center gap-2 rounded-xl bg-math-bg px-3 py-2.5"><Eye className="size-4 text-primary" /> {copy.see}</span>
          <span className="flex items-center gap-2 rounded-xl bg-chemistry-bg px-3 py-2.5"><Brain className="size-4 text-tertiary" /> {copy.mastery}</span>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        {errors.root?.server?.message && <FormAlert message={errors.root.server.message} />}
        <TextField label={copy.fullName} name="fullName" placeholder={copy.namePlaceholder} icon={<UserRound />} error={errors.fullName?.message} required disabled={isSubmitting} autoComplete="name" registration={register("fullName")} />
        <Controller name="phone" control={control} render={({ field }) => <PhoneField value={field.value} onChange={field.onChange} error={errors.phone?.message} disabled={isSubmitting} />} />
        <TextField label={copy.address} name="address" placeholder={copy.addressPlaceholder} icon={<MapPin />} error={errors.address?.message} disabled={isSubmitting} optional autoComplete="street-address" registration={register("address")} />

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-on-surface-variant">
            <input type="checkbox" disabled={isSubmitting} className="mt-1 size-4 rounded border-outline-variant accent-primary" {...register("terms")} />
            <span>{copy.consentBefore} <Link href="#" className="font-semibold text-primary hover:underline">{copy.serviceTerms}</Link> {copy.consentAnd} <Link href="#" className="font-semibold text-primary hover:underline">{copy.privacyPolicy}</Link>{copy.consentAfter}</span>
          </label>
          {errors.terms?.message && <FieldError message={errors.terms.message} />}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary min-h-14 w-full text-base disabled:cursor-not-allowed disabled:opacity-60">
          {isSubmitting ? <><LoaderCircle className="size-5 animate-spin" /> {copy.preparing}</> : <>{copy.continueVerify} <ArrowRight className="size-5" /></>}
        </button>
      </form>
      <p className="mt-7 border-t border-outline-variant/40 pt-6 text-center text-sm text-on-surface-variant">{copy.haveAccount} <Link href="/login" className="font-bold text-primary hover:underline">{copy.loginAction}</Link></p>
      {otpRequest && (
        <OtpDialog
          open
          phone={otpRequest.phone}
          purpose="register"
          expiresIn={otpRequest.expiresIn}
          developmentMode={otpRequest.developmentMode}
          onResend={() => registerAndSendOtp({
            phone: toBangladeshE164(otpRequest.phone),
            fullName: otpRequest.fullName,
            address: otpRequest.address || undefined,
          })}
          onCancel={() => setOtpRequest(null)}
        />
      )}
    </div>
  );
}

type TextFieldProps = {
  label: string; name: string; placeholder: string; icon: React.ReactNode; error?: string;
  required?: boolean; optional?: boolean; disabled?: boolean; autoComplete?: string;
  registration: UseFormRegisterReturn;
};

function TextField({ label, name, placeholder, icon, error, required, optional, disabled, autoComplete, registration }: TextFieldProps) {
  const { messages } = useI18n();
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-bold text-on-surface">{label} {required && <span className="text-error">*</span>}{optional && <span className="ml-1 text-xs font-normal text-outline">({messages.auth.optional})</span>}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 grid w-12 place-items-center text-outline [&>svg]:size-5">{icon}</span>
        <input id={name} disabled={disabled} autoComplete={autoComplete} placeholder={placeholder} aria-invalid={Boolean(error)} className={`h-14 w-full rounded-xl border bg-white pl-12 pr-4 outline-none transition-shadow placeholder:text-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:opacity-60 ${error ? "border-error" : "border-outline-variant"}`} {...registration} />
      </div>
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-2 text-sm font-medium text-error" role="alert">{message}</p>;
}

function FormAlert({ message }: { message: string }) {
  return <div className="rounded-xl border border-error/20 bg-error-container/50 px-4 py-3 text-sm font-medium text-error" role="alert">{message}</div>;
}
