"use client";

import { Check, Ellipsis, FunctionSquare } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export function LearningPreview() {
  const { messages } = useI18n();
  const copy = messages.preview;
  return (
    <div className="relative mx-auto w-full max-w-[29rem]">
      <div className="absolute -inset-12 -z-10 rounded-full bg-gradient-to-tr from-primary-fixed via-math-bg to-secondary-fixed blur-3xl" />
      <div className="card overflow-hidden shadow-ambient">
        <div className="flex items-center justify-between border-b border-outline-variant/45 bg-math-bg/70 p-5">
          <div className="flex items-center gap-3">
            <span className="icon-tile bg-primary text-white"><FunctionSquare className="size-5" /></span>
            <div>
              <p className="font-bold text-on-surface">{copy.title}</p>
              <p className="mt-0.5 text-xs font-medium text-on-surface-variant">{copy.lesson}</p>
            </div>
          </div>
          <button type="button" aria-label={copy.more} className="grid size-10 place-items-center rounded-xl text-outline hover:bg-white"><Ellipsis /></button>
        </div>
        <div className="h-1 bg-otp-inactive"><div className="h-full w-1/2 rounded-r-full bg-tertiary-container" /></div>
        <div className="space-y-7 p-5 md:p-6">
          <div className="relative grid min-h-40 place-items-center overflow-hidden rounded-xl border border-outline-variant/40 bg-surface">
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-primary-fixed/60 blur-2xl" />
            <span className="relative font-serif text-4xl text-on-surface">ax² + bx + c = 0</span>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-on-surface-variant">{copy.solve} <span className="font-serif text-base text-primary">a=1, b=-3, c=2</span></p>
            <div className="flex gap-2">
              <div className="flex h-12 flex-1 items-center rounded-xl border-2 border-tertiary/40 bg-white px-4 font-semibold text-on-surface">2, 1</div>
              <div className="grid size-12 place-items-center rounded-xl bg-chemistry-bg text-tertiary"><Check /></div>
            </div>
            <p className="mt-2 text-xs font-semibold text-tertiary">{copy.correct}</p>
          </div>
        </div>
      </div>
      <div className="card absolute -bottom-7 -left-3 flex items-center gap-3 px-4 py-3 sm:-left-10">
        <span className="grid size-9 place-items-center rounded-full bg-chemistry-bg font-bold text-tertiary">+8</span>
        <div><p className="text-xs font-bold">{copy.momentum}</p><p className="text-[11px] text-on-surface-variant">{copy.mastered}</p></div>
      </div>
    </div>
  );
}
