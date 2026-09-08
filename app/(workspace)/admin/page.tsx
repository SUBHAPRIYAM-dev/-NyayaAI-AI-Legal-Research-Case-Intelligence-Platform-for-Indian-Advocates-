"use client";

import * as React from "react";
import {
  ShieldAlert,
  Activity,
  Database,
  Users,
  Settings2,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  Sparkles,
  Search,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DEMO_USERS,
  DEMO_ORGANIZATION,
  DEMO_JUDGMENTS,
  DEMO_STATUTES,
  DEMO_AUDIT_LOGS
} from "@/lib/demo-data";
import { SystemHealthStatus, FeatureFlagConfig, AuditLogEntry, LegalSource } from "@/types";
import { formatDateTime } from "@/lib/utils";

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = React.useState<"health" | "flags" | "knowledge" | "audit" | "users">("health");
  const [sources, setSources] = React.useState<LegalSource[]>(DEMO_JUDGMENTS);
  const [auditLogs, setAuditLogs] = React.useState<AuditLogEntry[]>(DEMO_AUDIT_LOGS);
  const [flags, setFlags] = React.useState<FeatureFlagConfig>({
    aiResearch: true,
    citationVerification: true,
    documentAnalysis: true,
    draftingEngine: true,
    billingSystem: true,
    firmWorkspace: true,
    realGeminiIntegration: false,
  });

  const [health, setHealth] = React.useState<SystemHealthStatus>({
    api: "Operational",
    database: "Operational",
    redis: "Demo Mode",
    aiService: "Demo AI Mode",
    queue: "In-Memory Mode",
    storage: "Local Emulated",
    geminiConnected: false,
    version: "1.0.0-saas-prototype",
    uptimeSeconds: 8420,
  });

  const [isReindexing, setIsReindexing] = React.useState(false);
  const [reindexMsg, setReindexMsg] = React.useState("");

  // Create Source Modal state
  const [showSourceModal, setShowSourceModal] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCitation, setNewCitation] = React.useState("");
  const [newCourt, setNewCourt] = React.useState("Supreme Court of India");
  const [newSummary, setNewSummary] = React.useState("");

  const handleToggleFlag = async (key: keyof FeatureFlagConfig) => {
    try {
      const res = await fetch("/api/admin/flags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (data.flags) setFlags(data.flags);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    setReindexMsg("");
    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reindex" }),
      });
      const data = await res.json();
      setReindexMsg(data.message || "Knowledge base re-indexed.");
      setTimeout(() => setReindexMsg(""), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReindexing(false);
    }
  };

  const handleCreateSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCitation) return;

    try {
      const res = await fetch("/api/admin/sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          source: {
            title: newTitle,
            citation: newCitation,
            court: newCourt,
            summary: newSummary,
          },
        }),
      });
      const data = await res.json();
      if (data.source) {
        setSources([data.source, ...sources]);
        setShowSourceModal(false);
        setNewTitle("");
        setNewCitation("");
        setNewSummary("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-rose-400" />
              Chambers Platform Administration
            </h1>
            <Badge variant="unverified">Admin Role Required</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            System diagnostics, legal knowledge base curation, feature toggles, and immutable audit logs.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-navy-900 border border-slate-800 rounded-lg p-1 text-xs">
          {[
            { id: "health", label: "System Health" },
            { id: "flags", label: "Feature Flags" },
            { id: "knowledge", label: "Knowledge Base" },
            { id: "audit", label: "Audit Logs" },
            { id: "users", label: "Users & Orgs" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded transition-all font-medium ${
                activeTab === tab.id
                  ? "bg-rose-500 text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {reindexMsg && (
        <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{reindexMsg}</span>
        </div>
      )}

      {/* TAB 1: SYSTEM HEALTH */}
      {activeTab === "health" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "API Cluster", status: health.api, ok: true },
              { label: "PostgreSQL DB", status: health.database, ok: true },
              { label: "Redis State", status: health.redis, ok: true },
              { label: "AI Orchestrator", status: health.aiService, ok: true },
              { label: "Async Queue", status: health.queue, ok: true },
              { label: "Object Storage", status: health.storage, ok: true },
            ].map((node) => (
              <Card key={node.label} className="bg-navy-900/80 border-slate-800 p-4 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  {node.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-white">{node.status}</span>
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-navy-900/80 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm">Runtime Diagnostics & Host Info</CardTitle>
            </CardHeader>
            <CardContent className="p-5 text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Software Version:</span>
                <span className="text-white">{health.version}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Uptime:</span>
                <span className="text-gold-400">{Math.floor(health.uptimeSeconds / 60)} minutes</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-400">Gemini Live Connection:</span>
                <span className={health.geminiConnected ? "text-emerald-400" : "text-amber-400"}>
                  {health.geminiConnected ? "Connected (Live API)" : "Emulated (Demo AI Mode)"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tenant Isolation Policy:</span>
                <span className="text-emerald-400 font-bold">Strict Server-Enforced</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: FEATURE FLAGS */}
      {activeTab === "flags" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm">Platform Feature Flag Controls</CardTitle>
            <CardDescription>
              Dynamically toggle core subsystems on or off across all organization tenants.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs">
            {[
              { key: "aiResearch" as const, label: "AI Legal Research RAG Engine", desc: "Enables 3-column legal research workspace and LLM orchestration." },
              { key: "citationVerification" as const, label: "Precedent & Citation Verifier", desc: "Enables ground-truth precedent validation pipeline." },
              { key: "documentAnalysis" as const, label: "Document Vault & AI Reader", desc: "Enables secure file upload and contextual AI risk extraction." },
              { key: "draftingEngine" as const, label: "Legal Drafting Studio", desc: "Enables 14+ Indian drafting templates and multi-format export." },
              { key: "billingSystem" as const, label: "Billing & Subscriptions", desc: "Enables plan tier switching and mock Razorpay/Stripe checkout." },
              { key: "firmWorkspace" as const, label: "Firm Multi-Tenant Workspace", desc: "Enables team roster, invitation system, and member RBAC." },
            ].map((f) => (
              <div
                key={f.key}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-navy-950/60"
              >
                <div>
                  <h4 className="font-semibold text-white">{f.label}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{f.desc}</p>
                </div>
                <button
                  onClick={() => handleToggleFlag(f.key)}
                  className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                    flags[f.key] ? "bg-emerald-500" : "bg-slate-700"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-white transition-transform ${
                      flags[f.key] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: KNOWLEDGE BASE MANAGER */}
      {activeTab === "knowledge" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm">Authority Repository Curation</CardTitle>
              <CardDescription>
                {sources.length} Judgments & {DEMO_STATUTES.length} Statutes indexed in vector database.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={handleReindex}
                isLoading={isReindexing}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" /> Re-index Vectors
              </Button>
              <Button
                variant="gold"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowSourceModal(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Legal Source
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-navy-950/60 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Citation</th>
                    <th className="py-3 px-4">Court</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Demo Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {sources.slice(0, 10).map((s) => (
                    <tr key={s.id} className="hover:bg-navy-800/40 transition-colors">
                      <td className="py-3 px-4 font-medium text-white max-w-xs truncate">
                        {s.title}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-gold-400">
                        {s.citation}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{s.court}</td>
                      <td className="py-3 px-4">
                        <Badge variant="verified" className="text-[9px]">
                          {s.precedentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="gold" className="text-[9px]">
                          DEMO: TRUE
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm">Chambers Immutable Audit Trail</CardTitle>
            <CardDescription>
              Cryptographically timestamped record of user logins, research queries, and document access.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-slate-800 bg-navy-950/60 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-navy-800/40">
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="py-3 px-4 text-white font-sans">{log.userEmail}</td>
                      <td className="py-3 px-4 text-gold-400 font-bold">{log.action}</td>
                      <td className="py-3 px-4 text-slate-300 max-w-sm truncate font-sans">
                        {log.details}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: USERS & ORGS */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          <Card className="bg-navy-900/80 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm">Tenants & Organizations</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="p-3 rounded border border-slate-800 bg-navy-950 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{DEMO_ORGANIZATION.name}</span>
                  <Badge variant="gold">Professional Plan</Badge>
                </div>
                <p className="text-slate-400 font-mono text-[11px]">ID: {DEMO_ORGANIZATION.id}</p>
                <p className="text-slate-500 text-[10px]">8 Enrolled Advocates & Associates</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-navy-900/80 border-slate-800">
            <CardHeader className="pb-3 border-b border-slate-800">
              <CardTitle className="text-sm">Registered Demo Accounts</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {DEMO_USERS.map((u) => (
                <div key={u.id} className="p-2.5 rounded border border-slate-800 bg-navy-950 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">{u.name}</span>
                    <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                  </div>
                  <Badge variant="neutral" className="font-mono text-[9px]">{u.role}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Legal Source Modal */}
      {showSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md bg-navy-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Add Legal Source to Repository</CardTitle>
              <CardDescription>All additions are marked with demo: true.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSource} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Judgment Title</label>
                  <Input
                    placeholder="e.g. Apex Mercantile v. UT of Indica"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Official Citation</label>
                  <Input
                    placeholder="e.g. 2026 SCC OnLine SC 101"
                    value={newCitation}
                    onChange={(e) => setNewCitation(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Court</label>
                  <Input
                    value={newCourt}
                    onChange={(e) => setNewCourt(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Ratio Decidendi Summary</label>
                  <textarea
                    rows={3}
                    placeholder="Judicial ruling summary..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full rounded border border-slate-800 bg-navy-950 p-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSourceModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Save Source
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
