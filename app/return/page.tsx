import { redirect } from "next/navigation";

import { stripe } from "../../lib/stripe";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gem } from "lucide-react";

export default async function Return({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent: string; redirect_status: string }>;
}) {
  const paymentIntentId = (await searchParams).payment_intent;

  if (!paymentIntentId) throw new Error("Missing payment_intent ID");

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    return redirect("/");
  }

  return (
    <section className="w-full flex h-screen justify-center items-center flex-col text-center gap-4 px-2">
      <div className="text-4xl font-bold">Your Payment Was Successful! 🎉</div>
      <div className="flex gap-2 items-center text-muted-foreground font-serif text-sm">
        {paymentIntent.metadata.gems} <Gem size={13} /> have been added to your
        account
      </div>
      <p className="text-lg max-w-[700px] font-serif">
        A confirmation email will be sent to{" "}
        <span className="font-semibold">{paymentIntent.metadata.email}</span>.
        If you have any questions, contact{" "}
        <a href="mailto:orders@example.com" className="font-semibold">
          orders@example.com
        </a>
        .
      </p>
      <Button variant={"outline"} asChild>
        <Link href="/home">Back to dashboard</Link>
      </Button>
    </section>
  );
}
