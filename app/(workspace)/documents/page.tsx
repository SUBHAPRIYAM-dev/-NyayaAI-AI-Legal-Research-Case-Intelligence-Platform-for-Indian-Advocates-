"use client";

import * as React from "react";
import {
  FolderLock,
  Upload,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Search,
  Sparkles,
  ChevronRight,
  Split,
  Eye,
  Trash2,
  CheckCircle2,
  BookOpen,
  Send,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DEMO_DOCUMENTS } from "@/lib/demo-data";
import { DocumentRecord } from "@/types";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const [documents, setDocuments] = React.useState<DocumentRecord[]>(DEMO_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentRecord>(DEMO_DOCUMENTS[0]);
  const [activeAction, setActiveAction] = React.useState<string>("find-risks");
  const [actionResult, setActionResult] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [searchFilter, setSearchFilter] = React.useState("");

  // Upload modal state
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const [newFileType, setNewFileType] = React.useState<"pdf" | "docx" | "txt">("pdf");
  const [uploading, setUploading] = React.useState(false);

  // Initial trigger
  React.useEffect(() => {
    handleRunAction("find-risks");
  }, [selectedDoc]);

  const handleRunAction = async (action: string) => {
    setActiveAction(action);
    setIsProcessing(true);
    setActionResult("");

    try {
      const res = await fetch(`/api/documents/${selectedDoc.id}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setActionResult(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadNewDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    setUploading(true);

    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName.endsWith(`.${newFileType}`) ? newFileName : `${newFileName}.${newFileType}`,
          fileType: newFileType,
          sizeBytes: 3200000,
          caseTitle: "Chambers Practice Document",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setDocuments([data.document, ...documents]);
      setSelectedDoc(data.document);
      setShowUploadModal(false);
      setNewFileName("");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (d.caseTitle && d.caseTitle.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FolderLock className="h-6 w-6 text-blue-400" />
              Document Vault & AI Reader
            </h1>
            <Badge variant="gold">Signed URL Storage</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Secure client documents with contextual AI analysis, risk discovery, and statutory clause extraction.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          className="text-xs"
          onClick={() => setShowUploadModal(true)}
        >
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          Upload Document
        </Button>
      </div>

      {/* Main Split Layout: Document List & Split-Screen Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Document Cards */}
        <div className="lg:col-span-4 space-y-3">
          <Input
            placeholder="Search documents or matter..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredDocs.map((doc) => {
              const isSelected = doc.id === selectedDoc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? "border-gold-500 bg-gold-500/10 shadow-sm"
                      : "border-slate-800 bg-navy-900/70 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-gold-400 shrink-0" />
                      <span className="font-semibold text-white truncate">{doc.name}</span>
                    </div>
                    <Badge variant="neutral" className="text-[9px] uppercase font-mono shrink-0">
                      {doc.fileType}
                    </Badge>
                  </div>

                  {doc.caseTitle && (
                    <p className="text-[11px] text-slate-400 truncate">{doc.caseTitle}</p>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                    <span>{doc.pageCount} Pages • {(doc.sizeBytes / 1000000).toFixed(1)} MB</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {doc.aiStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Split-Screen Document Viewer & AI Reader */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="bg-navy-900/90 border-slate-800 overflow-hidden shadow-xl">
            {/* Document Header Bar */}
            <div className="p-4 border-b border-slate-800 bg-navy-950 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <FileText className="h-4 w-4 text-gold-400" />
                <span className="text-xs font-bold text-white truncate">{selectedDoc.name}</span>
                <Badge variant="gold" className="text-[9px]">
                  {selectedDoc.status}
                </Badge>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Uploaded {formatDate(selectedDoc.uploadedAt)}
              </div>
            </div>

            {/* Split Screen Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-[500px]">
              {/* Document Text / Preview Pane */}
              <div className="p-4 bg-navy-950/40 text-xs font-mono space-y-3 overflow-y-auto max-h-[520px]">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Extracted Document Text (Excerpts)
                </span>

                <div className="p-3 rounded bg-navy-900/80 border border-slate-800 leading-relaxed text-slate-300 space-y-2">
                  <p className="text-gold-400 font-bold">CLAUSE 34.2 (DEFAULT & TERMINATION):</p>
                  <p className="text-[11px] select-all">
                    &quot;Notwithstanding anything to the contrary contained herein, in the event of default in milestone completion exceeding 30 days, the Grantor shall be entitled to terminate this Concession forthwith without requirement of cure notice or arbitral recourse.&quot;
                  </p>
                </div>

                <div className="p-3 rounded bg-navy-900/80 border border-slate-800 leading-relaxed text-slate-300 space-y-2">
                  <p className="text-gold-400 font-bold">CLAUSE 38.1 (GOVERNING LAW & ARBITRATION):</p>
                  <p className="text-[11px] select-all">
                    &quot;This Agreement shall be governed by and construed in accordance with the Laws of India. All disputes shall be referred to arbitration under the Arbitration and Conciliation Act, 1996 seated at New Delhi.&quot;
                  </p>
                </div>

                <div className="p-3 rounded bg-navy-900/80 border border-slate-800 leading-relaxed text-slate-300 space-y-2">
                  <p className="text-gold-400 font-bold">CLAUSE 14 (FORCE MAJEURE):</p>
                  <p className="text-[11px] select-all">
                    &quot;Neither party shall be held liable for failure of performance caused by governmental orders, statutory amendments, or judicial injunctions exceeding 60 consecutive days.&quot;
                  </p>
                </div>
              </div>

              {/* AI Reader & Contextual Analysis Pane */}
              <div className="p-4 flex flex-col justify-between space-y-4 bg-navy-900/60">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" /> Contextual AI Intelligence
                    </span>
                    <Badge variant="neutral" className="text-[9px]">
                      Interactive
                    </Badge>
                  </div>

                  {/* AI Action Buttons */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "find-risks", label: "Find Risks" },
                      { id: "find-provisions", label: "Find Provisions" },
                      { id: "find-authorities", label: "Find Authorities" },
                      { id: "explain-selection", label: "Explain Clause" },
                      { id: "summarize", label: "Summarize" },
                    ].map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleRunAction(btn.id)}
                        className={`text-[11px] px-2.5 py-1 rounded border transition-all ${
                          activeAction === btn.id
                            ? "bg-gold-500 text-navy-950 font-semibold border-gold-500"
                            : "bg-navy-950 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Action Results Output */}
                  <div className="rounded-lg border border-slate-800 bg-navy-950 p-4 min-h-[260px] max-h-[320px] overflow-y-auto text-xs text-slate-200 leading-relaxed">
                    {isProcessing ? (
                      <div className="flex items-center justify-center h-48 text-gold-400 gap-2">
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span>Analyzing document provisions...</span>
                      </div>
                    ) : actionResult ? (
                      <div className="whitespace-pre-line">{actionResult}</div>
                    ) : (
                      <p className="text-slate-500">Select an AI action above to analyze this document.</p>
                    )}
                  </div>
                </div>

                {/* Ask AI Follow-up Input */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Ask AI about this document..."
                      className="text-xs h-9 bg-navy-950"
                    />
                    <Button
                      variant="gold"
                      size="sm"
                      className="h-9 px-3 shrink-0"
                      onClick={() => handleRunAction("find-risks")}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md bg-navy-900 border-slate-700">
            <CardHeader>
              <CardTitle className="text-sm">Upload Legal Document to Vault</CardTitle>
              <CardDescription>
                Files are virus-scanned, tokenized, and indexed into your chambers repository.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadNewDocument} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Document Title</label>
                  <Input
                    placeholder="e.g. Master_Services_Agreement_2026.pdf"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-300">File Type</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full h-9 rounded border border-slate-800 bg-navy-950 px-3 text-xs text-white"
                  >
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="docx">Word (.docx)</option>
                    <option value="txt">Plain Text (.txt)</option>
                  </select>
                </div>

                <div className="p-3 rounded border border-dashed border-slate-800 bg-navy-950/60 text-center text-slate-400">
                  <Upload className="h-6 w-6 text-gold-400 mx-auto mb-1 opacity-70" />
                  <p className="text-[11px]">Maximum file size: 25 MB</p>
                  <p className="text-[10px] text-slate-400">Supported: PDF, DOCX, TXT, scanned images</p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUploadModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="gold"
                    size="sm"
                    isLoading={uploading}
                  >
                    Upload & Index
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
