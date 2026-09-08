"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Scale,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
  Briefcase,
  PenTool,
  Bookmark,
  Share2,
  ChevronRight,
  AlertCircle,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Send,
  Paperclip,
  Check,
  ShieldAlert,
  SlidersHorizontal,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DEMO_RESEARCH_SESSIONS,
  DEMO_JUDGMENTS,
  DEMO_STATUTES
} from "@/lib/demo-data";
import {
  ResearchSession,
  StructuredResearchResponse,
  LegalSource,
  VerificationStatus
} from "@/types";
import { getVerificationBadgeColor, formatDate } from "@/lib/utils";

const RESEARCH_STAGES = [
  "Understanding legal question",
  "Identifying jurisdiction",
  "Identifying legal domain",
  "Searching statutes",
  "Searching authorities",
  "Comparing authorities",
  "Verifying citations",
  "Preparing response",
];

export default function ResearchPage() {
  const router = useRouter();
  const [sessions, setSessions] = React.useState<ResearchSession[]>(DEMO_RESEARCH_SESSIONS);
  const [activeSession, setActiveSession] = React.useState<ResearchSession>(DEMO_RESEARCH_SESSIONS[0]);
  const [inputQuery, setInputQuery] = React.useState("");
  const [isResearching, setIsResearching] = React.useState(false);
  const [currentStageIdx, setCurrentStageIdx] = React.useState(-1);
  const [copied, setCopied] = React.useState(false);
  const [selectedSource, setSelectedSource] = React.useState<LegalSource | null>(null);

  const activeMessage = activeSession.messages.find((m) => m.sender === "ai") || activeSession.messages[0];
  const structuredRes = activeMessage?.structuredResponse;

  const handleStartNewResearch = () => {
    const newSession: ResearchSession = {
      id: `res-${Date.now()}`,
      organizationId: "org-demo-firm-01",
      userId: "user-advocate-01",
      title: "New Legal Inquiry",
      previewQuery: "",
      legalArea: "General Indian Law",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      sources: [],
    };
    setSessions([newSession, ...sessions]);
    setActiveSession(newSession);
    setInputQuery("");
  };

  const handleExecuteQuery = async (queryText: string) => {
    const query = queryText || inputQuery;
    if (!query.trim()) return;

    setIsResearching(true);
    setCurrentStageIdx(0);

    // Simulate animated progress stages sequentially
    for (let i = 0; i < RESEARCH_STAGES.length; i++) {
      setCurrentStageIdx(i);
      await new Promise((res) => setTimeout(res, 220));
    }

    try {
      const res = await fetch("/api/research/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          sessionId: activeSession.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Research execution failed");

      if (data.session) {
        setActiveSession(data.session);
        setSessions((prev) =>
          prev.map((s) => (s.id === data.session.id ? data.session : s))
        );
      }
      setInputQuery("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsResearching(false);
      setCurrentStageIdx(-1);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsText = () => {
    if (!structuredRes) return;
    const content = `
NYAYAAI LEGAL RESEARCH MEMORANDUM (DEMO)
============================================================
LEGAL ISSUE:
${structuredRes.legalIssue}

SHORT ANSWER:
${structuredRes.shortAnswer}

APPLICABLE LAW:
${structuredRes.applicableLaw.map((l) => "- " + l).join("\n")}

RELEVANT AUTHORITIES:
${structuredRes.authorities.map((a) => "- " + a).join("\n")}

ANALYSIS:
${structuredRes.analysis}

PRACTICAL CONSIDERATIONS:
${structuredRes.practicalConsiderations.map((p) => "- " + p).join("\n")}

DISCLAIMER:
${structuredRes.disclaimer}
============================================================
`.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NyayaAI_Research_${activeSession.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full overflow-hidden bg-navy-950 text-slate-100">
      {/* ============================================================ */}
      {/* 1. LEFT COLUMN: RESEARCH HISTORY & SESSIONS */}
      {/* ============================================================ */}
      <div className="w-72 border-r border-slate-800 bg-navy-950/80 flex flex-col shrink-0 hidden md:flex">
        <div className="p-3 border-b border-slate-800">
          <Button
            variant="gold"
            size="sm"
            onClick={handleStartNewResearch}
            className="w-full justify-center text-xs font-semibold"
          >
            <Search className="h-3.5 w-3.5 mr-1.5" />
            New Research Session
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <span className="text-[10px] font-semibold uppercase text-slate-400 px-2 py-1 block tracking-wider">
            Chambers Inquiries ({sessions.length})
          </span>
          {sessions.map((s) => {
            const isSelected = s.id === activeSession.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSession(s)}
                className={`w-full rounded-lg p-2.5 text-left text-xs transition-all flex flex-col gap-1 border ${
                  isSelected
                    ? "bg-gold-500/10 border-gold-500/40 text-gold-200"
                    : "border-transparent text-slate-300 hover:bg-navy-900/60 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate pr-1">{s.title}</span>
                  {s.isSaved && (
                    <Bookmark className="h-3 w-3 text-gold-400 shrink-0 fill-gold-400/30" />
                  )}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="truncate">{s.legalArea}</span>
                  <span>{formatDate(s.createdAt)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. CENTER COLUMN: AI CONVERSATION & RESEARCH MEMORANDUM */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col overflow-hidden bg-navy-900/40">
        {/* Research Title Header */}
        <div className="flex h-12 items-center justify-between border-b border-slate-800 bg-navy-950/60 px-5">
          <div className="flex items-center gap-2 truncate">
            <Scale className="h-4 w-4 text-gold-400 shrink-0" />
            <span className="text-xs font-semibold text-white truncate">
              {activeSession.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="gold" className="text-[10px]">
              {structuredRes?.verificationStatus || "VERIFIED"}
            </Badge>
            <button
              onClick={exportAsText}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              title="Export as text"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Results Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Ongoing Research Multi-Stage Progress Animation */}
          {isResearching && (
            <Card className="border-gold-500/40 bg-gold-500/5 p-5">
              <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold mb-3">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>AI Legal Orchestration in Progress...</span>
              </div>
              <div className="space-y-1.5">
                {RESEARCH_STAGES.map((stage, idx) => {
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

          {/* Structured Research Response */}
          {!isResearching && structuredRes && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Mandatory Legal Safety Watermark */}
              <div className="rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 flex items-start gap-2.5 text-xs text-gold-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-gold-400 mt-0.5" />
                <p className="leading-relaxed">
                  {structuredRes.disclaimer}
                </p>
              </div>

              {/* 1. Legal Issue */}
              <div className="space-y-1 border-l-2 border-gold-500 pl-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold">
                  LEGAL ISSUE
                </span>
                <h2 className="text-base font-bold text-white leading-snug">
                  {structuredRes.legalIssue}
                </h2>
              </div>

              {/* 2. Short Answer */}
              <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  SHORT ANSWER
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {structuredRes.shortAnswer}
                </p>
              </div>

              {/* 3. Applicable Law & Authorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 bg-navy-950/60 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> APPLICABLE STATUTORY LAW
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {structuredRes.applicableLaw.map((law, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-gold-400 font-bold">•</span>
                        <span>{law}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-800 bg-navy-950/60 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold flex items-center gap-1.5">
                    <Scale className="h-3.5 w-3.5" /> RELEVANT PRECEDENTS
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {structuredRes.authorities.map((auth, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span className="font-mono text-[11px]">{auth}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. Detailed Legal Analysis */}
              <div className="rounded-lg border border-slate-800 bg-navy-950 p-5 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold">
                  JURIDICAL ANALYSIS & SYNTHESIS
                </span>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                  {structuredRes.analysis}
                </p>
              </div>

              {/* 5. Supporting vs Contrary Authorities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 bg-emerald-500/5 p-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                    SUPPORTING AUTHORITIES
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {structuredRes.supportingAuthorities.map((sa, i) => (
                      <li key={i} className="text-[11px]">✓ {sa}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-800 bg-amber-500/5 p-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    CONTRARY / DISTINGUISHED AUTHORITIES
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {structuredRes.contraryAuthorities.length > 0 ? (
                      structuredRes.contraryAuthorities.map((ca, i) => (
                        <li key={i} className="text-[11px]">⚠ {ca}</li>
                      ))
                    ) : (
                      <li className="text-[11px] text-slate-500 italic">No contrary landmark authorities identified.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* 6. Practical Considerations & Checklist */}
              <div className="rounded-lg border border-slate-800 bg-navy-950/60 p-4 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-semibold">
                  PRACTICAL LITIGATION CONSIDERATIONS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {structuredRes.practicalConsiderations.map((pc, i) => (
                    <div key={i} className="rounded p-2 bg-navy-900 border border-slate-800 text-xs text-slate-300">
                      <span className="text-gold-400 font-bold mr-1.5">[{i + 1}]</span>
                      {pc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => copyToClipboard(structuredRes.analysis)}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? "Copied" : "Copy Brief"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs" onClick={exportAsText}>
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Export (.TXT)
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs"
                    onClick={() => router.push("/cases")}
                  >
                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                    Create Case
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    className="text-xs"
                    onClick={() => router.push("/drafting")}
                  >
                    <PenTool className="h-3.5 w-3.5 mr-1" />
                    Prepare Draft
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Query Composer Bar */}
        <div className="border-t border-slate-800 bg-navy-950 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteQuery(inputQuery);
            }}
            className="flex flex-col gap-2 max-w-4xl mx-auto"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask a legal question or paste fact pattern (e.g. 'Analyze bail standards under BNSS 482')..."
                className="w-full rounded-lg border border-slate-800 bg-navy-900 py-3 pl-4 pr-24 text-xs text-white placeholder:text-slate-500 focus:border-gold-500/80 focus:outline-none focus:ring-1 focus:ring-gold-500/80 transition-all shadow-inner"
                disabled={isResearching}
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <Button
                  type="submit"
                  variant="gold"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  disabled={isResearching || !inputQuery.trim()}
                >
                  <Send className="h-3.5 w-3.5 mr-1" /> Research
                </Button>
              </div>
            </div>

            {/* Suggested Starter Prompts */}
            <div className="flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400 pt-1">
              <span className="font-semibold text-slate-500 shrink-0">Try:</span>
              {[
                "Bail criteria under BNSS for financial fraud",
                "Unilateral arbitrator appointment under Section 12(5)",
                "BSA Section 61 electronic evidence hash validation",
                "Section 12A Commercial Courts Act mediation",
              ].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    setInputQuery(p);
                    handleExecuteQuery(p);
                  }}
                  className="rounded-full border border-slate-800 bg-navy-900/60 px-2.5 py-0.5 whitespace-nowrap hover:border-gold-500/40 hover:text-gold-300 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. RIGHT COLUMN: SOURCES & AUTHORITIES PANEL */}
      {/* ============================================================ */}
      <div className="w-80 border-l border-slate-800 bg-navy-950/80 flex flex-col shrink-0 hidden lg:flex">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-gold-400" />
            <span className="text-xs font-bold text-white">Retrieved Sources</span>
          </div>
          <Badge variant="gold" className="text-[9px]">
            {activeSession.sources?.length || 0} Authorities
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeSession.sources && activeSession.sources.length > 0 ? (
            activeSession.sources.map((src) => (
              <div
                key={src.id}
                onClick={() => setSelectedSource(src)}
                className={`rounded-lg border p-3 cursor-pointer transition-all space-y-1.5 ${
                  selectedSource?.id === src.id
                    ? "border-gold-500 bg-gold-500/10"
                    : "border-slate-800 bg-navy-900/60 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge
                    variant="neutral"
                    className={`text-[9px] py-0 px-1 font-mono ${getVerificationBadgeColor(
                      src.verificationStatus
                    )}`}
                  >
                    {src.verificationStatus}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-mono">{src.year}</span>
                </div>

                <h4 className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                  {src.title}
                </h4>

                <div className="text-[11px] font-mono text-gold-400 truncate">
                  {src.citation}
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span className="truncate">{src.court}</span>
                  <span className="text-emerald-400 font-medium shrink-0 ml-1">
                    {src.precedentStatus}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-slate-500">
              No sources loaded for this session.
            </div>
          )}
        </div>

        {/* Selected Source Drawer Footer */}
        {selectedSource && (
          <div className="p-3 border-t border-slate-800 bg-navy-900 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white truncate">Authority Details</span>
              <button
                onClick={() => setSelectedSource(null)}
                className="text-slate-400 hover:text-white text-[10px]"
              >
                Close
              </button>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
              {selectedSource.summary}
            </p>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-[10px] h-7"
                onClick={() => copyToClipboard(selectedSource.citation)}
              >
                Copy Citation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
