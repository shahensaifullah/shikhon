"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/i18n/provider";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { messages } = useI18n();
  const links = [
    { href: "#how-it-works", label: messages.nav.how },
    { href: "#subjects", label: messages.nav.subjects },
    { href: "#progress", label: messages.nav.progress },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/60 bg-background/90 backdrop-blur-xl">
      <div className="content-shell flex h-16 items-center justify-between">
        <Brand />

        <nav className="hidden items-center gap-8 md:flex" aria-label={messages.nav.main}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSwitcher compact />
          <Link href="/login" className="btn btn-ghost min-h-10 px-4">{messages.common.login}</Link>
          <Link href="/register" className="btn btn-primary min-h-10 px-5">{messages.nav.start}</Link>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl text-on-surface md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? messages.nav.close : messages.nav.open}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-navigation" className="border-t border-outline-variant/50 bg-surface-container-lowest px-4 py-4 md:hidden" aria-label={messages.nav.mobile}>
          <div className="mx-auto flex max-w-xl flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 font-semibold text-on-surface-variant hover:bg-surface-container-low">
                {link.label}
              </Link>
            ))}
            <div className="my-2"><LanguageSwitcher /></div>
            <Link href="/register" className="btn btn-primary mt-3">{messages.nav.start}</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
