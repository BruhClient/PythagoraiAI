// components/CheckoutForm.tsx
"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "../ui/button";
import { usePaymentSheet } from "@/context/payment-sheet-context";
import { Gem } from "lucide-react";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { gems, amount } = usePaymentSheet();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // This is where the user goes after payment
        return_url: `${window.location.origin}/return`,
      },
    });

    if (error) {
      setMessage(error.message || "Payment failed");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-center justify-center w-full gap-2">
        {gems} <Gem size={13} />{" "}
      </div>
      <div className="flex items-center justify-center w-full gap-2 text-muted-foreground text-sm font-serif">
        Each <Gem size={13} /> represents 1 PDF Generation
      </div>
      <PaymentElement />
      <Button
        variant={"outline"}
        type="submit"
        className="w-full"
        disabled={!stripe || isLoading}
      >
        {isLoading ? "Processing…" : `Pay $${amount}`}
      </Button>
      {message && <div style={{ color: "red" }}>{message}</div>}
    </form>
  );
}
