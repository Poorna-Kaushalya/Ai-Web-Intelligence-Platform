"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-surface bg-surface/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="inline-flex items-center justify-center rounded-[1.25rem] bg-surface p-1 transition sm:px-0 sm:py-0">
          <Image src="/logo.png" alt="WebIntel AI logo" width={169} height={44} className="rounded-[1.25rem] object-contain" />
        </Link>

        <div className="flex flex-1 items-center justify-between gap-4">
          <nav className="hidden gap-3 text-sm font-semibold sm:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-200"
                      : "text-slate-400 hover:bg-surface hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
