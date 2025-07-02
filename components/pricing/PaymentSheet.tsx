"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePaymentSheet } from "@/context/payment-sheet-context";
import { createCheckout } from "@/server/actions/stripe";

import { useEffect, useState } from "react";
import CheckoutPage from "./CheckoutPage";

export function PaymentSheet() {
  const { isOpen, close, amount, gems } = usePaymentSheet();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !amount) return;

    const getClientSecret = async () => {
      setClientSecret(null);
      try {
        const secret = await createCheckout({ amount, gems });
        setClientSecret(secret);
      } catch (err) {
        console.error("Failed to fetch client secret:", err);
      }
    };

    getClientSecret();
  }, [isOpen, amount]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="p-2 max-w-md w-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Complete your payment</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>

        {clientSecret ? (
          <CheckoutPage key={clientSecret} clientSecret={clientSecret} />
        ) : (
          <div className="text-muted-foreground text-sm w-full h-full flex justify-center py-5">
            loading...
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
