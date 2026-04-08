import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/config/plans";
import { ManageSubscriptionButton } from "@/components/dashboard/manage-subscription-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Controlla se il piano Pro è attivo e non scaduto
  const isPro =
    user?.stripePriceId &&
    user?.stripeCurrentPeriodEnd &&
    new Date(user.stripeCurrentPeriodEnd) > new Date();

  const currentPlan = isPro
    ? PLANS.find((p) => p.slug === "pro")
    : PLANS.find((p) => p.slug === "free");

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            Benvenuto, {user?.name ?? session.user.email} 👋
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Questa è la tua dashboard
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Piano attuale</p>
            <p className="text-white font-semibold text-lg">
              {currentPlan?.name}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Account</p>
            <p className="text-white font-semibold text-lg truncate">
              {session.user.email}
            </p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Stato</p>
            <p className="text-green-400 font-semibold text-lg">Attivo</p>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold mb-1">Il tuo piano</h2>
              {isPro ? (
                <p className="text-zinc-400 text-sm">
                  Pro — rinnovo il{" "}
                  {new Date(user!.stripeCurrentPeriodEnd!).toLocaleDateString(
                    "it-IT",
                  )}
                </p>
              ) : (
                <p className="text-zinc-400 text-sm">
                  Passa a Pro per sbloccare tutte le funzionalità
                </p>
              )}
            </div>
            <ManageSubscriptionButton isPro={!!isPro} />
          </div>
        </div>
      </div>
    </div>
  );
}
