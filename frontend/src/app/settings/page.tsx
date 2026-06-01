"use client";

import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-surface bg-surface p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Settings</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Personalize your workspace</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Configure theme preferences and platform behavior for a polished AI intelligence experience.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-foreground">Theme</h2>
          <p className="mt-3 text-sm text-slate-400">Toggle between dark and light mode to match your environment.</p>
          <div className="mt-6">
            <ThemeToggle />
          </div>
        </div>
        <div className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-foreground">Export</h2>
          <p className="mt-3 text-sm text-slate-400">Use the results page export controls to download JSON or CSV insight reports.</p>
        </div>
      </div>
    </div>
  );
}
