import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature non valida" },
      { status: 400 },
    );
  }

  // Checkout completato — attiva il piano Pro
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const subscription = (await stripe.subscriptions.retrieve(
      session.subscription as string,
    )) as unknown as {
      id: string;
      customer: string;
      current_period_end: number;
      items: { data: { price: { id: string } }[] };
    };

    await prisma.user.update({
      where: { id: session.metadata?.userId },
      data: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  // Rinnovo subscription — aggiorna la data di scadenza
  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice & {
      subscription: string;
    };

    const subscription = (await stripe.subscriptions.retrieve(
      invoice.subscription,
    )) as unknown as {
      id: string;
      current_period_end: number;
      items: { data: { price: { id: string } }[] };
    };

    await prisma.user.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  return NextResponse.json({ ok: true });
}
