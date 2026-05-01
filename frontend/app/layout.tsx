import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyaySetu — AI Legal Assistant",
  description: "AI-powered Indian legal assistance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#E8EDF5] h-screen overflow-hidden">{children}</body>
    </html>
  );
}