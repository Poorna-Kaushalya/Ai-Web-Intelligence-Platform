"use client";

import { useState } from "react";

interface ContactCardProps {
  emails: string[];
  phones: string[];
  socials: string[];
}

export default function ContactCard({ emails, phones, socials }: ContactCardProps) {
  const [copiedItem, setCopiedItem] = useState("");

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedItem(value);
      window.setTimeout(() => setCopiedItem(""), 2000);
    } catch {
      setCopiedItem("");
    }
  };

  const renderList = (items: string[]) =>
    items.length > 0 ? (
      items.map((item) => (
        <div key={item} className="flex min-w-0 items-center justify-between gap-3 rounded-3xl border border-surface bg-surface px-4 py-3 text-sm text-foreground">
          <span className="min-w-0 wrap-break-word">{item}</span>
          <button
            type="button"
            onClick={() => copyToClipboard(item)}
            className="rounded-full bg-surface-soft px-3 py-1 text-xs font-semibold text-foreground transition hover:bg-surface"
          >
            {copiedItem === item ? "Copied" : "Copy"}
          </button>
        </div>
      ))
    ) : (
      <p className="text-sm text-slate-500">No items found.</p>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1.7fr_1.3fr]">
      <div className="space-y-6">
        <div className="rounded-3xl border border-surface bg-surface p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Emails</h3>
          <div className="mt-4 space-y-3">{renderList(emails)}</div>
        </div>
        <div className="rounded-3xl border border-surface bg-surface p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Phones</h3>
          <div className="mt-4 space-y-3">{renderList(phones)}</div>
        </div>
      </div>
      <div className="rounded-3xl border border-surface bg-surface p-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Social</h3>
        <div className="mt-4 space-y-3">{renderList(socials)}</div>
      </div>
    </div>
  );
}
