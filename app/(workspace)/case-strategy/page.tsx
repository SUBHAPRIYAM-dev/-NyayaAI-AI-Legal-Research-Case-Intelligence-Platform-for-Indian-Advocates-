"use client";

import * as React from "react";
import {
  BrainCircuit,
  Sparkles,
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function CaseStrategyPage() {
  const [facts, setFacts] = React.useState(
    "Client infrastructure company entered into a 25-year concession agreement with State Public Works Department. Client encountered 8 months delay in obtaining environmental and right-of-way clearances, which were the statutory obligation of the State. State issued a unilateral termination notice without a 30-day cure period and threatens invocation of bank guarantees worth INR 15 Crores."
  );
  const [issues, setIssues] = React.useState(
    "Whether State's termination without cure period is arbitrary under Article 14, and whether High Court can grant interim injunction restraining invocation of bank guarantees under Section 9 of Arbitration Act."
  );
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [strategyReady, setStrategyReady] = React.useState(true);

  const handleGenerateStrategy = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStrategyReady(true);
    }, 700);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-gold-400" />
              Litigation Strategy & Risk Matrix
            </h1>
            <Badge variant="gold">Non-Guaranteed Analysis</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formulate arguments, anticipate opposing contentions, uncover evidentiary gaps, and evaluate procedural hurdles.
          </p>
        </div>
      </div>

      {/* Inputs Card */}
      <Card className="bg-navy-900/80 border-slate-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Matter Facts & Legal Contention Inputs</CardTitle>
          <CardDescription>
            Input underlying transactional facts and disputed issues to generate strategic counsel assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-slate-300">Underlying Factual Matrix</label>
            <textarea
              rows={3}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              className="w-full rounded-md border border-slate-800 bg-navy-950 p-2.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-slate-300">Core Legal Issues & Relief Desired</label>
            <Input
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              className="bg-navy-950"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              variant="gold"
              size="sm"
              className="text-xs"
              onClick={handleGenerateStrategy}
              isLoading={isGenerating}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Compute Strategic Assessment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategic Output Matrix */}
      {strategyReady && (
        <div className="space-y-5 text-xs animate-in fade-in">
          {/* Mandatory Guardrail Banner */}
          <div className="rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 text-xs text-gold-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-gold-400 mt-0.5" />
            <p className="leading-relaxed">
              NyayaAI provides strategic assistance only. Outcomes cannot be guaranteed. Statements below represent &quot;potential arguments&quot; and &quot;possible judicial interpretations&quot; requiring independent professional legal review.
            </p>
          </div>

          {/* 1. Strengths vs Weaknesses Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <Card className="bg-navy-900/80 border-emerald-500/30">
              <CardHeader className="pb-2 bg-emerald-500/5 border-b border-emerald-500/20">
                <CardTitle className="text-xs text-emerald-400 flex items-center gap-1.5 font-mono uppercase">
                  <CheckCircle2 className="h-4 w-4" /> Potential Strategic Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-slate-300">
                <div className="space-y-1">
                  <span className="font-semibold text-white">1. Breach of Pre-Condition by State:</span>
                  <p className="text-[11px] text-slate-400">
                    State’s failure to provide encumbrance-free right of way qualifies as a fundamental breach under Indian Contract Act Section 53.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white">2. Article 14 Natural Justice Defect:</span>
                  <p className="text-[11px] text-slate-400">
                    Summary termination without a 30-day cure notice conflicts with settled administrative law principles in infrastructure concessions.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white">3. Exceptional Circumstances for Bank Guarantee:</span>
                  <p className="text-[11px] text-slate-400">
                    Irretrievable injustice can be established if encashment leads to immediate insolvency of concessionaire.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Weaknesses & Vulnerabilities */}
            <Card className="bg-navy-900/80 border-amber-500/30">
              <CardHeader className="pb-2 bg-amber-500/5 border-b border-amber-500/20">
                <CardTitle className="text-xs text-amber-400 flex items-center gap-1.5 font-mono uppercase">
                  <AlertTriangle className="h-4 w-4" /> Strategic Weaknesses & Obstacles
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-slate-300">
                <div className="space-y-1">
                  <span className="font-semibold text-white">1. High Legal Bar for Injunction on Bank Guarantees:</span>
                  <p className="text-[11px] text-slate-400">
                    Settled law holds unconditional bank guarantees independent of underlying contract dispute, except in cases of egregious fraud.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-white">2. Alternative Remedy Objection:</span>
                  <p className="text-[11px] text-slate-400">
                    High Court may decline Article 226 writ relief on grounds of an existing institutional arbitration clause in the concession agreement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 2. Arguments & Anticipated Counterarguments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-navy-900/80 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-blue-400 font-mono uppercase">
                  Primary Arguments for Client
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-slate-300">
                <p>
                  • <strong>Argument 1:</strong> Reciprocal promises under Section 51-54 Indian Contract Act: party seeking performance must first perform its condition precedent.
                </p>
                <p>
                  • <strong>Argument 2:</strong> Proportionality doctrine: termination for delay caused by administrative inaction is disproportionately punitive.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-navy-900/80 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-rose-400 font-mono uppercase">
                  Anticipated Opposing Contentions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-slate-300">
                <p>
                  • <strong>Counter 1:</strong> Concessionaire assumed site risks under Clause 4.1 (&quot;as-is-where-is basis&quot;).
                </p>
                <p>
                  • <strong>Counter 2:</strong> Bank guarantee is an autonomous undertaking between issuing bank and beneficiary.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 3. Evidentiary Gaps & Action Checklist */}
          <Card className="bg-navy-900/80 border-slate-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs text-gold-400 font-mono uppercase">
                Evidentiary Gaps to Secure Before Filing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-white block">1. Chain of Delay Notices</span>
                  <p className="text-[11px] text-slate-400">
                    Ensure written contemporaneous letters sent to State detailing site access hurdles are annexed with delivery receipts.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-white block">2. BSA Digital Certificate</span>
                  <p className="text-[11px] text-slate-400">
                    Prepare Section 61 BSA cryptographic certificates for all email correspondence with municipal clearance authorities.
                  </p>
                </div>
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800 space-y-1">
                  <span className="font-semibold text-white block">3. Solvency Proof</span>
                  <p className="text-[11px] text-slate-400">
                    Audited balance sheets showing invocation of guarantee will force concessionaire into insolvency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
