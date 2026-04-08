import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "Nessuna subscription attiva" },
      { status: 400 },
    );
  }

  // Il portal permette all'utente di gestire la sua subscription
  // (cambiare piano, cancellare, aggiornare carta)
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  });

  return NextResponse.json({ url: portalSession.url });
}
