"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { localizeHref } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

type Props = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>;

export function LocalizedLink({ href, ...props }: Props) {
  const { locale } = useI18n();
  const localizedHref = typeof href === "string" ? localizeHref(locale, href) : href;
  return <Link href={localizedHref} {...props} />;
}
