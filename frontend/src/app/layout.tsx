// app/layout.tsx
"use client";
import { ReactNode } from "react";
import AuthProvider from "@/contexts/AuthContext";
import { ThemeProviderContext } from "@/contexts/ThemeContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>
        <AuthProvider>
          <ThemeProviderContext>{children}</ThemeProviderContext>
        </AuthProvider>
      </body>
    </html>
  );
}
