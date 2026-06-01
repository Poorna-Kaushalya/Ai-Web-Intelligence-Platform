"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "ai-web-intelligence-search-history";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  const revisit = (query: string) => {
    router.push(`/results?q=${encodeURIComponent(query)}`);
  };

  const clearHistory = () => {
    setHistory([]);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-4xl border border-surface bg-surface p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">History</p>
        <h1 className="mt-3 text-3xl font-semibold text-foreground">Search activity</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
          Revisit your recent site inspections and continue analysis from where you left off.
        </p>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/30">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Recent queries</h2>
              <p className="mt-2 text-sm text-slate-400">Click a search term to reload the results page.</p>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="rounded-full border border-surface bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-indigo-400 hover:text-foreground"
            >
              Clear history
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {history.length > 0 ? (
              history.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => revisit(item)}
                  className="w-full rounded-3xl border border-surface bg-surface px-4 py-4 text-left text-sm text-foreground transition hover:border-indigo-400 hover:text-foreground"
                >
                  {item}
                </button>
              ))
            ) : (
              <p className="text-sm text-slate-500">No saved searches yet. Run a search to populate history.</p>
            )}
          </div>
        </div>

        <div className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/30">
          <h2 className="text-xl font-semibold text-foreground">Why history matters</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Keep track of your research and revisit important website inspections. History helps you compare previous analyses without losing context.
          </p>
        </div>
      </section>
    </div>
  );
}
