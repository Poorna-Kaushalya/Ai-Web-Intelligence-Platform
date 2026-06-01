"use client";

import { HiMoon, HiSun } from "react-icons/hi2";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-surface bg-surface px-4 py-2 text-sm font-semibold text-foreground transition hover:border-indigo-400 hover:bg-surface-soft"
    >
      {theme === "dark" ? <HiMoon className="h-5 w-5" /> : <HiSun className="h-5 w-5" />}
      {theme === "dark" ? "Dark mode" : "Light mode"}
    </button>
  );
}
