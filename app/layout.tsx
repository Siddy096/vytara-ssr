import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500","700","900"] });

export const metadata = { title: "Vytara", description: "Healthcare, beautifully reimagined." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F8F9FB] text-[#0F172A]`}>
        {children}
      </body>
    </html>
  );
}
