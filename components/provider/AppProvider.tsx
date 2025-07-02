"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";
import { PaymentSheetProvider } from "@/context/payment-sheet-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./ThemeProvider";
// prettier-ignore
const queryClient = new QueryClient
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <PaymentSheetProvider>{children}</PaymentSheetProvider>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
