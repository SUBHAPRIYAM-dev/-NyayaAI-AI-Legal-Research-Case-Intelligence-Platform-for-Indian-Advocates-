"use client";

import * as React from "react";
import {
  Search,
  Bell,
  Sparkles,
  Info,
  ShieldCheck,
  Moon,
  Sun,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onOpenCommandPalette?: () => void;
  queriesUsed?: number;
  queriesLimit?: number;
  isRealGemini?: boolean;
}

export function TopBar({
  onOpenCommandPalette,
  queriesUsed = 142,
  queriesLimit = 2000,
  isRealGemini = false
}: TopBarProps) {
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-navy-950/90 px-4 backdrop-blur-md">
      {/* Left: Quick Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex h-9 w-64 md:w-80 items-center justify-between rounded-md border border-slate-800 bg-navy-900/90 px-3 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all shadow-inner"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-gold-400" />
            <span>Search cases, judgments, statutes...</span>
          </div>
          <kbd className="rounded border border-slate-700 bg-navy-950 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Compulsory Legal Safety Banner */}
        <Badge variant="gold" className="hidden lg:inline-flex text-[11px] py-1 px-2.5 font-medium tracking-wide">
          <Info className="h-3 w-3 mr-1" />
          FICTIONAL DEMONSTRATION DATA
        </Badge>
      </div>

      {/* Right: Status Indicators & Actions */}
      <div className="flex items-center gap-3">
        {/* AI Engine Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-800 bg-navy-900/60 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-gold-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-300">
            {isRealGemini ? "Gemini 1.5 Flash" : "Demo AI Engine"}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* AI Usage Quota Gauge */}
        <div className="hidden md:flex flex-col items-end text-[11px]">
          <div className="flex items-center gap-1">
            <span className="text-slate-400">AI Quota:</span>
            <span className="font-mono text-gold-400 font-medium">
              {queriesUsed}/{queriesLimit}
            </span>
          </div>
          <div className="w-24 h-1.5 bg-navy-800 rounded-full overflow-hidden mt-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-gold-500 to-amber-400"
              style={{ width: `${Math.min(100, (queriesUsed / queriesLimit) * 100)}%` }}
            />
          </div>
        </div>

        {/* Notifications Popover Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-800 bg-navy-900 text-slate-400 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-gold-400" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-slate-800 bg-navy-900 p-3 shadow-xl z-50 text-xs animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-gold-400">3 New</span>
              </div>
              <div className="space-y-2.5">
                <div className="rounded p-2 bg-navy-950/60 border border-slate-800/80">
                  <p className="font-medium text-slate-200">Hearing Scheduled</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Apex Mercantile v. UT Indica set for 24 Sep in Delhi HC.</p>
                </div>
                <div className="rounded p-2 bg-navy-950/60 border border-slate-800/80">
                  <p className="font-medium text-slate-200">Citation Verified</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">2024 SCC OnLine SC 892 matched with Good Law status.</p>
                </div>
                <div className="rounded p-2 bg-navy-950/60 border border-slate-800/80">
                  <p className="font-medium text-slate-200">Document Indexed</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Commercial_Concession_Agreement_2022.pdf analyzed successfully.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
