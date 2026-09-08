"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Scale,
  Briefcase,
  FileText,
  BookOpen,
  PenTool,
  CheckCircle2,
  X
} from "lucide-react";
import { DEMO_CASES, DEMO_JUDGMENTS, DEMO_STATUTES } from "@/lib/demo-data";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCases = DEMO_CASES.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.caseNumber.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 4);

  const filteredJudgments = DEMO_JUDGMENTS.filter((j) =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.citation.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 4);

  const filteredStatutes = DEMO_STATUTES.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.domain.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 3);

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl border border-slate-700/80 bg-navy-900 shadow-2xl overflow-hidden">
        {/* Input Bar */}
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-4 w-4 text-gold-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command, case name, citation or statute..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          {!search && (
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
                Quick Actions
              </span>
              <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                <button
                  onClick={() => handleNavigate("/research")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-navy-800 text-slate-200 transition-colors text-left"
                >
                  <Search className="h-3.5 w-3.5 text-gold-400" />
                  <span>Start New Legal Research</span>
                </button>
                <button
                  onClick={() => handleNavigate("/citation-checker")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-navy-800 text-slate-200 transition-colors text-left"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Verify Citation</span>
                </button>
                <button
                  onClick={() => handleNavigate("/cases")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-navy-800 text-slate-200 transition-colors text-left"
                >
                  <Briefcase className="h-3.5 w-3.5 text-blue-400" />
                  <span>Browse Active Cases</span>
                </button>
                <button
                  onClick={() => handleNavigate("/drafting")}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-navy-800 text-slate-200 transition-colors text-left"
                >
                  <PenTool className="h-3.5 w-3.5 text-amber-400" />
                  <span>Generate Legal Draft</span>
                </button>
              </div>
            </div>
          )}

          {/* Cases */}
          {filteredCases.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
                Cases
              </span>
              <div className="space-y-1 mt-1">
                {filteredCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleNavigate(`/cases/${c.id}`)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-navy-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Briefcase className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                      <span className="text-white truncate">{c.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">{c.caseNumber}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Judgments */}
          {filteredJudgments.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
                Fictional Judgments
              </span>
              <div className="space-y-1 mt-1">
                {filteredJudgments.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => handleNavigate(`/authorities?search=${encodeURIComponent(j.citation)}`)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-navy-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Scale className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="text-white truncate">{j.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">{j.citation}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Statutes */}
          {filteredStatutes.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 tracking-wider">
                Statutes & Codes
              </span>
              <div className="space-y-1 mt-1">
                {filteredStatutes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleNavigate(`/authorities?tab=statutes&search=${encodeURIComponent(s.title)}`)}
                    className="w-full flex items-center justify-between p-2 rounded-md hover:bg-navy-800 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookOpen className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                      <span className="text-white truncate">{s.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{s.domain}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 bg-navy-950 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or arrow keys</span>
          <span className="font-mono">ESC to close</span>
        </div>
      </div>
    </div>
  );
}
