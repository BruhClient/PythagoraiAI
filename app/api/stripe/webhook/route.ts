import { env } from "@/data/env/server";
import { stripe } from "@/lib/stripe";
import { sendPaymentConfirmationEmail } from "@/server/actions/auth/mail";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { format } from "date-fns";
import { getUserByEmail, updateUserById } from "@/server/db/users";
async function getRawBody(
  readable: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  const signature = (await headers()).get("stripe-signature") as string;

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: "Missing Stripe signature or secret" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req.body!);

    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (error) {
    console.log(error);
    return new NextResponse("invalid signature", { status: 400 });
  }

  const eventType = event.type;

  try {
    switch (eventType) {
      case "payment_intent.succeeded": {
        const { amount, metadata, id } = event.data
          .object as Stripe.PaymentIntent;

        const { email, gems, userId } = metadata;

        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
          throw Error("User not found");
        }
        await updateUserById(userId, {
          gems: existingUser!.gems + parseInt(gems),
        });
        await sendPaymentConfirmationEmail(
          email,
          existingUser.name ?? "Customer",
          id!,
          amount / 100,
          format(Date.now(), "dd MMM yyyy"),
          parseInt(gems)
        );
      }
    }
    return new NextResponse("Success");
  } catch (error) {
    console.log(error);
    return new NextResponse("Error", { status: 500 });
  }
}
