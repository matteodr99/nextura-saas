"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  isPro: boolean;
}

export function ManageSubscriptionButton({ isPro }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!isPro) {
      router.push("/pricing");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/stripe/create-portal", {
      method: "POST",
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }

    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-white text-black hover:bg-zinc-100 disabled:bg-zinc-700 disabled:text-zinc-400 font-medium text-sm px-4 py-2 rounded-xl transition-colors"
    >
      {loading ? "Caricamento..." : isPro ? "Gestisci piano" : "Passa a Pro"}
    </button>
  );
}
