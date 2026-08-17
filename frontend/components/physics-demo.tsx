"use client";

import { Atom } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/i18n/provider";

export function PhysicsDemo() {
  const [force, setForce] = useState(20);
  const [mass, setMass] = useState(5);
  const acceleration = force / mass;
  const { messages } = useI18n();
  const copy = messages.physics;

  return (
    <div className="grid items-center gap-10 rounded-2xl border border-secondary/15 bg-physics-bg p-5 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <span className="eyebrow mb-5 bg-secondary-fixed text-secondary"><Atom className="size-4" /> {copy.try}</span>
        <h2 className="section-title text-balance">{copy.title}</h2>
        <p className="mt-5 max-w-lg text-lg leading-8 text-on-surface-variant">
          {copy.body}
        </p>

        <div className="card mt-8 space-y-6 p-5 shadow-none">
          <DemoSlider label={copy.force} unit="N" value={force} min={1} max={100} onChange={setForce} color="primary" />
          <DemoSlider label={copy.mass} unit="kg" value={mass} min={1} max={20} onChange={setMass} color="secondary" />
          <div className="flex items-end justify-between border-t border-outline-variant/50 pt-5">
            <span className="text-sm font-semibold text-on-surface-variant">{copy.acceleration}</span>
            <span className="font-serif text-3xl font-semibold text-on-surface">{acceleration.toFixed(1)} m/s²</span>
          </div>
        </div>
      </div>

      <div className="relative min-h-[22rem] overflow-hidden rounded-2xl border border-outline-variant/50 bg-white shadow-inner" aria-label={copy.visual}>
        <div className="absolute inset-x-0 bottom-0 h-16 border-t border-outline-variant/60 bg-surface-container-highest" />
        <div className="absolute inset-x-8 top-8 flex justify-between text-xs font-semibold uppercase tracking-[0.15em] text-outline">
          <span>{copy.less}</span><span>{copy.more}</span>
        </div>
        <div
          className="absolute bottom-16 grid size-24 place-items-center rounded-xl border-2 border-secondary bg-secondary-fixed font-bold text-secondary shadow-lg transition-[left,width,height] duration-300"
          style={{
            left: `clamp(1.5rem, ${Math.min(72, 8 + acceleration * 4)}%, calc(100% - 7.5rem))`,
            width: `${Math.max(72, 116 - mass * 2)}px`,
            height: `${Math.max(72, 116 - mass * 2)}px`,
          }}
        >
          {mass} kg
          <div className="absolute left-full top-1/2 flex -translate-y-1/2 items-center">
            <div className="h-1 bg-primary" style={{ width: `${Math.max(42, force)}px` }} />
            <div className="size-0 border-y-[7px] border-l-[11px] border-y-transparent border-l-primary" />
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-primary">{force} N</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoSlider({ label, unit, value, min, max, onChange, color }: {
  label: string; unit: string; value: number; min: number; max: number;
  onChange: (value: number) => void; color: "primary" | "secondary";
}) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center justify-between text-sm font-bold">
        <span>{label}</span>
        <output className={color === "primary" ? "rounded-lg bg-primary-fixed px-2.5 py-1 text-primary" : "rounded-lg bg-secondary-fixed px-2.5 py-1 text-secondary"}>{value} {unit}</output>
      </span>
      <input
        className={color === "primary" ? "w-full accent-primary" : "w-full accent-secondary"}
        type="range" min={min} max={max} value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
