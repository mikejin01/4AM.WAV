"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Platform", href: "#platform" },
  { label: "Help", href: "#help" },
  { label: "Login", href: "/login" },
];

export default function LandingNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/posh" className="flex items-center">
        <Image
          src="/assets/posh/svg/logo-black.svg"
          alt="Posh"
          width={80}
          height={28}
          priority
        />
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-[#0a0a0a] transition-colors hover:text-[#0a0a0a]/60"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/signup"
          className="rounded-full bg-[#f5f5f5] px-5 py-2.5 text-xs font-medium text-[#0a0a0a] transition-all hover:bg-[#e5e5e5] hover:shadow-sm"
        >
          Create event
        </Link>
      </nav>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex flex-col gap-1.5 md:hidden"
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-[#0a0a0a] transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`block h-0.5 w-6 bg-[#0a0a0a] transition-opacity ${menuOpen ? "opacity-0" : ""}`}
        />
        <span
          className={`block h-0.5 w-6 bg-[#0a0a0a] transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      <div
        className={`fixed inset-0 z-40 flex flex-col bg-white transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/posh"
            className="flex items-center"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/assets/posh/svg/logo-black.svg"
              alt="Posh"
              width={80}
              height={28}
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-[#0a0a0a]"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <ul className="flex flex-1 flex-col items-center justify-center gap-10">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-medium text-[#0a0a0a] transition-colors hover:text-[#0a0a0a]/60"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-[#f5f5f5] px-8 py-3 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#e5e5e5]"
            >
              Create event
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
