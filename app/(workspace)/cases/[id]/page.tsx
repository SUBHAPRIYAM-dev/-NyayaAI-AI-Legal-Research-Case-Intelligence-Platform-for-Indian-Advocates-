"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Clock,
  Plus,
  FileText,
  Scale,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ListTodo,
  FolderLock,
  ChevronRight,
  Trash2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DEMO_CASES, DEMO_DOCUMENTS, DEMO_JUDGMENTS } from "@/lib/demo-data";
import { CaseRecord, CaseEvent, CaseHearing } from "@/types";
import { formatDate } from "@/lib/utils";

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id as string;

  const [caseData, setCaseData] = React.useState<CaseRecord | null>(null);
  const [activeTab, setActiveTab] = React.useState<
    "overview" | "timeline" | "documents" | "research" | "authorities" | "hearings" | "tasks" | "notes" | "ai"
  >("overview");

  // Timeline Event Modal
  const [showEventModal, setShowEventModal] = React.useState(false);
  const [eventTitle, setEventTitle] = React.useState("");
  const [eventType, setEventType] = React.useState<CaseEvent["type"]>("Hearing");
  const [eventDate, setEventDate] = React.useState(new Date().toISOString().split("T")[0]);
  const [eventDesc, setEventDesc] = React.useState("");

  React.useEffect(() => {
    // Find case from demo or fallback
    const found = DEMO_CASES.find((c) => c.id === caseId) || DEMO_CASES[0];
    setCaseData(found);
  }, [caseId]);

  if (!caseData) {
    return (
      <div className="p-10 text-center text-xs text-slate-400">
        Loading case docket...
      </div>
    );
  }

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const newEvt: CaseEvent = {
      id: `evt-${Date.now()}`,
      caseId: caseData.id,
      title: eventTitle,
      type: eventType,
      date: eventDate,
      description: eventDesc,
    };

    const updatedEvents = [newEvt, ...caseData.events];
    setCaseData({ ...caseData, events: updatedEvents });
    setShowEventModal(false);
    setEventTitle("");
    setEventDesc("");
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/cases" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-gold-400 font-semibold">
                {caseData.caseNumber}
              </span>
              <Badge variant="gold" className="text-[10px]">
                {caseData.status}
              </Badge>
              <Badge variant="neutral" className="text-[10px]">
                {caseData.practiceArea}
              </Badge>
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5">{caseData.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/case-strategy">
            <Button variant="outline" size="sm" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-gold-400" />
              AI Strategy Matrix
            </Button>
          </Link>
          <Link href="/drafting">
            <Button variant="gold" size="sm" className="text-xs">
              Prepare Pleadings
            </Button>
          </Link>
        </div>
      </div>

      {/* Case Details Summary Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-navy-900/60 p-3 rounded-lg border border-slate-800 text-xs font-mono">
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Court & Jurisdiction</span>
          <span className="text-slate-200 truncate block font-medium">{caseData.court}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Client Name</span>
          <span className="text-slate-200 truncate block font-medium">{caseData.clientName}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Assigned Advocate</span>
          <span className="text-slate-200 truncate block font-medium">{caseData.assignedLawyer}</span>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] uppercase block">Next Hearing</span>
          <span className="text-gold-400 font-bold block">
            {caseData.nextHearingDate ? formatDate(caseData.nextHearingDate) : "None Scheduled"}
          </span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs overflow-x-auto gap-1">
        {[
          { id: "overview", label: "Overview" },
          { id: "timeline", label: `Visual Timeline (${caseData.events.length})` },
          { id: "documents", label: "Documents" },
          { id: "research", label: "Research Threads" },
          { id: "authorities", label: "Authorities" },
          { id: "hearings", label: "Hearings" },
          { id: "tasks", label: "Tasks" },
          { id: "notes", label: "Chambers Notes" },
          { id: "ai", label: "AI Analysis" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2.5 px-3.5 font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "border-gold-500 text-gold-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="space-y-6 text-xs">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 bg-navy-900/80 border-slate-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Matter Summary & Fact Matrix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 leading-relaxed text-slate-300">
                <p>{caseData.summary}</p>

                <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 space-y-2">
                  <span className="text-[10px] font-mono text-gold-400 font-bold uppercase">
                    Procedural Status Summary
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Matter initiated before the {caseData.court}. Currently pending at stage of {caseData.events[0]?.title || "Notice / Reply"}. Next date of hearing scheduled on {caseData.nextHearingDate ? formatDate(caseData.nextHearingDate) : "TBD"}.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-navy-900/80 border-slate-800 space-y-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Key Contacts & Counsel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800 space-y-0.5">
                  <span className="text-slate-400 text-[10px]">Lead Counsel:</span>
                  <p className="text-white font-medium">{caseData.assignedLawyer}</p>
                  <p className="text-slate-500 font-mono text-[10px]">{caseData.assignedLawyerEmail}</p>
                </div>
                <div className="p-2.5 rounded bg-navy-950 border border-slate-800 space-y-0.5">
                  <span className="text-slate-400 text-[10px]">Opposing Counsel (Estimated):</span>
                  <p className="text-white font-medium">Adv. S. K. Mahapatra & Associates</p>
                  <p className="text-slate-500 font-mono text-[10px]">mahapatra@delhibar.org</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: VISUAL TIMELINE */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Procedural Lifecycle Timeline</h3>
                <p className="text-xs text-slate-400">
                  Chronological record of filings, notices, hearings, and orders.
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                className="text-xs h-8"
                onClick={() => setShowEventModal(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Timeline Event
              </Button>
            </div>

            {/* Visual Timeline Stream */}
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-4 ml-3">
              {caseData.events.map((evt, idx) => (
                <div key={evt.id} className="relative group">
                  {/* Timeline node icon */}
                  <div className="absolute -left-[31px] top-1 h-5 w-5 rounded-full bg-navy-950 border-2 border-gold-500 flex items-center justify-center text-gold-400 shadow-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                  </div>

                  <Card className="bg-navy-900/80 border-slate-800 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="gold" className="text-[10px] font-mono">
                          {evt.type}
                        </Badge>
                        <h4 className="text-xs font-bold text-white">{evt.title}</h4>
                      </div>
                      <span className="text-[11px] font-mono text-gold-400">
                        {formatDate(evt.date)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evt.description}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Matter Documents & Exhibits</span>
              <Link href="/documents">
                <Button variant="outline" size="sm" className="text-xs">
                  Open Vault <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEMO_DOCUMENTS.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-lg border border-slate-800 bg-navy-900 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="h-4 w-4 text-gold-400 shrink-0" />
                    <span className="text-white truncate font-medium">{doc.name}</span>
                  </div>
                  <Badge variant="verified" className="text-[9px]">
                    {doc.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HEARINGS */}
        {activeTab === "hearings" && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white">Scheduled Bench Hearings</h3>
            {caseData.hearings.length > 0 ? (
              <div className="space-y-2">
                {caseData.hearings.map((h) => (
                  <div
                    key={h.id}
                    className="p-4 rounded-lg border border-slate-800 bg-navy-900/80 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-white">{h.purpose}</h4>
                      <p className="text-[11px] text-slate-400">
                        {h.court} • {h.bench}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs text-gold-400 font-bold block">
                        {formatDate(h.hearingDate)}
                      </span>
                      <Badge variant="gold" className="text-[9px] mt-1">
                        {h.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 rounded border border-dashed border-slate-800">
                No hearings currently scheduled for this matter.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: AI ANALYSIS */}
        {activeTab === "ai" && (
          <Card className="bg-navy-900/90 border-slate-800 p-5 space-y-3">
            <span className="text-[10px] font-mono text-gold-400 uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" /> Autonomous Case Strategy Assessment
            </span>
            <div className="rounded bg-navy-950 p-4 border border-slate-800 text-slate-300 leading-relaxed space-y-2">
              <p className="font-semibold text-white">Potential Strategic Arguments:</p>
              <p>
                1. Challenge arbitrary termination under Article 14 fairness standards (citing 2025 SCC OnLine SC 401).
                <br />
                2. Assert that availability of arbitration clause under Section 38 does not oust extraordinary writ relief where public authority acts mala fide.
                <br />
                3. Prepare Section 9 interim injunction application to restrain encashment of performance guarantees.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/case-strategy">
                <Button variant="gold" size="sm" className="text-xs">
                  Run Full Case Strategy Matrix <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Add Timeline Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md bg-navy-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Record Procedural Event</CardTitle>
              <CardDescription>
                Add a hearing, notice, reply, or judicial order to this case docket.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Event Title</label>
                  <Input
                    placeholder="e.g. Reply Affidavit Filed by Respondent"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Event Type</label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value as any)}
                      className="w-full h-9 rounded border border-slate-800 bg-navy-950 px-3 text-xs text-white"
                    >
                      <option>Filing</option>
                      <option>Notice</option>
                      <option>Reply</option>
                      <option>Evidence</option>
                      <option>Hearing</option>
                      <option>Arguments</option>
                      <option>Order</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-medium text-slate-300">Date</label>
                    <Input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Description & Details</label>
                  <textarea
                    rows={2}
                    placeholder="Details of court proceedings or filing annexures..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    className="w-full rounded-md border border-slate-800 bg-navy-950 p-2 text-xs text-white focus:ring-1 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Add Event
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
