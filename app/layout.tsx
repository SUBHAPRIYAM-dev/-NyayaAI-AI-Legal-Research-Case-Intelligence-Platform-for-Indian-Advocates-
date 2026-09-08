import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayaAI — AI-Powered Indian Legal Intelligence Platform",
  description:
    "The AI Legal Research Engine Built for India. Research Indian law, analyze judgments, verify citations, manage cases, and prepare legal drafts from one intelligent workspace.",
  keywords: [
    "Legal AI India",
    "Indian Legal Research",
    "BNS 2023",
    "BNSS 2023",
    "BSA 2023",
    "Supreme Court Judgments",
    "Citation Verification",
    "Legal Drafting",
  ],
  authors: [{ name: "NyayaAI Engineering" }],
  openGraph: {
    title: "NyayaAI — AI Legal Intelligence for India",
    description:
      "Enterprise legal intelligence platform for Advocates, Law Firms, and Corporate Counsel across India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-navy-950 text-slate-100 antialiased selection:bg-gold-500/20 selection:text-gold-300">
        {children}
      </body>
    </html>
  );
}
