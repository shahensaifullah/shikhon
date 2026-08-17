"use client";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, messages } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const query = typeof window === "undefined" ? "" : window.location.search;
    router.replace(`${segments.join("/")}${query}`);
  }

  return (
    <div className="inline-flex items-center rounded-xl border border-outline-variant/60 bg-white p-1" aria-label={locale === "bn" ? "ভাষা পরিবর্তন" : "Change language"}>
      {!compact && <Languages className="mx-2 size-4 text-outline" aria-hidden="true" />}
      <button type="button" onClick={() => changeLocale("bn")} className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${locale === "bn" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface"}`}>{messages.common.bangla}</button>
      <button type="button" onClick={() => changeLocale("en")} className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${locale === "en" ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface"}`}>{messages.common.english}</button>
    </div>
  );
}
