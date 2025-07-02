// pages/checkout.tsx or a Client Component
"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { useTheme } from "next-themes";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage({
  clientSecret,
}: {
  clientSecret: string;
}) {
  const { theme } = useTheme();
  const options = {
    clientSecret,
    appearance: {
      theme: (theme === "dark" ? "night" : "stripe") as "stripe" | "night",
    },
  };

  return (
    <Elements stripe={stripePromise} options={options} key={clientSecret}>
      <CheckoutForm key={clientSecret} />
    </Elements>
  );
}
