"use client";
import { useI18n } from "@/i18n/provider";
export default function LibraryPage(){const {messages}=useI18n();const c=messages.student;return <section><p className="text-sm font-bold text-primary">{c.explore}</p><h1 className="mt-2 text-3xl font-bold">{c.library}</h1><p className="mt-3 text-on-surface-variant">{c.libraryDescription}</p><div className="card mt-8 p-8 text-center text-on-surface-variant">{c.libraryPlaceholder}</div></section>}
