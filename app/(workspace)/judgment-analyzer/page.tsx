"use client";

import * as React from "react";
import {
  FileText,
  Upload,
  Sparkles,
  Scale,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Split,
  Copy,
  Download,
  AlertCircle,
  HelpCircle,
  Briefcase,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_JUDGMENTS } from "@/lib/demo-data";
import { JudgmentAnalysis } from "@/types";

const PIPELINE_STAGES = [
  "Uploading judgment coordinate file",
  "Extracting judicial text & paragraph tokens",
  "Isolating procedural history & factual matrix",
  "Extracting Ratio Decidendi & Obiter Dicta",
  "Synthesizing Chambers Case Brief",
];

export default function JudgmentAnalyzerPage() {
  const [selectedPreset, setSelectedPreset] = React.useState(DEMO_JUDGMENTS[0]);
  const [inputText, setInputText] = React.useState("");
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [pipelineIdx, setPipelineIdx] = React.useState(-1);
  const [analysis, setAnalysis] = React.useState<JudgmentAnalysis | null>(null);
  const [activeTab, setActiveTab] = React.useState<"ratio" | "facts" | "arguments" | "statutes">("ratio");
  const [explanationMode, setExplanationMode] = React.useState<"advocate" | "junior">("advocate");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Initial run on mount with first demo judgment
    handleRunAnalysis(selectedPreset.title, selectedPreset.summary);
  }, []);

  const handleRunAnalysis = async (title: string, text: string) => {
    setIsAnalyzing(true);
    setPipelineIdx(0);
    setAnalysis(null);

    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      setPipelineIdx(i);
      await new Promise((r) => setTimeout(r, 180));
    }

    try {
      const res = await fetch("/api/judgments/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text, mode: explanationMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      setPipelineIdx(-1);
    }
  };

  const copyBrief = () => {
    if (!analysis) return;
    const briefText = `
NYAYAAI CASE BRIEF: ${analysis.judgmentTitle}
CITATION: ${analysis.citation} | COURT: ${analysis.court} | DATE: ${analysis.date}
============================================================
RATIO DECIDENDI:
${analysis.ratioDecidendi}

OBITER DICTA:
${analysis.obiterDicta.join("\n- ")}

FACTUAL SUMMARY:
${analysis.factualSummary}

PRACTICAL LITIGATION TAKEAWAY:
${analysis.practicalTakeaway}
============================================================
[FICTIONAL DEMONSTRATION DATA — REVIEW BEFORE USE]
    `.trim();
    navigator.clipboard.writeText(briefText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="h-6 w-6 text-gold-400" />
              Judgment Analyzer & Ratio Extractor
            </h1>
            <Badge variant="gold">Case Brief Engine</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Isolate Ratio Decidendi, distill Obiter Dicta, and structure arguments from Indian court orders.
          </p>
        </div>

        {/* Mode Toggle: Senior Advocate vs Junior Advocate */}
        <div className="flex items-center gap-2 bg-navy-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setExplanationMode("advocate")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              explanationMode === "advocate"
                ? "bg-gold-500 text-navy-950 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Chambers Brief
          </button>
          <button
            onClick={() => setExplanationMode("junior")}
            className={`px-3 py-1 rounded text-xs font-medium transition-all ${
              explanationMode === "junior"
                ? "bg-gold-500 text-navy-950 font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Junior Advocate Walkthrough
          </button>
        </div>
      </div>

      {/* Select Judgment Sample or Upload */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Select Landmark Ruling to Analyze:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_JUDGMENTS.slice(0, 3).map((jdg) => (
            <button
              key={jdg.id}
              onClick={() => {
                setSelectedPreset(jdg);
                handleRunAnalysis(jdg.title, jdg.summary);
              }}
              className={`p-3 rounded-lg border text-left transition-all space-y-1 ${
                selectedPreset.id === jdg.id
                  ? "border-gold-500 bg-gold-500/10 shadow-sm"
                  : "border-slate-800 bg-navy-900/60 hover:border-slate-700"
              }`}
            >
              <span className="text-xs font-semibold text-white line-clamp-1 block">
                {jdg.title}
              </span>
              <p className="text-[10px] font-mono text-gold-400 truncate">{jdg.citation}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>{jdg.court}</span>
                <span className="text-emerald-400">{jdg.precedentStatus}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Progress Indicator */}
      {isAnalyzing && (
        <Card className="border-gold-500/40 bg-gold-500/5 p-5">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold mb-3">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Processing Judicial Paragraphs...</span>
          </div>
          <div className="space-y-2 text-xs">
            {PIPELINE_STAGES.map((stg, i) => {
              const isDone = pipelineIdx > i;
              const isCurrent = pipelineIdx === i;
              return (
                <div
                  key={stg}
                  className={`flex items-center gap-2 ${
                    isDone ? "text-emerald-400" : isCurrent ? "text-gold-300 font-semibold" : "text-slate-600"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-700 mr-1.5" />
                  )}
                  <span>{stg}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Structured Analysis Results View */}
      {!isAnalyzing && analysis && (
        <Card className="bg-navy-900/90 border-slate-800 shadow-xl overflow-hidden">
          {/* Header Card */}
          <div className="p-5 border-b border-slate-800 bg-navy-950/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="verified">Ratio Extracted</Badge>
                <span className="text-xs font-mono text-gold-400">{analysis.citation}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-1">{analysis.judgmentTitle}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {analysis.court} • Bench: {analysis.bench} • Date: {analysis.date}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="text-xs h-8" onClick={copyBrief}>
                {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied" : "Copy Brief"}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 px-5 text-xs">
            <button
              onClick={() => setActiveTab("ratio")}
              className={`py-3 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "ratio"
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Ratio Decidendi & Obiter
            </button>
            <button
              onClick={() => setActiveTab("facts")}
              className={`py-3 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "facts"
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Factual Matrix & Issues
            </button>
            <button
              onClick={() => setActiveTab("arguments")}
              className={`py-3 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "arguments"
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Appellant vs Respondent
            </button>
            <button
              onClick={() => setActiveTab("statutes")}
              className={`py-3 px-4 font-medium border-b-2 transition-colors ${
                activeTab === "statutes"
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Statutory Interpretations
            </button>
          </div>

          <CardContent className="p-6 space-y-5 text-xs">
            {/* Tab 1: Ratio & Obiter */}
            {activeTab === "ratio" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-gold-500/40 bg-gold-500/5 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-gold-400 font-bold tracking-wider flex items-center gap-1.5">
                    <Scale className="h-4 w-4" /> BINDING RATIO DECIDENDI (RULE OF LAW)
                  </span>
                  <p className="text-xs text-slate-100 font-medium leading-relaxed">
                    &quot;{analysis.ratioDecidendi}&quot;
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    OBITER DICTA (JUDICIAL OBSERVATIONS)
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {analysis.obiterDicta.map((ob, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gold-400 font-mono">[{idx + 1}]</span>
                        <span className="leading-relaxed">{ob}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-800 bg-navy-950/60 p-4">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider block mb-1">
                    PRACTICAL CHAMBERS TAKEAWAY
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {analysis.practicalTakeaway}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Facts & Issues */}
            {activeTab === "facts" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    CONCISE FACTUAL MATRIX
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {analysis.factualSummary}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-gold-400 font-bold tracking-wider">
                    ISSUES FRAMED BY BENCH
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {analysis.issuesFramed.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gold-400 font-mono">Issue {idx + 1}:</span>
                        <span className="leading-relaxed">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: Arguments */}
            {activeTab === "arguments" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-wider">
                    APPELLANT SUBMISSIONS
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {analysis.argumentsAppellant.map((arg, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-400 font-bold">•</span>
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">
                    RESPONDENT CONTENTIONS
                  </span>
                  <ul className="space-y-2 text-slate-300">
                    {analysis.argumentsRespondent.map((arg, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 4: Statutes */}
            {activeTab === "statutes" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-gold-400 font-bold tracking-wider">
                    STATUTES & CONSTITUTIONAL PROVISIONS INTERPRETED
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.statutesInterpreted.map((st, idx) => (
                      <Badge key={idx} variant="gold" className="text-xs py-1 px-2.5">
                        {st}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold tracking-wider">
                    DISTINGUISHING FEATURES & OVERRULED AUTHORITIES
                  </span>
                  <div className="space-y-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 font-medium">Distinctions:</span>{" "}
                      {analysis.distinguishingFeatures.join(", ") || "None"}
                    </div>
                    <div>
                      <span className="text-rose-400 font-medium">Overruled Precedents:</span>{" "}
                      {analysis.overruledAuthorities.join(", ") || "None"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
