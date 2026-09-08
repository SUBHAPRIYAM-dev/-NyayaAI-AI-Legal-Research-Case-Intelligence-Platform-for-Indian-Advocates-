"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Plus,
  Search,
  Calendar,
  User,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DEMO_CASES } from "@/lib/demo-data";
import { CaseRecord, CaseStatus } from "@/types";
import { formatDate } from "@/lib/utils";

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = React.useState<CaseRecord[]>(DEMO_CASES);
  const [filterStatus, setFilterStatus] = React.useState<string>("All");
  const [search, setSearch] = React.useState("");
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  // New Case form state
  const [newTitle, setNewTitle] = React.useState("");
  const [newCaseNumber, setNewCaseNumber] = React.useState("");
  const [newCourt, setNewCourt] = React.useState("High Court of Delhi");
  const [newClient, setNewClient] = React.useState("");
  const [newPracticeArea, setNewPracticeArea] = React.useState("Commercial Arbitration");
  const [newHearingDate, setNewHearingDate] = React.useState("2026-10-15");
  const [newSummary, setNewSummary] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          caseNumber: newCaseNumber,
          court: newCourt,
          clientName: newClient,
          practiceArea: newPracticeArea,
          nextHearingDate: newHearingDate,
          summary: newSummary,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create case");

      setCases([data.case, ...cases]);
      setShowCreateModal(false);
      // Reset form
      setNewTitle("");
      setNewCaseNumber("");
      setNewClient("");
      setNewSummary("");
      router.push(`/cases/${data.case.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      c.court.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-gold-400" />
              Litigation Docket & Matters
            </h1>
            <Badge variant="gold">{cases.length} Total Matters</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage your chambers active proceedings, hearing dates, and court filings.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          className="text-xs font-semibold"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Create Case Docket
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search by case title, number, or court..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
          {["All", "Active", "Pending", "Closed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                filterStatus === st
                  ? "bg-gold-500 text-navy-950 font-semibold"
                  : "bg-navy-900 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCases.map((c) => (
          <Card
            key={c.id}
            hoverEffect
            className="bg-navy-900/80 border-slate-800 flex flex-col justify-between"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <Badge
                  variant={c.status === "Active" ? "gold" : "neutral"}
                  className="text-[10px] font-mono"
                >
                  {c.status}
                </Badge>
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  {c.caseNumber}
                </span>
              </div>
              <CardTitle className="text-sm font-bold text-white line-clamp-2 mt-2 leading-snug">
                {c.title}
              </CardTitle>
              <p className="text-[11px] text-gold-400/90 font-medium truncate mt-0.5">
                {c.court}
              </p>
            </CardHeader>

            <CardContent className="space-y-3 text-xs pt-0">
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Client</span>
                  <span className="text-slate-200 truncate block">{c.clientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Counsel</span>
                  <span className="text-slate-200 truncate block">{c.assignedLawyer}</span>
                </div>
              </div>

              {c.nextHearingDate && (
                <div className="rounded bg-navy-950/80 border border-slate-800 p-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gold-400" /> Next Hearing:
                  </span>
                  <span className="font-mono text-[11px] text-gold-300 font-semibold">
                    {formatDate(c.nextHearingDate)}
                  </span>
                </div>
              )}

              <Link href={`/cases/${c.id}`} className="block pt-1">
                <Button variant="secondary" size="sm" className="w-full text-xs h-8">
                  Open Case Workspace <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-lg bg-navy-900 border-slate-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-base">Register New Case Docket</CardTitle>
              <CardDescription>
                Create a centralized litigation file with procedural timeline and hearing docket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCase} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Case / Matter Title</label>
                  <Input
                    placeholder="e.g. Apex Mercantile Infra v. UT of Indica"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Case / Petition No.</label>
                    <Input
                      placeholder="e.g. ARB.A. 42/2026"
                      value={newCaseNumber}
                      onChange={(e) => setNewCaseNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Court / Tribunal</label>
                    <Input
                      placeholder="e.g. High Court of Delhi"
                      value={newCourt}
                      onChange={(e) => setNewCourt(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Client Name</label>
                    <Input
                      placeholder="e.g. Apex Mercantile Ltd."
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Practice Area</label>
                    <select
                      value={newPracticeArea}
                      onChange={(e) => setNewPracticeArea(e.target.value)}
                      className="w-full h-10 rounded-md border border-slate-800 bg-navy-950 px-3 text-xs text-white"
                    >
                      <option>Commercial Arbitration</option>
                      <option>Constitutional Law</option>
                      <option>Criminal Law (BNS/BNSS)</option>
                      <option>Insolvency & Bankruptcy</option>
                      <option>Intellectual Property</option>
                      <option>Taxation & GST</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Next Hearing Date</label>
                  <Input
                    type="date"
                    value={newHearingDate}
                    onChange={(e) => setNewHearingDate(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Matter Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Brief background and relief sought..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-navy-950 p-2 text-xs text-white focus:ring-1 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    isLoading={isSubmitting}
                  >
                    Create Docket
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
