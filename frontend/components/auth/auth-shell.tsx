"use client";

import { BookOpenCheck, CircleHelp, Sparkles } from "lucide-react";
import { Brand } from "@/components/brand";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/i18n/provider";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { messages } = useI18n();
  const copy = messages.auth;
  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-[minmax(22rem,0.8fr)_minmax(34rem,1.2fr)]">
      <aside className="relative hidden min-h-screen overflow-hidden border-r border-outline-variant/45 bg-surface-container-low p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="absolute -left-32 -top-32 size-96 rounded-full bg-primary-fixed/75 blur-3xl" />
        <div className="absolute -bottom-36 -right-32 size-[28rem] rounded-full bg-secondary-fixed/70 blur-3xl" />
        <div className="relative z-10">
          <Brand />
          <div className="mt-20 max-w-md">
            <span className="eyebrow mb-6"><Sparkles className="size-4" /> {copy.slogan}</span>
            <h1 className="text-balance text-5xl font-bold leading-[1.22] text-on-surface">{copy.shellTitle}</h1>
            <p className="mt-6 text-lg leading-8 text-on-surface-variant">{copy.shellBody}</p>
          </div>
        </div>

        <div className="card relative z-10 overflow-hidden p-7">
          <div className="absolute -right-14 -top-14 size-40 rounded-full bg-primary-fixed" />
          <div className="relative">
            <span className="icon-tile bg-primary text-white"><BookOpenCheck className="size-5" /></span>
            <p className="mt-6 font-serif text-2xl leading-10 text-on-surface">{copy.shellQuote}</p>
            <p className="mt-5 text-sm font-semibold text-on-surface-variant">{copy.shellNote}</p>
          </div>
        </div>
      </aside>

      <div className="relative flex min-h-screen flex-col">
        <header className="flex h-16 items-center justify-between border-b border-outline-variant/45 bg-surface/90 px-4 backdrop-blur-xl sm:px-8 lg:justify-end lg:border-0">
          <div className="lg:hidden"><Brand /></div>
          <div className="flex items-center gap-3"><LanguageSwitcher compact /><Link href="#" className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary"><CircleHelp className="size-4" /> {messages.common.help}</Link></div>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:py-14">
          <div className="w-full max-w-[30rem]">{children}</div>
        </main>
        <footer className="px-6 py-5 text-center text-xs text-on-surface-variant">{messages.common.copyright} · <Link href="#" className="hover:text-primary">{messages.common.privacy}</Link> · <Link href="#" className="hover:text-primary">{messages.common.terms}</Link></footer>
      </div>
    </div>
  );
}
