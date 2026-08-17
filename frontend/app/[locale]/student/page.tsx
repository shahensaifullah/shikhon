"use client";

import {ArrowRight, BookOpen, CheckCircle2, Clock3, Flame, Play} from "lucide-react";
import {LocalizedLink as Link} from "@/components/i18n/localized-link";
import {useI18n} from "@/i18n/provider";

export default function StudentDashboard() {
    const {locale, messages} = useI18n();
    const c = messages.student;
    const days = locale === "bn" ? ["সো", "ম", "বু", "বৃ", "শু", "শ", "র"] : ["M", "T", "W", "T", "F", "S", "S"];
    return <div>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><p className="text-sm font-bold text-primary">{c.date}</p><h1
                className="mt-2 text-3xl font-bold sm:text-4xl">{c.welcome}</h1><p
                className="mt-2 text-on-surface-variant">{c.welcomeBody}</p></div>
            <div
                className="flex items-center gap-2 rounded-xl bg-error-container/50 px-4 py-2.5 text-sm font-bold text-error">
                <Flame className="size-5"/>{c.streak}</div>
        </div>
        <section className="mt-8 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <article className="card overflow-hidden">
                <div className="grid h-full md:grid-cols-[1fr_15rem]">
                    <div className="p-6 sm:p-8"><span className="eyebrow">{c.continue}</span><h2
                        className="mt-5 text-2xl font-bold">{c.systems}</h2><p
                        className="mt-2 leading-7 text-on-surface-variant">{c.algebraLesson}</p>
                        <div className="mt-7 h-2 overflow-hidden rounded-full bg-otp-inactive">
                            <div className="h-full w-[65%] rounded-full bg-primary"/>
                        </div>
                        <div className="mt-2 flex justify-between text-xs font-semibold text-on-surface-variant">
                            <span>{c.complete65}</span><span>{c.minutes12}</span></div>
                        <Link href="#" className="btn btn-primary mt-7">{c.continueLesson}<Play
                            className="size-4 fill-current"/></Link></div>
                    <div className="relative hidden place-items-center overflow-hidden bg-math-bg md:grid"><span
                        className="font-serif text-4xl text-primary">2x + y = 7</span></div>
                </div>
            </article>
            <article className="card p-6">
                <div className="flex items-center justify-between"><h2 className="text-lg font-bold">{c.thisWeek}</h2>
                    <Link href="#" className="text-sm font-bold text-primary">{c.details}</Link></div>
                <div className="mt-7 grid grid-cols-2 gap-3"><Stat icon={<Clock3/>} value={c.timeValue}
                                                                   label={c.learningTime}/><Stat icon={<CheckCircle2/>}
                                                                                                 value={c.activityValue}
                                                                                                 label={c.activities}/>
                </div>
                <div className="mt-6 flex h-20 items-end justify-between gap-2"
                     aria-label={c.weeklyChart}>{[32, 58, 42, 76, 52, 20, 10].map((height, index) => <div key={index}
                                                                                                          className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t bg-primary-fixed" style={{height: `${height}%`}}/>
                    <span className="text-[10px] font-semibold text-outline">{days[index]}</span></div>)}</div>
            </article>
        </section>
        <section className="mt-8">
            <div className="flex items-end justify-between">
                <div><h2 className="text-2xl font-bold">{c.yourCourses}</h2><p
                    className="mt-1 text-on-surface-variant">{c.pickUp}</p></div>
                <Link href="#"
                      className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">{c.viewAll}<ArrowRight
                    className="size-4"/></Link></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3"><Course title={c.algebra} subject={c.math}
                                                                                   progress={65}
                                                                                   color="bg-math-bg text-primary"
                                                                                   complete={c.complete}/><Course
                title={c.forces} subject={c.physics} progress={38} color="bg-physics-bg text-secondary"
                complete={c.complete}/><Course title={c.matter} subject={c.chemistry} progress={22}
                                               color="bg-chemistry-bg text-tertiary" complete={c.complete}/></div>
        </section>
    </div>;
}

function Stat({icon, value, label}: { icon: React.ReactNode; value: string; label: string }) {
    return <div className="rounded-xl bg-surface p-3"><span className="text-primary [&>svg]:size-4">{icon}</span><p
        className="mt-2 text-lg font-bold">{value}</p><p className="text-xs text-on-surface-variant">{label}</p></div>;
}

function Course({title, subject, progress, color, complete}: {
    title: string;
    subject: string;
    progress: number;
    color: string;
    complete: string
}) {
    return <article className="card p-5 transition-transform hover:-translate-y-1">
        <div className={`icon-tile ${color}`}><BookOpen className="size-5"/></div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-on-surface-variant">{subject}</p><h3
        className="mt-1 text-lg font-bold">{title}</h3>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-otp-inactive">
            <div className="h-full rounded-full bg-secondary" style={{width: `${progress}%`}}/>
        </div>
        <p className="mt-2 text-xs font-semibold text-on-surface-variant">{progress}% {complete}</p></article>;
}
