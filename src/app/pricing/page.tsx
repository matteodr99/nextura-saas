"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PLANS } from "@/config/plans";

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePlan(planSlug: string) {
    if (planSlug === "free") {
      router.push(session ? "/dashboard" : "/register");
      return;
    }

    if (!session) {
      router.push("/register");
      return;
    }

    setLoading(planSlug);

    const res = await fetch("/api/stripe/create-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planSlug }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }

    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Semplice. Trasparente.
          </h1>
          <p className="text-zinc-400 text-lg">
            Inizia gratis, passa a Pro quando sei pronto.
          </p>
        </div>

        {/* Piani */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => {
            const isPro = plan.slug === "pro";

            return (
              <div
                key={plan.slug}
                className={`relative rounded-2xl p-8 border ${
                  isPro
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-white border-zinc-800"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full border border-zinc-700">
                      Più popolare
                    </span>
                  </div>
                )}

                {/* Piano header */}
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <p
                    className={`text-sm ${isPro ? "text-zinc-600" : "text-zinc-400"}`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Prezzo */}
                <div className="mb-8">
                  <span className="text-5xl font-bold">
                    {plan.price === 0 ? "€0" : `€${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span
                      className={`text-sm ml-2 ${isPro ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      /mese
                    </span>
                  )}
                </div>

                {/* Feature */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${isPro ? "text-black" : "text-white"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePlan(plan.slug)}
                  disabled={loading === plan.slug}
                  className={`w-full py-3 rounded-xl font-medium text-sm transition-colors ${
                    isPro
                      ? "bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-700"
                      : "bg-white text-black hover:bg-zinc-100 disabled:bg-zinc-700 disabled:text-zinc-400"
                  }`}
                >
                  {loading === plan.slug
                    ? "Caricamento..."
                    : plan.price === 0
                      ? "Inizia gratis"
                      : "Passa a Pro"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
