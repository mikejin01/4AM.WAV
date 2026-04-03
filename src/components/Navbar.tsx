"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  }

  const navItems = [
    { label: "Events", href: "#" },
    ...(user
      ? [{ label: "Create Event", href: "#" }]
      : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="text-xl font-bold tracking-wider text-white">
        4AM.WAV
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
          >
            {item.label}
          </Link>
        ))}

        {user ? (
          <button
            onClick={handleSignOut}
            className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
          >
            Login
          </Link>
        )}
      </div>

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
          {navItems.map((item) => (
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
          <li>
            {user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleSignOut();
                }}
                className="text-2xl font-medium uppercase tracking-widest text-white transition-colors hover:text-gold"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-2xl font-medium uppercase tracking-widest text-white transition-colors hover:text-gold"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
