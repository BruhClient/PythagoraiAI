"use client";

import { createContext, useContext, useState } from "react";

type PaymentSheetContextType = {
  isOpen: boolean;
  open: (amount: number, gems: number) => void;
  close: () => void;
  amount: number | null;
  gems: number;
};

const PaymentSheetContext = createContext<PaymentSheetContextType | undefined>(
  undefined
);

export const PaymentSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);
  const [gems, setGems] = useState(0);

  const open = (amount: number, gems: number) => {
    setAmount(amount);
    setIsOpen(true);
    setGems(gems);
  };

  const close = () => {
    setIsOpen(false);
    setAmount(null);
  };

  return (
    <PaymentSheetContext.Provider value={{ isOpen, open, close, amount, gems }}>
      {children}
    </PaymentSheetContext.Provider>
  );
};

export const usePaymentSheet = () => {
  const context = useContext(PaymentSheetContext);
  if (!context)
    throw new Error("usePaymentSheet must be used within PaymentSheetProvider");
  return context;
};
