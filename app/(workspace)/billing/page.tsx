"use client";

import * as React from "react";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
  FileText,
  Search,
  PenTool,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_AI_USAGE, DEMO_SUBSCRIPTION } from "@/lib/demo-data";
import { AIUsageMetrics, SubscriptionInfo } from "@/types";
import { formatCurrencyINR, formatDate } from "@/lib/utils";

export default function BillingPage() {
  const [sub, setSub] = React.useState<SubscriptionInfo>(DEMO_SUBSCRIPTION);
  const [usage, setUsage] = React.useState<AIUsageMetrics>(DEMO_AI_USAGE);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState("");

  const handleSelectPlan = async (planId: "free" | "advocate" | "professional" | "firm") => {
    setIsUpdating(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, provider: "mock" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update plan");

      setSub(data.subscription);
      setUsage(data.usage);
      setSuccessMsg(`Plan upgraded to ${data.subscription.planName} successfully!`);
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculatePercent = (used: number, limit: number) => {
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-gold-400" />
              Chambers Subscriptions & AI Metering
            </h1>
            <Badge variant="gold">DEMO PRICING</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time AI query consumption, quota limits, and plan tier configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="verified" className="text-xs py-1 px-3">
            Active: {sub.planName}
          </Badge>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. REAL-TIME AI USAGE GAUGES */}
      <Card className="bg-navy-900/80 border-slate-800">
        <CardHeader className="pb-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-400" />
              Chambers AI Quota Allocation ({usage.periodMonth})
            </CardTitle>
            <span className="text-xs font-mono text-slate-400">
              Tokens Consumed: <strong className="text-gold-300 font-bold">{usage.tokensConsumed.toLocaleString()}</strong>
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Gauge 1: Research */}
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-gold-400" /> Research Queries
              </span>
              <span className="font-mono font-bold text-white">
                {calculatePercent(usage.researchQueriesUsed, usage.researchQueriesLimit)}%
              </span>
            </div>
            <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gold-500"
                style={{ width: `${calculatePercent(usage.researchQueriesUsed, usage.researchQueriesLimit)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{usage.researchQueriesUsed} used</span>
              <span>{usage.researchQueriesLimit} limit</span>
            </div>
          </div>

          {/* Gauge 2: Documents */}
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-blue-400" /> Document Analyses
              </span>
              <span className="font-mono font-bold text-white">
                {calculatePercent(usage.documentAnalysesUsed, usage.documentAnalysesLimit)}%
              </span>
            </div>
            <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${calculatePercent(usage.documentAnalysesUsed, usage.documentAnalysesLimit)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{usage.documentAnalysesUsed} used</span>
              <span>{usage.documentAnalysesLimit} limit</span>
            </div>
          </div>

          {/* Gauge 3: Drafts */}
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <PenTool className="h-3.5 w-3.5 text-amber-400" /> Drafts Generated
              </span>
              <span className="font-mono font-bold text-white">
                {calculatePercent(usage.draftsGeneratedUsed, usage.draftsGeneratedLimit)}%
              </span>
            </div>
            <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${calculatePercent(usage.draftsGeneratedUsed, usage.draftsGeneratedLimit)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{usage.draftsGeneratedUsed} used</span>
              <span>{usage.draftsGeneratedLimit} limit</span>
            </div>
          </div>

          {/* Gauge 4: Citations */}
          <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Citation Checks
              </span>
              <span className="font-mono font-bold text-white">
                {calculatePercent(usage.citationChecksUsed, usage.citationChecksLimit)}%
              </span>
            </div>
            <div className="h-2 w-full bg-navy-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${calculatePercent(usage.citationChecksUsed, usage.citationChecksLimit)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>{usage.citationChecksUsed} used</span>
              <span>{usage.citationChecksLimit} limit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. PLANS & UPGRADE MATRIX */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available Chambers Subscriptions (Demo Mode)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              id: "free" as const,
              name: "Free Starter",
              price: "₹0",
              queries: "10 queries/mo",
              features: ["10 AI Research Queries", "5 Document Vault Uploads", "Community Citations"],
            },
            {
              id: "advocate" as const,
              name: "Advocate Individual",
              price: "₹999",
              queries: "500 queries/mo",
              features: ["500 AI Research Queries", "50 Document Vault Uploads", "Citation Verifier Engine", "50 Draft Generations"],
            },
            {
              id: "professional" as const,
              name: "Professional Chambers",
              price: "₹2,499",
              queries: "2,000 queries/mo",
              features: ["2,000 AI Research Queries", "100 Document Analyses", "Unlimited Precedent Checks", "150 Draft Generations", "Priority Vector Processing"],
            },
            {
              id: "firm" as const,
              name: "Enterprise Law Firm",
              price: "Custom (₹7,999)",
              queries: "10,000 queries/mo",
              features: ["10,000 AI Queries", "Full Firm RBAC Roster", "Dedicated Cloud Vault", "Custom RAG Fine-tuning", "Audit Log Export"],
            },
          ].map((plan) => {
            const isCurrent = sub.planId === plan.id;
            return (
              <Card
                key={plan.id}
                className={`flex flex-col justify-between p-5 transition-all ${
                  isCurrent
                    ? "border-gold-500 bg-gold-500/5 shadow-md shadow-gold-500/10"
                    : "border-slate-800 bg-navy-900/60"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{plan.name}</h3>
                    {isCurrent && <Badge variant="gold">Active</Badge>}
                  </div>

                  <div>
                    <span className="text-2xl font-extrabold text-white font-mono">{plan.price}</span>
                    <span className="text-xs text-slate-400"> /month</span>
                  </div>

                  <div className="rounded bg-navy-950 p-2 border border-slate-800 font-mono text-[11px] text-gold-400 text-center">
                    {plan.queries}
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px]">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Button
                    variant={isCurrent ? "outline" : "gold"}
                    size="sm"
                    className="w-full text-xs"
                    disabled={isCurrent || isUpdating}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {isCurrent ? "Current Active Plan" : "Switch to Plan (Demo)"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
