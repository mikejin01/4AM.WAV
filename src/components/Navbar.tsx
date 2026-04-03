"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Events", href: "#" },
  { label: "Login", href: "#" },
  { label: "Create Event", href: "#" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="text-xl font-bold tracking-wider text-white">
        4AM.WAV
      </Link>

      {/* Desktop nav */}
      <ul className="hidden gap-8 md:flex">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex flex-col gap-1.5 md:hidden"
        aria-label="Toggle menu"
      >
        <span
          className={`block h-0.5 w-6 bg-white transition-transform ${
            menuOpen ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-opacity ${
            menuOpen ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-transform ${
            menuOpen ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-0 z-30 flex flex-col bg-black/95 backdrop-blur-md transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 sm:px-10">
          <Link
            href="/"
            className="text-xl font-bold tracking-wider text-white"
            onClick={() => setMenuOpen(false)}
          >
            4AM.WAV
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-2xl text-white"
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>
        <ul className="flex flex-1 flex-col items-center justify-center gap-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-medium uppercase tracking-widest text-white transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
