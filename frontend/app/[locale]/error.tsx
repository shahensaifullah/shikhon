"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const { messages } = useI18n();
  const copy = messages.system;
  return (
    <main className="grid min-h-[70svh] place-items-center px-4 py-12">
      <div className="max-w-lg text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-error-container text-error"><TriangleAlert className="size-7" /></span>
        <h1 className="mt-6 text-3xl font-bold leading-[1.4]">{copy.errorTitle}</h1>
        <p className="mt-3 leading-7 text-on-surface-variant">{copy.errorBody}</p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary"><RefreshCw className="size-4" /> {copy.retry}</button>
          <Link href="/" className="btn btn-secondary">{copy.backHome}</Link>
        </div>
      </div>
    </main>
  );
}
