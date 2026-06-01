"use client";

import { FormEvent } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  placeholder?: string;
  buttonLabel?: string;
}

export default function SearchBar({
  query,
  onChange,
  onSubmit,
  loading,
  placeholder = "Enter a URL or query",
  buttonLabel = "Search",
}: SearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:flex-row"
    >
      <label className="sr-only" htmlFor="search-input">
        Search query
      </label>

      <div className="relative flex-1">
        <HiMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <input
          id="search-input"
          value={query}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-surface bg-surface py-4 pl-12 pr-5 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-indigo-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-700"
      >
        {loading ? "Analyzing..." : buttonLabel}
      </button>
    </form>
  );
}