"use client";

import * as React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Scale,
  Sparkles,
  Info,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getVerificationBadgeColor } from "@/lib/utils";

interface VerificationResult {
  citation: string;
  caseName: string;
  court: string;
  year: string;
  proposition: string;
  status: "VERIFIED" | "PARTIALLY VERIFIED" | "UNVERIFIED" | "POTENTIALLY INCORRECT" | "DEMO";
  matchedSource?: {
    title: string;
    court: string;
    date: string;
    citation: string;
    precedentStatus: string;
    summary: string;
  };
  notes: string;
  details: string;
  disclaimer: string;
}

const CITATION_STAGES = [
  "Checking case name & parties",
  "Checking reporter citation format",
  "Checking court jurisdiction & bench",
  "Checking judgment date & year",
  "Checking legal proposition alignment",
];

export default function CitationCheckerPage() {
  const [caseName, setCaseName] = React.useState("Virendra K. Singhania v. Directorate of Financial Enforcement");
  const [citation, setCitation] = React.useState("2024 SCC OnLine SC 892");
  const [court, setCourt] = React.useState("Supreme Court of India");
  const [year, setYear] = React.useState("2024");
  const [proposition, setProposition] = React.useState(
    "Prolonged pre-trial detention dilutes statutory twin conditions of bail under Article 21."
  );

  const [isVerifying, setIsVerifying] = React.useState(false);
  const [currentStageIdx, setCurrentStageIdx] = React.useState(-1);
  const [result, setResult] = React.useState<VerificationResult | null>(null);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setCurrentStageIdx(0);
    setResult(null);

    for (let i = 0; i < CITATION_STAGES.length; i++) {
      setCurrentStageIdx(i);
      await new Promise((r) => setTimeout(r, 200));
    }

    try {
      const res = await fetch("/api/citations/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseName,
          citation,
          court,
          year,
          proposition,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      setResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
      setCurrentStageIdx(-1);
    }
  };

  const loadPreset = (preset: {
    name: string;
    cite: string;
    court: string;
    year: string;
    prop: string;
  }) => {
    setCaseName(preset.name);
    setCitation(preset.cite);
    setCourt(preset.court);
    setYear(preset.year);
    setProposition(preset.prop);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              Precedent & Citation Verifier
            </h1>
            <Badge variant="gold">Deterministic Mode</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Prevent hallucinated or overruled authorities in your court submissions. Cross-referenced against official law reports.
          </p>
        </div>

        {/* Quick Test Presets */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Quick Test:</span>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() =>
              loadPreset({
                name: "Apex Mercantile Infra v. UT of Indica",
                cite: "2025 SCC OnLine SC 401",
                court: "Supreme Court of India",
                year: "2025",
                prop: "Blacklisting without specific show cause notice is void under Article 14.",
              })
            }
          >
            Verified SC Case
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2 border-rose-500/40 text-rose-300"
            onClick={() =>
              loadPreset({
                name: "Imaginary Corporation v. State of Nowhere",
                cite: "2023 SCC 99999",
                court: "Supreme Court of India",
                year: "2023",
                prop: "Commercial contracts cannot be modified by statute.",
              })
            }
          >
            Fake Citation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Form */}
        <Card className="lg:col-span-1 bg-navy-900/80 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Authority Parameters</CardTitle>
            <CardDescription>Enter citation or legal proposition details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Case Name / Title</label>
                <Input
                  value={caseName}
                  onChange={(e) => setCaseName(e.target.value)}
                  placeholder="e.g. Singhania v. SFIO"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300">Official Citation</label>
                <Input
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="e.g. 2024 SCC OnLine SC 892"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Court</label>
                  <Input
                    value={court}
                    onChange={(e) => setCourt(e.target.value)}
                    placeholder="Supreme Court"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Year</label>
                  <Input
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2024"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300">Legal Proposition / Ratio</label>
                <textarea
                  rows={3}
                  value={proposition}
                  onChange={(e) => setProposition(e.target.value)}
                  placeholder="The specific legal proposition you wish to verify..."
                  className="w-full rounded-md border border-slate-800 bg-navy-900 p-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                size="sm"
                className="w-full mt-2"
                isLoading={isVerifying}
              >
                Run Verification Check <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress Stage Pipeline */}
          {isVerifying && (
            <Card className="border-gold-500/40 bg-gold-500/5 p-5">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold mb-3">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Verification Pipeline Active...</span>
              </div>
              <div className="space-y-2">
                {CITATION_STAGES.map((stage, idx) => {
                  const isDone = currentStageIdx > idx;
                  const isCurrent = currentStageIdx === idx;
                  return (
                    <div
                      key={stage}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        isDone
                          ? "text-emerald-400"
                          : isCurrent
                          ? "text-gold-300 font-semibold"
                          : "text-slate-600"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <div className="h-2 w-2 rounded-full bg-gold-400 animate-ping mr-1.5" />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-700 mr-1.5" />
                      )}
                      <span>{stage}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Results Card */}
          {!isVerifying && result && (
            <Card className="bg-navy-900/90 border-slate-800 shadow-xl overflow-hidden">
              <div
                className={`p-4 border-b flex items-center justify-between ${
                  result.status === "VERIFIED"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  {result.status === "VERIFIED" ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-400" />
                  )}
                  <div>
                    <h3 className="text-sm font-bold tracking-wide">
                      VERIFICATION RESULT: {result.status}
                    </h3>
                    <p className="text-[11px] opacity-80">{result.notes}</p>
                  </div>
                </div>

                <Badge
                  variant="neutral"
                  className={getVerificationBadgeColor(result.status)}
                >
                  {result.status}
                </Badge>
              </div>

              <CardContent className="p-5 space-y-4 text-xs">
                {/* Mandatory Fictional Demonstration Watermark */}
                <div className="rounded border border-gold-500/30 bg-gold-500/10 p-2.5 text-[11px] text-gold-300 flex items-center gap-2">
                  <Info className="h-4 w-4 shrink-0 text-gold-400" />
                  <span>
                    FICTIONAL DEMONSTRATION DATA — Grounded in NyayaAI Precedent Registry. Never assert unverified AI output in actual court proceedings.
                  </span>
                </div>

                {result.matchedSource ? (
                  <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white text-sm">
                          {result.matchedSource.title}
                        </h4>
                        <p className="text-gold-400 font-mono text-xs mt-0.5">
                          {result.matchedSource.citation}
                        </p>
                      </div>
                      <Badge variant="verified">
                        {result.matchedSource.precedentStatus}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      <div>Court: <span className="text-slate-200">{result.matchedSource.court}</span></div>
                      <div>Date: <span className="text-slate-200">{result.matchedSource.date}</span></div>
                    </div>

                    <div className="text-slate-300 text-xs leading-relaxed pt-1 border-t border-slate-800">
                      <span className="text-gold-400 font-medium block mb-1">Judicial Summary & Ratio:</span>
                      {result.matchedSource.summary}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 text-rose-300 space-y-2">
                    <h4 className="font-semibold text-sm flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4 text-rose-400" /> Authority Not Found
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {result.details}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Recommendation: Always verify non-standard citations against original High Court / Supreme Court law reporters (SCC, SCR, AIR) before drafting pleadings.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Default Empty State */}
          {!isVerifying && !result && (
            <div className="rounded-xl border border-dashed border-slate-800 bg-navy-900/40 p-12 text-center text-xs text-slate-400 space-y-2">
              <FileCheck className="h-8 w-8 text-gold-400 mx-auto opacity-60" />
              <h4 className="font-semibold text-white">No Verification Run Yet</h4>
              <p className="max-w-sm mx-auto text-slate-500">
                Enter citation parameters or select a quick test preset above to trigger the precedent verification pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
