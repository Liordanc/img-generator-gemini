import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
    <html lang="he">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
