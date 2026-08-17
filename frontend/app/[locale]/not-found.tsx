"use client";

import { ArrowLeft, BookX } from "lucide-react";
import { Brand } from "@/components/brand";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";

export default function NotFound() {
  const { messages } = useI18n();
  const copy = messages.system;
  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <Brand />
        <span className="mx-auto mt-10 grid size-20 place-items-center rounded-2xl bg-primary-fixed text-primary"><BookX className="size-9" /></span>
        <p className="mt-8 text-sm font-bold text-primary">{copy.notFoundLabel}</p>
        <h1 className="mt-3 text-3xl font-bold leading-[1.4] text-on-surface">{copy.notFoundTitle}</h1>
        <p className="mt-4 leading-7 text-on-surface-variant">{copy.notFoundBody}</p>
        <Link href="/" className="btn btn-primary mt-8 min-h-14"><ArrowLeft className="size-5" /> {copy.backHome}</Link>
      </div>
    </main>
  );
}
