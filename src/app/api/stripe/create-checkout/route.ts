import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/config/plans";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const { planSlug } = await req.json();
  const plan = PLANS.find((p) => p.slug === planSlug);

  if (!plan || !plan.stripePriceId) {
    return NextResponse.json({ error: "Piano non valido" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });
  }

  // Crea o recupera il customer Stripe
  let stripeCustomerId = user.stripeCustomerId;

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: user.name ?? undefined,
      metadata: { userId: user.id },
    });

    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId },
    });
  }

  // Crea la sessione di checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    metadata: { userId: user.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
