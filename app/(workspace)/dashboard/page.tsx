"use client";

import * as React from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  FolderLock,
  BookOpen,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Plus,
  Scale,
  Calendar,
  AlertTriangle,
  Clock,
  ExternalLink
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEMO_CASES,
  DEMO_RESEARCH_SESSIONS,
  DEMO_DOCUMENTS,
  DEMO_JUDGMENTS,
  DEMO_AI_USAGE,
  DEMO_SUBSCRIPTION,
  DEMO_AUDIT_LOGS
} from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";

const RESEARCH_CHART_DATA = [
  { day: "Mon", queries: 12, citations: 8 },
  { day: "Tue", queries: 19, citations: 14 },
  { day: "Wed", queries: 28, citations: 21 },
  { day: "Thu", queries: 22, citations: 16 },
  { day: "Fri", queries: 35, citations: 29 },
  { day: "Sat", queries: 18, citations: 12 },
  { day: "Sun", queries: 8, citations: 4 },
];

const CASE_STAGE_DATA = [
  { stage: "Filing", count: 6 },
  { stage: "Notice", count: 4 },
  { stage: "Reply", count: 5 },
  { stage: "Hearing", count: 5 },
  { stage: "Orders", count: 2 },
];

export default function DashboardPage() {
  const activeCases = DEMO_CASES.filter((c) => c.status === "Active");
  const upcomingHearings = DEMO_CASES.filter((c) => c.nextHearingDate).slice(0, 3);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome & Quick Action Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Chambers Intelligence Dashboard
            </h1>
            <Badge variant="gold" className="text-[10px]">
              Lex Indica Chambers
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time litigation docket, AI research quotas, and precedent verification feeds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/research">
            <Button variant="gold" size="sm" className="text-xs">
              <Search className="h-3.5 w-3.5 mr-1.5" />
              New Research Session
            </Button>
          </Link>
          <Link href="/cases">
            <Button variant="secondary" size="sm" className="text-xs">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Create Case
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Active Cases */}
        <Card hoverEffect className="bg-navy-900/80 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Active Matters
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                {activeCases.length}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> +3 this week
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-navy-800/80 text-gold-400 border border-gold-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Research Queries */}
        <Card hoverEffect className="bg-navy-900/80 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                AI Research Queries
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                {DEMO_AI_USAGE.researchQueriesUsed}
                <span className="text-xs text-slate-400 font-normal"> / {DEMO_AI_USAGE.researchQueriesLimit}</span>
              </div>
              <span className="text-[10px] text-gold-400">
                Professional Quota Active
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-navy-800/80 text-gold-400 border border-gold-500/20">
              <Search className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Documents Vault */}
        <Card hoverEffect className="bg-navy-900/80 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Indexed Documents
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                {DEMO_DOCUMENTS.length}
              </div>
              <span className="text-[10px] text-slate-400">
                100% Virus & OCR Checked
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-navy-800/80 text-blue-400 border border-blue-500/20">
              <FolderLock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Verified Citations */}
        <Card hoverEffect className="bg-navy-900/80 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Citations Verified
              </span>
              <div className="text-2xl font-bold text-white font-mono">
                {DEMO_AI_USAGE.citationChecksUsed}
              </div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="h-3 w-3" /> 0 Hallucinations
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-navy-800/80 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Research & Citation Activity Area Chart */}
        <Card className="lg:col-span-2 bg-navy-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm">Research Activity & Verification Velocity</CardTitle>
                <CardDescription>Daily queries vs citations verified across chambers</CardDescription>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-gold-400">
                  <span className="h-2 w-2 rounded-full bg-gold-400" /> Queries
                </span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Citations
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RESEARCH_CHART_DATA}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A1128",
                      borderColor: "#1E293B",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#FFF",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="queries"
                    stroke="#D4AF37"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#goldGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="citations"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#emeraldGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Case Procedural Breakdown */}
        <Card className="bg-navy-900/80 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Matters by Procedural Stage</CardTitle>
            <CardDescription>Distribution across litigation lifecycle</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CASE_STAGE_DATA}>
                  <XAxis dataKey="stage" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0A1128",
                      borderColor: "#1E293B",
                      borderRadius: "6px",
                      fontSize: "11px",
                      color: "#FFF",
                    }}
                  />
                  <Bar dataKey="count" fill="#C5A059" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Upcoming Court Hearings & Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Hearings */}
        <Card className="bg-navy-900/80 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gold-400" />
                Upcoming Court Hearings
              </CardTitle>
              <Link href="/cases" className="text-xs text-gold-400 hover:underline">
                View all matters
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingHearings.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between p-3 rounded-lg border border-slate-800 bg-navy-950/60 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{c.title}</span>
                    <Badge variant="gold" className="text-[9px] py-0 px-1">
                      {c.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{c.court}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{c.caseNumber}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-gold-400">
                    {formatDate(c.nextHearingDate!)}
                  </div>
                  <Link href={`/cases/${c.id}`} className="inline-block mt-1">
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                      Docket <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Activity Stream */}
        <Card className="bg-navy-900/80 border-slate-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-gold-400" />
                Chambers Intelligence Stream
              </CardTitle>
              <Badge variant="neutral" className="text-[10px]">
                Live Feed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {DEMO_AUDIT_LOGS.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-800/80 bg-navy-950/40"
              >
                <div className="mt-0.5 p-1 rounded bg-navy-800 text-gold-400 shrink-0">
                  {log.action === "RESEARCH_QUERY" && <Search className="h-3.5 w-3.5" />}
                  {log.action === "CITATION_VERIFIED" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                  {log.action === "USER_LOGIN" && <Scale className="h-3.5 w-3.5" />}
                  {log.action === "ADMIN_ACTION" && <Sparkles className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200">{log.action.replace("_", " ")}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 truncate">{log.details}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
