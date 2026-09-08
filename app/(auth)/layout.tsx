import * as React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-navy-950 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="p-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-md">
            <Scale className="h-5 w-5 stroke-[2.5]" />
          </div>
          <span className="text-lg font-bold tracking-wider text-white">
            NYAYA<span className="text-gold-400">AI</span>
          </span>
        </Link>

        <span className="text-xs text-slate-400 font-mono hidden sm:inline-block">
          Enterprise Legal Intelligence • India
        </span>
      </header>

      {/* Content Container */}
      <main className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-400 z-10 border-t border-slate-850">
        <p className="max-w-xl mx-auto leading-relaxed">
          NyayaAI is an AI-assisted legal intelligence prototype. All legal authorities displayed are Fictional Demonstration Records. Never substitute for independent legal counsel.
        </p>
      </footer>
    </div>
  );
}
