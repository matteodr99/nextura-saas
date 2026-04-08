"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-tight">
          Nextura
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/pricing"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Prezzi
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="bg-white text-black text-sm font-medium px-4 py-2 rounded-xl hover:bg-zinc-100 transition-colors"
              >
                Inizia gratis
              </Link>
            </>
          )}
        </div>

        {/* Menu mobile */}
        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black px-4 py-4 flex flex-col gap-4">
          <Link
            href="/pricing"
            className="text-zinc-400 hover:text-white text-sm transition-colors"
          >
            Prezzi
          </Link>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-left text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Esci
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Inizia gratis
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
