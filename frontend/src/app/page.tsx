"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";

const STORAGE_KEY = "ai-web-intelligence-search-history";

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState("");
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
  const [isLoading, setIsLoading] = useState(false);

  const saveHistory = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;

    setHistory((currentHistory) => {
      const nextHistory = [normalized, ...currentHistory.filter((item) => item !== normalized)].slice(0, 8);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory));
      return nextHistory;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    saveHistory(trimmed);
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  const handleHistoryClick = (value: string) => {
    setQuery(value);
    saveHistory(value);
    router.push(`/results?q=${encodeURIComponent(value)}`);
  };

  const clearHistory = () => {
    setHistory([]);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="w-full rounded-[2.5rem] border border-surface bg-surface p-10 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-14">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-indigo-500/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-200">
                WebIntel AI
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                AI-powered website intelligence for every URL.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                Analyze website structure, metadata, links, and AI insights in a clean, modern dashboard experience.
              </p>
            </div>

            <SearchBar query={query} onChange={setQuery} onSubmit={handleSubmit} loading={isLoading} buttonLabel="Analyze" />

            {history.length > 0 ? (
              <div className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/10">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Recent searches</p>
                    <p className="mt-1 text-sm text-slate-600">Tap any query to reopen its results.</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="rounded-full border border-black/10 bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:bg-slate-200"
                  >
                    Clear history
                  </button>
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {history.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleHistoryClick(item)}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-3">
              <article className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/10">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Rapid scraping</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">Extract key website data instantly</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Fetch page metadata, links, images, and contact details with one click.</p>
              </article>
              <article className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/10">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Smart analytics</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">Visual insights at a glance</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Track content structure, link distribution, and SEO signals from every site.</p>
              </article>
              <article className="rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/10">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">AI insights</p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">Unlock intelligent website summaries</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">Generate concise AI-driven recommendations based on the scraped content.</p>
              </article>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
