"use client";

import * as React from "react";
import {
  BookOpen,
  Scale,
  Search,
  Filter,
  Bookmark,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  History,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DEMO_JUDGMENTS, DEMO_STATUTES } from "@/lib/demo-data";
import { LegalSource } from "@/types";
import { getVerificationBadgeColor } from "@/lib/utils";

export default function AuthoritiesPage() {
  const [activeTab, setActiveTab] = React.useState<"judgments" | "statutes" | "modern_laws">("statutes");
  const [search, setSearch] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState("All");
  const [selectedCourt, setSelectedCourt] = React.useState("All");
  const [copiedCite, setCopiedCite] = React.useState("");

  const copyCitation = (cite: string) => {
    navigator.clipboard.writeText(cite);
    setCopiedCite(cite);
    setTimeout(() => setCopiedCite(""), 2000);
  };

  const filteredJudgments = DEMO_JUDGMENTS.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.citation.toLowerCase().includes(search.toLowerCase()) ||
      j.summary.toLowerCase().includes(search.toLowerCase());
    const matchesCourt = selectedCourt === "All" || j.court.includes(selectedCourt);
    return matchesSearch && matchesCourt;
  });

  const filteredStatutes = DEMO_STATUTES.filter((s) => {
    return (
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.domain.toLowerCase().includes(search.toLowerCase()) ||
      s.summary.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-gold-400" />
              Statutory & Authority Knowledge Base
            </h1>
            <Badge variant="gold">Modern BNS/BNSS/BSA Ready</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Indian statutes, High Court and Supreme Court precedents, and modern vs historical legal cross-references.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 bg-navy-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab("statutes")}
            className={`px-3 py-1.5 rounded transition-all font-medium ${
              activeTab === "statutes"
                ? "bg-gold-500 text-navy-950 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Statutes ({DEMO_STATUTES.length})
          </button>
          <button
            onClick={() => setActiveTab("judgments")}
            className={`px-3 py-1.5 rounded transition-all font-medium ${
              activeTab === "judgments"
                ? "bg-gold-500 text-navy-950 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Judgments ({DEMO_JUDGMENTS.length})
          </button>
          <button
            onClick={() => setActiveTab("modern_laws")}
            className={`px-3 py-1.5 rounded transition-all font-medium ${
              activeTab === "modern_laws"
                ? "bg-gold-500 text-navy-950 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Modern vs Historical Laws
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:w-96">
          <Input
            placeholder="Search statutes, sections, citations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {activeTab === "judgments" && (
          <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
            {["All", "Supreme Court", "Delhi", "Bombay", "Karnataka", "Tribunal"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCourt(c)}
                className={`px-2.5 py-1.5 rounded border transition-all text-xs ${
                  selectedCourt === c
                    ? "bg-gold-500/20 text-gold-300 border-gold-500/40 font-semibold"
                    : "bg-navy-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: STATUTES */}
      {activeTab === "statutes" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredStatutes.map((st) => (
              <Card key={st.id} className="bg-navy-900/80 border-slate-800 space-y-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <Badge variant={st.isModern ? "gold" : "neutral"} className="text-[10px]">
                      {st.isModern ? "Current Law" : "Historical"}
                    </Badge>
                    <h3 className="text-sm font-bold text-white mt-1">{st.title}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {st.actNumber} • Enacted {st.year}
                    </p>
                  </div>
                  <Badge variant="neutral" className="text-[10px] shrink-0 font-mono">
                    {st.domain}
                  </Badge>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{st.summary}</p>

                {st.historicalEquivalent && (
                  <div className="rounded bg-navy-950 p-2 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
                    <History className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                    <span>Replaces historical: <strong className="text-slate-200">{st.historicalEquivalent}</strong></span>
                  </div>
                )}

                {/* Key Sections */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <span className="text-[10px] font-mono uppercase text-gold-400 font-semibold">
                    Key Landmark Sections:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {st.keySections.map((sec, idx) => (
                      <div key={idx} className="p-2 rounded bg-navy-950/80 border border-slate-800/60">
                        <span className="text-gold-400 font-bold font-mono text-[11px] block">
                          {sec.section}
                        </span>
                        <span className="text-slate-200 text-[10px] block font-medium">
                          {sec.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: JUDGMENTS */}
      {activeTab === "judgments" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJudgments.map((j) => (
              <Card key={j.id} hoverEffect className="bg-navy-900/80 border-slate-800 flex flex-col justify-between p-5 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="neutral" className={getVerificationBadgeColor(j.verificationStatus)}>
                      {j.verificationStatus}
                    </Badge>
                    <span className="text-[10px] text-emerald-400 font-medium">{j.precedentStatus}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {j.title}
                  </h3>

                  <p className="text-[11px] font-mono text-gold-400 truncate">{j.citation}</p>

                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {j.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 truncate">{j.court}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px]"
                    onClick={() => copyCitation(j.citation)}
                  >
                    {copiedCite === j.citation ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                    {copiedCite === j.citation ? "Copied" : "Cite"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MODERN VS HISTORICAL LAWS CONVERSION MATRIX */}
      {activeTab === "modern_laws" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Scale className="h-4 w-4 text-gold-400" />
              Modern Criminal Code Conversion Matrix (2023 Sanhitas vs 1860/1973 Acts)
            </CardTitle>
            <CardDescription>
              Architectural mapping between current law and historical legislation. Never silently substitute old law for current law.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-6 text-xs">
            {/* 1. BNS vs IPC */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-gold-400 text-sm">
                  Substantive Criminal Law: BNS 2023 vs IPC 1860
                </h4>
                <Badge variant="gold">Substantive Code</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded p-3 bg-navy-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white block">Current: Bharatiya Nyaya Sanhita, 2023</span>
                  <p className="text-slate-300">• Section 103 (Murder)</p>
                  <p className="text-slate-300">• Section 111 (Organized Crime Syndicates - New Provision)</p>
                  <p className="text-slate-300">• Section 316 (Criminal Breach of Trust)</p>
                  <p className="text-slate-300">• Section 318 (Cheating & Dishonest Inducement)</p>
                </div>

                <div className="rounded p-3 bg-navy-950/50 border border-slate-800 space-y-1.5 text-slate-400">
                  <span className="font-bold text-slate-300 block">Historical: Indian Penal Code, 1860 (Repealed)</span>
                  <p>• Formerly Section 302 IPC</p>
                  <p>• Formerly prosecuted under special state enactments (MCOCA etc.)</p>
                  <p>• Formerly Section 405/406 IPC</p>
                  <p>• Formerly Section 415/420 IPC</p>
                </div>
              </div>
            </div>

            {/* 2. BNSS vs CrPC */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-gold-400 text-sm">
                  Procedural Criminal Law: BNSS 2023 vs CrPC 1973
                </h4>
                <Badge variant="gold">Procedural Code</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded p-3 bg-navy-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white block">Current: Bharatiya Nagarik Suraksha Sanhita, 2023</span>
                  <p className="text-slate-300">• Section 35 (Arrest safeguards & mandatory notice)</p>
                  <p className="text-slate-300">• Section 173 (Electronic FIR & Zero FIR statutory right)</p>
                  <p className="text-slate-300">• Section 187 (Police and judicial remand custody)</p>
                  <p className="text-slate-300">• Section 480 & 482 (Bail in non-bailable matters & High Court bail)</p>
                </div>

                <div className="rounded p-3 bg-navy-950/50 border border-slate-800 space-y-1.5 text-slate-400">
                  <span className="font-bold text-slate-300 block">Historical: Code of Criminal Procedure, 1973 (Repealed)</span>
                  <p>• Formerly Section 41 / 41A CrPC (Arnesh Kumar guidelines)</p>
                  <p>• Formerly Section 154 CrPC</p>
                  <p>• Formerly Section 167 CrPC (15-day initial custody)</p>
                  <p>• Formerly Section 437 & 439 CrPC</p>
                </div>
              </div>
            </div>

            {/* 3. BSA vs IEA */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-gold-400 text-sm">
                  Law of Evidence: BSA 2023 vs IEA 1872
                </h4>
                <Badge variant="gold">Evidentiary Code</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded p-3 bg-navy-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-white block">Current: Bharatiya Sakshya Adhiniyam, 2023</span>
                  <p className="text-slate-300">• Section 61 (Admissibility of electronic records)</p>
                  <p className="text-slate-300">• Section 63 (Digital certificates and cryptographic hash validation)</p>
                </div>

                <div className="rounded p-3 bg-navy-950/50 border border-slate-800 space-y-1.5 text-slate-400">
                  <span className="font-bold text-slate-300 block">Historical: Indian Evidence Act, 1872 (Repealed)</span>
                  <p>• Formerly Section 65B(4) IEA (Anvar P.V. & Arjun Panditrao)</p>
                  <p>• Formerly Section 65A/65B certificate procedures</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
