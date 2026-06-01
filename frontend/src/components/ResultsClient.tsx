"use client";

import { FormEvent, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import ResultCard from "@/components/ResultCard";
import ImageGrid from "@/components/ImageGrid";
import ContactCard from "@/components/ContactCard";
import AnalyticsChart from "@/components/AnalyticsChart";
import { fetchScrape, ScrapeResponse } from "@/lib/api";

type FetchState = {
  result: ScrapeResponse | null;
  loading: boolean;
  error: string;
};

type FetchAction =
  | { type: "reset" }
  | { type: "start" }
  | { type: "success"; result: ScrapeResponse }
  | { type: "failure"; error: string };

interface ResultsClientProps {
  initialQuery: string;
}

export default function ResultsClient({ initialQuery }: ResultsClientProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(initialQuery);
  const [fetchState, dispatch] = useReducer((state: FetchState, action: FetchAction): FetchState => {
    switch (action.type) {
      case "reset":
        return { result: null, loading: false, error: "" };
      case "start":
        return { result: null, loading: true, error: "" };
      case "success":
        return { result: action.result, loading: false, error: "" };
      case "failure":
        return { result: null, loading: false, error: action.error };
      default:
        return state;
    }
  }, { result: null, loading: false, error: "" });

  const { result, loading, error } = fetchState;

  useEffect(() => {
    if (!initialQuery) {
      dispatch({ type: "reset" });
      return;
    }

    dispatch({ type: "start" });

    fetchScrape(initialQuery)
      .then((data) => dispatch({ type: "success", result: data }))
      .catch((fetchError) => {
        const message = fetchError?.response?.data?.detail || fetchError?.message || "Unable to fetch results.";
        dispatch({ type: "failure", error: message });
      });
  }, [initialQuery]);

  const domain = useMemo(() => {
    if (!result) return "";
    try {
      return new URL(result.title ? result.title : result.links?.[0]?.href || result.description).hostname.replace(/^www\./, "");
    } catch {
      return initialQuery;
    }
  }, [initialQuery, result]);

  const summaryText = useMemo(() => {
    if (!result) return "";
    return (
      result.description ||
      `AI-generated summary placeholder for ${initialQuery}. The page appears to include several links, metadata details, and site content.`
    );
  }, [initialQuery, result]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    if (!trimmed) return;
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  };

  const internalLinks = useMemo(() => {
    if (!result) return [];
    return result.links.filter((link) => {
      try {
        return new URL(link.href).hostname.replace(/^www\./, "") === new URL(initialQuery).hostname.replace(/^www\./, "");
      } catch {
        return false;
      }
    });
  }, [initialQuery, result]);

  const externalLinks = useMemo(() => {
    if (!result) return [];
    return result.links.filter((link) => {
      try {
        return new URL(link.href).hostname.replace(/^www\./, "") !== new URL(initialQuery).hostname.replace(/^www\./, "");
      } catch {
        return true;
      }
    });
  }, [initialQuery, result]);

  const safeResult = useMemo(
    () => ({
      ...result,
      images: result?.images ?? [],
      emails: result?.emails ?? [],
      phones: result?.phones ?? [],
      socials: result?.socials ?? [],
      links: result?.links ?? [],
      metadata: result?.metadata ?? {},
    }),
    [result],
  );

  const contactCount = safeResult.emails.length + safeResult.phones.length;

  const aiSummary = useMemo(() => {
    if (!result) return "";
    const descriptionHint = safeResult.metadata.description ? "a detailed metadata description" : "no visible meta description";
    return `This page appears to be ${result.title ? `"${result.title}"` : "a website"} with ${safeResult.links.length} links, ${safeResult.images.length} images, and ${contactCount} contact items. It contains ${descriptionHint} and is ready for deeper SEO and intelligence analysis.`;
  }, [result, safeResult, contactCount]);

  const seoScore = useMemo(() => {
    if (!result) return 0;
    let score = 40;
    if (safeResult.metadata.title) score += 15;
    if (safeResult.metadata.description) score += 15;
    if (safeResult.links.length >= 5) score += 10;
    if (safeResult.images.length >= 3) score += 10;
    if (contactCount > 0) score += 10;
    return Math.min(100, score);
  }, [result, safeResult, contactCount]);

  const analyticsData = [
    { name: "Internal", value: internalLinks.length, fill: "#818cf8" },
    { name: "External", value: externalLinks.length, fill: "#38bdf8" },
    { name: "Images", value: safeResult.images.length, fill: "#f97316" },
  ];

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    if (!result) return;
    downloadFile(JSON.stringify(result, null, 2), `${domain || "website"}-insights.json`, "application/json");
  };

  const exportCSV = () => {
    if (!result) return;
    const rows = [
      ["Field", "Value"],
      ["URL", result.url],
      ["Title", result.title || "N/A"],
      ["Description", result.description || "N/A"],
      ["Images", String(safeResult.images.length)],
      ["Links", String(safeResult.links.length)],
      ["Contacts", String(contactCount)],
      ["Meta Title", safeResult.metadata.title || "N/A"],
      ["Meta Description", safeResult.metadata.description || "N/A"],
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadFile(csv, `${domain || "website"}-insights.csv`, "text/csv");
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-6 rounded-4xl border border-surface bg-surface p-6 shadow-2xl shadow-black/30 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Search results</p>
              <h1 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl">Explore insights for your query</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Review site intelligence, page metadata, extracted contacts, and visual assets in a clean dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex rounded-full border border-surface bg-surface px-5 py-3 text-sm font-semibold text-foreground transition hover:border-indigo-400 hover:bg-surface-soft"
            >
              New search
            </button>
          </div>

          <SearchBar
            query={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearchSubmit}
            loading={loading}
            placeholder="Search another URL or query"
            buttonLabel="Inspect"
          />
        </div>

        {loading ? (
          <div className="mt-8 space-y-6">
            <div className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/10 animate-pulse">
              <div className="h-6 w-48 rounded-full bg-surface-soft"></div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-40 rounded-3xl bg-surface-soft"></div>
                ))}
              </div>
            </div>
            <div className="rounded-4xl bg-surface p-8 shadow-2xl shadow-black/10 animate-pulse">
              <div className="h-5 w-40 rounded-full bg-surface-soft"></div>
              <div className="mt-6 space-y-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-12 rounded-3xl bg-surface-soft"></div>
                ))}
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-4xl border border-red-500/20 bg-red-500/5 p-8 text-slate-100 shadow-2xl shadow-black/20">
            <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
            <p className="mt-3 text-sm leading-6 text-red-200">{error}</p>
          </div>
        ) : result ? (
          <div className="mt-8 space-y-8">
            <div className="flex flex-col gap-4 rounded-4xl border border-surface bg-surface p-5 shadow-2xl shadow-black/20 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Export results</p>
                <p className="mt-2 text-sm text-slate-500">Download your report for sharing or research.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={exportJSON}
                  className="rounded-full border border-surface bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-indigo-400 hover:bg-surface-soft"
                >
                  Export JSON
                </button>
                <button
                  type="button"
                  onClick={exportCSV}
                  className="rounded-full border border-surface bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-indigo-400 hover:bg-surface-soft"
                >
                  Export CSV
                </button>
                <button
                  type="button"
                  onClick={printReport}
                  className="rounded-full border border-surface bg-surface px-4 py-3 text-sm font-semibold text-foreground transition hover:border-indigo-400 hover:bg-surface-soft"
                >
                  Print PDF
                </button>
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <ResultCard
                title={result.title || "Website Overview"}
                subtitle={initialQuery}
                badge={domain || "Website"}
              >
                <p className="text-slate-500">{summaryText}</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl bg-surface p-4 text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Fetched</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">{safeResult.images.length} images</p>
                  </div>
                  <div className="rounded-3xl bg-surface p-4 text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Contacts</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">{safeResult.emails.length + safeResult.phones.length}</p>
                  </div>
                  <div className="rounded-3xl bg-surface p-4 text-sm text-slate-600">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Links</p>
                    <p className="mt-3 text-lg font-semibold text-foreground">{safeResult.links.length}</p>
                  </div>
                </div>
              </ResultCard>

              <ResultCard title="Metadata" subtitle="Page details">
                <div className="grid gap-4">
                  <div className="rounded-3xl border border-surface bg-surface p-4 text-sm text-slate-600">
                    <p className="font-semibold text-foreground">Meta Title</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{safeResult.metadata.title || "Unavailable"}</p>
                  </div>
                  <div className="rounded-3xl border border-surface bg-surface p-4 text-sm text-slate-600">
                    <p className="font-semibold text-foreground">Meta Description</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{safeResult.metadata.description || "Unavailable"}</p>
                  </div>
                  <div className="rounded-3xl border border-surface bg-surface p-4 text-sm text-slate-600">
                    <p className="font-semibold text-foreground">Keywords</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{safeResult.metadata.keywords || "Unavailable"}</p>
                  </div>
                </div>
              </ResultCard>
            </div>

            <ResultCard title="AI Summary" subtitle="Key takeaways">
              <p className="text-slate-600">{aiSummary}</p>
            </ResultCard>

            <ResultCard title="Insights" subtitle="Visual distribution">
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-surface p-5">
                  <AnalyticsChart data={analyticsData} />
                </div>
                <div className="rounded-3xl bg-surface p-5">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">SEO score</p>
                  <p className="mt-4 text-5xl font-semibold text-foreground">{seoScore}%</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    This score is based on metadata coverage, content structure, image assets, and link volume.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-3xl bg-surface-soft p-4 text-sm text-slate-600">
                      <p className="font-semibold text-foreground">Contact count</p>
                      <p className="mt-2 text-lg text-foreground">{contactCount}</p>
                    </div>
                    <div className="rounded-3xl bg-surface-soft p-4 text-sm text-slate-600">
                      <p className="font-semibold text-foreground">Link split</p>
                      <p className="mt-2 text-lg text-foreground">{internalLinks.length} internal / {externalLinks.length} external</p>
                    </div>
                  </div>
                </div>
              </div>
            </ResultCard>

            <ResultCard title="Images" subtitle="Extracted media assets">
              <ImageGrid images={safeResult.images} />
            </ResultCard>

            <ResultCard title="Contacts" subtitle="Emails, phones, and social links">
              <ContactCard emails={safeResult.emails} phones={safeResult.phones} socials={safeResult.socials} />
            </ResultCard>

            <ResultCard title="Links" subtitle="Internal and external page references">
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-surface bg-surface p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Internal links</h3>
                  <div className="mt-4 space-y-3">
                    {internalLinks.length > 0 ? (
                      internalLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-3xl border border-surface bg-surface-soft px-4 py-3 text-sm text-slate-600 transition hover:border-indigo-500"
                        >
                          <p className="font-medium text-foreground">{link.text || link.href}</p>
                          <p className="truncate text-xs text-slate-500">{link.href}</p>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No internal links found.</p>
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-surface bg-surface p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">External links</h3>
                  <div className="mt-4 space-y-3">
                    {externalLinks.length > 0 ? (
                      externalLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-3xl border border-surface bg-surface-soft px-4 py-3 text-sm text-slate-600 transition hover:border-indigo-500"
                        >
                          <p className="font-medium text-foreground">{link.text || link.href}</p>
                          <p className="truncate text-xs text-slate-500">{link.href}</p>
                        </a>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No external links found.</p>
                    )}
                  </div>
                </div>
              </div>
            </ResultCard>
          </div>
        ) : (
          <div className="mt-8 rounded-4xl border border-surface bg-surface p-8 text-slate-600 shadow-2xl shadow-black/10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">No results yet</p>
            <p className="mt-4 text-lg leading-7 text-slate-600">
              Enter a URL or query in the search bar above to inspect a website.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
