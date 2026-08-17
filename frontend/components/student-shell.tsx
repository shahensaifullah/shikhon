"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { BarChart3, BookOpen, ChevronLeft, ChevronRight, CircleHelp, LayoutDashboard, Library, LogOut, Menu, Search, Settings, X } from "lucide-react";
import { Brand } from "@/components/brand";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";
import { localizeHref } from "@/i18n/config";
import { logout } from "@/lib/auth-api";
import { restoreAuthSession } from "@/lib/api-client";
import { useAuthStore } from "@/src/stores/auth.store";

export function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, messages } = useI18n();
  const copy = messages.student;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const authStatus = useAuthStore((state) => state.status);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigation = [
    { href: "/student", label: copy.overview, icon: LayoutDashboard },
    { href: "/student/courses", label: copy.courses, icon: BookOpen },
    { href: "/student/library", label: copy.library, icon: Library },
    { href: "/student/progress", label: copy.progress, icon: BarChart3 },
  ];

  useEffect(() => { void restoreAuthSession(); }, []);

  async function handleLogout() {
    try { await logout(); } finally {
      clearSession();
      router.replace(localizeHref(locale, "/login"));
    }
  }

  function toggleSidebar() {
    setCollapsed((current) => {
      window.localStorage.setItem("shikhon-sidebar-collapsed", String(!current));
      return !current;
    });
  }

  if (authStatus !== "authenticated") {
    return <div className="grid min-h-screen place-items-center bg-background"><div className="flex items-center gap-3 font-semibold text-on-surface-variant"><span className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />{copy.restoring}</div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-outline-variant/55 bg-white/92 px-4 backdrop-blur-xl lg:px-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen(true)} className="grid size-10 place-items-center rounded-xl hover:bg-surface-container-low lg:hidden" aria-label={copy.openSidebar}><Menu className="size-5" /></button>
          <Brand />
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button type="button" className="hidden h-10 w-64 items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface px-3 text-sm text-on-surface-variant sm:flex"><Search className="size-4" /><span>{copy.search}</span><kbd className="ml-auto rounded border bg-white px-1.5 py-0.5 text-[10px]">⌘ K</kbd></button>
          <LanguageSwitcher compact />
          <button type="button" className="grid size-10 place-items-center rounded-xl text-on-surface-variant hover:bg-surface-container-low" aria-label={messages.common.help}><CircleHelp className="size-5" /></button>
          <button type="button" className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-white" aria-label={copy.openProfile}>S</button>
        </div>
      </header>

      {mobileOpen && <button className="fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-[2px] lg:hidden" onClick={() => setMobileOpen(false)} aria-label={copy.closeSidebar} />}
      <aside className={`fixed bottom-0 left-0 top-0 z-50 flex flex-col border-r border-outline-variant/55 bg-white pt-4 transition-[width,transform] duration-300 lg:z-40 lg:pt-20 ${collapsed ? "lg:w-20" : "lg:w-64"} ${mobileOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-12 items-center justify-between px-4 lg:hidden"><Brand /><button type="button" onClick={() => setMobileOpen(false)} className="grid size-10 place-items-center rounded-xl" aria-label={copy.closeSidebar}><X /></button></div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label={copy.studentNav}>
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = pathname === localizeHref(locale, href);
            return <Link key={href} href={href} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined} className={`flex h-12 items-center rounded-xl px-3 font-semibold transition-colors ${collapsed ? "lg:justify-center" : "gap-3"} ${active ? "bg-primary-fixed text-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}><Icon className="size-5 shrink-0" /><span className={collapsed ? "lg:hidden" : ""}>{label}</span></Link>;
          })}
        </nav>
        <div className="space-y-1 border-t border-outline-variant/40 p-3"><SideAction icon={<Settings />} label={copy.settings} collapsed={collapsed} /><SideAction icon={<LogOut />} label={messages.common.logout} collapsed={collapsed} onClick={handleLogout} /></div>
        <button type="button" onClick={toggleSidebar} className="absolute -right-3 top-24 hidden size-7 place-items-center rounded-full border border-outline-variant bg-white shadow-sm lg:grid" aria-label={collapsed ? copy.expandSidebar : copy.collapseSidebar}>{collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}</button>
      </aside>

      <div className={`flex min-h-screen flex-col pt-16 transition-[padding] duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <main className="flex-1 px-4 py-7 sm:px-6 lg:px-10 lg:py-9"><div className="mx-auto w-full max-w-6xl">{children}</div></main>
        <footer className="border-t border-outline-variant/45 bg-white px-6 py-5 text-sm text-on-surface-variant"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 sm:flex-row"><p>{messages.common.copyright}</p><div className="flex gap-5"><Link href="#">{copy.helpCenter}</Link><Link href="#">{messages.common.privacy}</Link></div></div></footer>
      </div>
    </div>
  );
}

function SideAction({ icon, label, collapsed, onClick }: { icon: ReactNode; label: string; collapsed: boolean; onClick?: () => void }) {
  return <button type="button" onClick={onClick} title={collapsed ? label : undefined} className={`flex h-11 w-full items-center rounded-xl px-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low ${collapsed ? "lg:justify-center" : "gap-3"}`}><span className="[&>svg]:size-5">{icon}</span><span className={collapsed ? "lg:hidden" : ""}>{label}</span></button>;
}
