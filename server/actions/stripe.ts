"use server";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export async function createCheckout({
  amount,
  gems,
}: {
  amount: number;
  gems: number;
}) {
  const userSession = await auth();
  if (!userSession) return null;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // amount in cents (e.g., $10.00 = 1000)
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      userId: userSession.user.id,
      gems,
      email: userSession.user.email!,
    },
  });

  return paymentIntent.client_secret;
}
