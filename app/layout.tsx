import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

// FIX: Resolved issue with importing 'Metadata' type by removing the explicit type
// annotation. Next.js correctly infers the metadata object's type.
export const metadata = {
  title: "Gemini Image ChatBot",
  description: "Create and edit images with Gemini",
};

export default function RootLayout({
  children,
}: Readonly<{
  // FIX: The type `React.ReactNode` requires `React` to be imported.
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
