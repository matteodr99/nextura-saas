"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Qualcosa è andato storto");
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Nextura
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Crea il tuo account</p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="Mario Rossi"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="tu@esempio.com"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                placeholder="Minimo 8 caratteri"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-zinc-100 disabled:bg-zinc-700 disabled:text-zinc-400 text-black font-medium py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? "Registrazione in corso..." : "Crea account"}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Hai già un account?{" "}
          <Link href="/login" className="text-white hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}
