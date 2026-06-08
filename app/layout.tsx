import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "distill — AI document summarizer",
    template: "%s — distill",
  },
  description:
    "Production-ready AI SaaS that turns long documents into concise summaries. Open-source boilerplate with Stripe, OpenAI, Prisma, and NextAuth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
