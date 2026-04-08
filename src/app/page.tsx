import Link from "next/link";
import { PLANS } from "@/config/plans";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          Ora in versione beta
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6">
          Il tuo SaaS, <span className="text-zinc-400">pronto in</span>
          <br />
          cinque minuti.
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Nextura è lo starter kit per lanciare il tuo prodotto senza perdere
          settimane sul boilerplate. Auth, pagamenti e dashboard già pronti.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="bg-white text-black font-medium px-8 py-3.5 rounded-xl hover:bg-zinc-100 transition-colors text-sm w-full sm:w-auto text-center"
          >
            Inizia gratis
          </Link>
          <Link
            href="/pricing"
            className="bg-zinc-900 border border-zinc-800 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-zinc-800 transition-colors text-sm w-full sm:w-auto text-center"
          >
            Vedi i prezzi
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-5xl mx-auto px-4 py-24 border-t border-zinc-800">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
          Tutto quello che ti serve
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
          Nessuna configurazione infinita. Parti con una base solida e
          concentrati su quello che conta davvero.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🔐",
              title: "Autenticazione",
              description:
                "Login con email/password e Google OAuth. Sessioni JWT, registrazione e protezione delle route già configurate.",
            },
            {
              icon: "💳",
              title: "Pagamenti Stripe",
              description:
                "Piani free e pro, checkout, webhook e portal clienti. Tutto integrato e pronto per andare in produzione.",
            },
            {
              icon: "🗄️",
              title: "Database",
              description:
                "PostgreSQL con Prisma ORM. Schema type-safe con utenti, sessioni e subscriptions già definiti.",
            },
            {
              icon: "⚡",
              title: "Next.js App Router",
              description:
                "Server Components, API route e middleware. Architettura moderna e performante out of the box.",
            },
            {
              icon: "🎨",
              title: "UI con Tailwind",
              description:
                "Design system minimal e coerente. Dark mode, componenti riutilizzabili e layout responsive.",
            },
            {
              icon: "🚀",
              title: "Deploy su Vercel",
              description:
                "Pronto per il deploy in un click. Variabili d'ambiente, preview branch e CI/CD già configurati.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="text-2xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="max-w-5xl mx-auto px-4 py-24 border-t border-zinc-800">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
          Stack moderno
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
          Tecnologie scelte per scalabilità, developer experience e adozione nel
          mercato.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Next.js 14",
            "TypeScript",
            "Tailwind CSS",
            "Prisma",
            "PostgreSQL",
            "NextAuth.js",
            "Stripe",
            "Vercel",
            "Neon",
          ].map((tech) => (
            <span
              key={tech}
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm px-4 py-2 rounded-xl"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="max-w-5xl mx-auto px-4 py-24 border-t border-zinc-800">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
          Prezzi trasparenti
        </h2>
        <p className="text-zinc-400 text-center mb-16 max-w-xl mx-auto">
          Inizia gratis, passa a Pro quando sei pronto.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {PLANS.map((plan) => {
            const isPro = plan.slug === "pro";
            return (
              <div
                key={plan.slug}
                className={`rounded-2xl p-8 border ${
                  isPro
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-white border-zinc-800"
                }`}
              >
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p
                  className={`text-sm mb-6 ${isPro ? "text-zinc-600" : "text-zinc-400"}`}
                >
                  {plan.description}
                </p>
                <div className="text-4xl font-bold mb-6">
                  {plan.price === 0 ? "€0" : `€${plan.price}`}
                  {plan.price > 0 && (
                    <span
                      className={`text-sm font-normal ml-1 ${isPro ? "text-zinc-600" : "text-zinc-400"}`}
                    >
                      /mese
                    </span>
                  )}
                </div>
                <Link
                  href={isPro ? "/pricing" : "/register"}
                  className={`block text-center py-3 rounded-xl text-sm font-medium transition-colors ${
                    isPro
                      ? "bg-black text-white hover:bg-zinc-800"
                      : "bg-white text-black hover:bg-zinc-100"
                  }`}
                >
                  {isPro ? "Passa a Pro" : "Inizia gratis"}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA finale */}
      <section className="max-w-5xl mx-auto px-4 py-24 border-t border-zinc-800 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-4">
          Pronto a lanciare?
        </h2>
        <p className="text-zinc-400 mb-10 max-w-xl mx-auto">
          Unisciti a chi ha scelto di smettere di reinventare la ruota e ha
          iniziato a costruire prodotti che contano.
        </p>
        <Link
          href="/register"
          className="inline-block bg-white text-black font-medium px-8 py-3.5 rounded-xl hover:bg-zinc-100 transition-colors text-sm"
        >
          Inizia gratis oggi
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-white font-bold">Nextura</span>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Nextura. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6">
            <Link
              href="/pricing"
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              Prezzi
            </Link>
            <Link
              href="/login"
              className="text-zinc-500 hover:text-white text-sm transition-colors"
            >
              Accedi
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
