"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

function UserMenu({
  user,
  onSignOut,
}: {
  user: User;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const name =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";
  const avatar: string | undefined = user.user_metadata?.avatar_url;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-white/10"
      >
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-gold">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm font-medium text-white/80">{name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-lg border border-white/10 bg-surface-light shadow-xl">
          <Link
            href="#"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Profile
          </Link>
          <Link
            href="/tickets"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Tickets
          </Link>
          <div className="border-t border-white/10" />
          <button
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="block w-full px-4 py-2.5 text-left text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

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
    { label: "Events", href: "/events" },
    ...(user ? [{ label: "Create Event", href: "#" }] : []),
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
          <UserMenu user={user} onSignOut={handleSignOut} />
        ) : (
          <>
            <Link
              href="/login"
              className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded border border-gold px-4 py-1.5 text-sm font-medium uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-black"
            >
              Create Account
            </Link>
          </>
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
          {user ? (
            <>
              <li className="flex flex-col items-center gap-3">
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name ?? "User"}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-lg font-bold text-gold">
                    {(user.user_metadata?.full_name ?? "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm text-white/50">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
              </li>
              <li>
                <Link
                  href="#"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium uppercase tracking-widest text-white transition-colors hover:text-gold"
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/tickets"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium uppercase tracking-widest text-white transition-colors hover:text-gold"
                >
                  Tickets
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="text-2xl font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-white"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium uppercase tracking-widest text-white transition-colors hover:text-gold"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-2xl font-medium uppercase tracking-widest text-gold transition-colors hover:text-gold-light"
                >
                  Create Account
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
