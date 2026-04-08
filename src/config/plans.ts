export const PLANS = [
  {
    name: "Free",
    slug: "free",
    description: "Perfetto per iniziare",
    price: 0,
    features: ["1 progetto", "1.000 richieste/mese", "Supporto community"],
    stripePriceId: null,
  },
  {
    name: "Pro",
    slug: "pro",
    description: "Per chi vuole fare sul serio",
    price: 9,
    features: [
      "Progetti illimitati",
      "100.000 richieste/mese",
      "Supporto prioritario",
      "Analytics avanzate",
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
];

export type Plan = (typeof PLANS)[number];
