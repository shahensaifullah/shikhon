"use client";

import { GraduationCap } from "lucide-react";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";

export function Brand({ compact = false }: { compact?: boolean }) {
  const { messages } = useI18n();
  return (
    <Link
      href="/"
      aria-label={`${messages.common.brand} ${messages.common.home}`}
      className="inline-flex items-center gap-2 font-bold text-primary"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-white">
        <GraduationCap className="size-5" aria-hidden="true" />
      </span>
      {!compact && <span className="text-xl">{messages.common.brand}</span>}
    </Link>
  );
}
