"use client";

import {
  ArrowRight, BarChart3, BookOpenCheck, CheckCircle2, Clock3, Eye,
  GraduationCap, HandHelping, Lightbulb, Lock, PenTool, Sparkles, Target,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { LearningPreview } from "@/components/learning-preview";
import { PhysicsDemo } from "@/components/physics-demo";
import { SiteHeader } from "@/components/site-header";
import { LocalizedLink as Link } from "@/components/i18n/localized-link";
import { useI18n } from "@/i18n/provider";

export default function Home() {
  const { messages } = useI18n();
  const copy = messages.home;
  const featureDecorations = [
    { icon: Lightbulb, style: "bg-primary-fixed text-primary" }, { icon: Eye, style: "bg-math-bg text-secondary" },
    { icon: PenTool, style: "bg-chemistry-bg text-tertiary" }, { icon: HandHelping, style: "bg-surface-container text-primary" },
    { icon: Target, style: "bg-error-container/60 text-error" }, { icon: BarChart3, style: "bg-secondary-fixed text-secondary" },
  ];
  const features = copy.features.map((feature, index) => ({ ...feature, ...featureDecorations[index] }));
  return (
    <div className="min-h-screen overflow-hidden">
      <SiteHeader />
      <main>
        <section className="content-shell grid min-h-[min(900px,100svh)] items-center gap-16 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:pt-28">
          <div className="relative z-10 max-w-2xl">
            <span className="eyebrow mb-7"><Sparkles className="size-4" /> {copy.eyebrow}</span>
            <h1 className="display-title text-balance text-on-background">
              {copy.title} <span className="text-primary">{copy.titleAccent}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-on-surface-variant md:text-xl md:leading-9">
              {copy.intro}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn btn-primary min-h-14 px-7 text-base">{copy.startFree} <ArrowRight className="size-5" /></Link>
              <Link href="#how-it-works" className="btn btn-secondary min-h-14 px-7 text-base">{copy.seeHow}</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-on-surface-variant">
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-tertiary" /> {copy.noCard}</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="size-4 text-tertiary" /> {copy.ownPace}</span>
            </div>
          </div>
          <LearningPreview />
        </section>

        <section id="how-it-works" className="section-space border-y border-outline-variant/35 bg-white/60">
          <div className="content-shell">
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow mb-5">{copy.built}</span>
              <h2 className="section-title text-balance">{copy.howTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-on-surface-variant">{copy.howBody}</p>
            </div>
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map(({ title, description, icon: Icon, style }) => (
                <article key={title} className="card group p-6 transition-transform duration-300 hover:-translate-y-1">
                  <span className={`icon-tile ${style}`}><Icon className="size-5" /></span>
                  <h3 className="mt-5 text-lg font-bold">{title}</h3>
                  <p className="mt-2 leading-7 text-on-surface-variant">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="subjects" className="content-shell section-space">
          <PhysicsDemo />
        </section>

        <section id="progress" className="border-y border-outline-variant/35 bg-white/60">
          <div className="content-shell section-space grid items-center gap-14 md:grid-cols-2">
            <div className="card relative mx-auto w-full max-w-md p-6 md:order-first">
              <BookOpenCheck className="absolute right-6 top-6 size-14 text-primary/10" />
              <p className="border-b border-outline-variant/40 pb-5 text-lg font-bold">{copy.algebra}</p>
              <div className="mt-4 space-y-2">
                <RoadmapItem icon={<CheckCircle2 />} title={copy.linear} note={copy.linearNote} completed />
                <RoadmapItem icon={<Target />} title={copy.systems} note={copy.systemsNote} active />
                <RoadmapItem icon={<Lock />} title={copy.polynomials} note={copy.polynomialsNote} />
              </div>
            </div>
            <div>
              <span className="eyebrow mb-5">{copy.pace}</span>
              <h2 className="section-title text-balance">{copy.paceTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-on-surface-variant">{copy.paceBody}</p>
              <ul className="mt-7 space-y-3 font-semibold text-on-surface">
                <li className="flex items-center gap-3"><CheckCircle2 className="size-5 text-tertiary" /> {copy.mastery}</li>
                <li className="flex items-center gap-3"><BarChart3 className="size-5 text-secondary" /> {copy.tracking}</li>
                <li className="flex items-center gap-3"><Clock3 className="size-5 text-primary" /> {copy.steady}</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="content-shell section-space">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center text-white md:px-12 md:py-20">
            <div className="absolute -left-24 -top-24 size-72 rounded-full bg-white/8" />
            <div className="absolute -bottom-28 -right-16 size-80 rounded-full bg-secondary-fixed/10" />
            <div className="relative mx-auto max-w-2xl">
              <GraduationCap className="mx-auto mb-6 size-10 text-primary-fixed" />
              <h2 className="section-title text-balance">{copy.ctaTitle}</h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-primary-fixed">{copy.ctaBody}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/register" className="btn min-h-14 bg-white px-7 text-base text-primary hover:bg-primary-fixed">{copy.createFree} <ArrowRight className="size-5" /></Link>
                <Link href="/login" className="btn min-h-14 border-2 border-white/60 px-7 text-base text-white hover:bg-white/10">{messages.common.login}</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-outline-variant/50 bg-white py-10">
        <div className="content-shell flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <Brand />
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-on-surface-variant" aria-label="Footer navigation">
            <Link href="#">{messages.common.privacy}</Link><Link href="#">{messages.common.terms}</Link><Link href="#">{messages.common.contact}</Link>
          </nav>
          <p className="text-sm text-on-surface-variant">{messages.common.copyright}</p>
        </div>
      </footer>
    </div>
  );
}

function RoadmapItem({ icon, title, note, completed, active }: { icon: React.ReactNode; title: string; note: string; completed?: boolean; active?: boolean }) {
  return (
    <div className={`flex gap-3 rounded-xl p-4 ${active ? "border border-primary/15 bg-primary-fixed/45 text-primary" : completed ? "text-tertiary" : "text-outline"}`}>
      <span className="mt-0.5 [&>svg]:size-5">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className={`font-bold ${completed ? "line-through opacity-75" : ""}`}>{title}</p>
        {active && <div className="my-2 h-1.5 overflow-hidden rounded-full bg-otp-inactive"><div className="h-full w-2/3 bg-primary" /></div>}
        <p className="text-xs font-semibold opacity-80">{note}</p>
      </div>
    </div>
  );
}
