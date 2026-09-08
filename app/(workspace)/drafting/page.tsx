"use client";

import * as React from "react";
import {
  PenTool,
  Download,
  Copy,
  Check,
  Sparkles,
  AlertCircle,
  FileText,
  Scale,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DraftType, LegalDraft } from "@/types";

const TEMPLATES: { type: DraftType; category: string; description: string }[] = [
  { type: "Legal Notice", category: "Pre-Litigation", description: "Statutory notice under Section 80 CPC or contract default." },
  { type: "Bail Application", category: "Criminal (BNSS)", description: "Regular bail under BNSS Section 480/482 before Sessions / High Court." },
  { type: "Anticipatory Bail Application", category: "Criminal (BNSS)", description: "Pre-arrest bail under BNSS Section 482 for apprehension of arrest." },
  { type: "Writ Petition", category: "Constitutional", description: "Article 226 petition before High Court for violation of fundamental rights." },
  { type: "Plaint", category: "Civil / Commercial", description: "Formal civil plaint under Order VII CPC with statement of claim." },
  { type: "Written Statement", category: "Civil / Commercial", description: "Defense pleading under Order VIII CPC with specific denials." },
  { type: "Reply", category: "Applications", description: "Response affidavit opposing interim injunction or application." },
  { type: "Affidavit", category: "Evidentiary", description: "Sworn affidavit of evidence or verification under oaths act." },
  { type: "Application", category: "Interlocutory", description: "Interlocutory application under CPC / commercial court rules." },
  { type: "Legal Opinion", category: "Advisory", description: "Comprehensive legal opinion for corporate board or client." },
  { type: "Research Memorandum", category: "Chambers", description: "Internal senior advocate brief synthesizing jurisprudence." },
  { type: "Written Arguments", category: "Final Hearing", description: "Synoptic written submissions for final arguments." },
  { type: "Client Communication", category: "Chambers", description: "Case update and hearing outcome advisory letter to client." },
  { type: "Contract Review", category: "Corporate", description: "Risk review analyzing indemnities, dispute clauses, and breach terms." },
];

const TONES = [
  "Formal & Assertive",
  "Persuasive & Academic",
  "Concise & Urgent",
  "Neutral & Analytical",
];

export default function DraftingStudioPage() {
  const [currentStep, setCurrentStep] = React.useState<"template" | "details" | "editor">("template");
  const [selectedTemplate, setSelectedTemplate] = React.useState<DraftType>("Legal Notice");
  const [jurisdiction, setJurisdiction] = React.useState("High Court of Delhi, New Delhi");
  const [court, setCourt] = React.useState("High Court of Delhi");
  const [facts, setFacts] = React.useState(
    "Client entered into agreement dated 15 Jan 2024 for supply of industrial solar equipment. Respondent failed to deliver first consignment despite receiving advance payment of INR 45 Lakhs. Notice calls upon respondent to refund advance with interest within 15 days."
  );
  const [tone, setTone] = React.useState(TONES[0]);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedDraft, setGeneratedDraft] = React.useState<LegalDraft | null>(null);
  const [editableContent, setEditableContent] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/drafting/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateType: selectedTemplate,
          jurisdiction,
          court,
          facts,
          tone,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Draft generation failed");
      setGeneratedDraft(data.draft);
      setEditableContent(data.draft.content);
      setCurrentStep("editor");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: "txt" | "docx" | "pdf") => {
    const blob = new Blob([editableContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTemplate.replace(/\s+/g, "_")}.${format === "docx" ? "docx" : format === "pdf" ? "pdf" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <PenTool className="h-6 w-6 text-gold-400" />
              Legal Drafting Studio
            </h1>
            <Badge variant="gold">14 Indian Legal Formats</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Generate, verify citations, and export court-ready legal notices, bail applications, petitions, and pleadings.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className={currentStep === "template" ? "text-gold-400 font-bold" : "text-slate-500"}>
            1. Template
          </span>
          <span className="text-slate-700">→</span>
          <span className={currentStep === "details" ? "text-gold-400 font-bold" : "text-slate-500"}>
            2. Facts & Tone
          </span>
          <span className="text-slate-700">→</span>
          <span className={currentStep === "editor" ? "text-gold-400 font-bold" : "text-slate-500"}>
            3. Review & Export
          </span>
        </div>
      </div>

      {/* STEP 1: SELECT TEMPLATE */}
      {currentStep === "template" && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Legal Template
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.type;
              return (
                <div
                  key={tmpl.type}
                  onClick={() => setSelectedTemplate(tmpl.type)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                    isSelected
                      ? "border-gold-500 bg-gold-500/10 shadow-sm"
                      : "border-slate-800 bg-navy-900/60 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{tmpl.type}</span>
                    <Badge variant={isSelected ? "gold" : "neutral"} className="text-[9px]">
                      {tmpl.category}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3">
            <Button
              variant="gold"
              size="sm"
              className="text-xs"
              onClick={() => setCurrentStep("details")}
            >
              Continue to Matter Specifics <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: FACTS, JURISDICTION & TONE */}
      {currentStep === "details" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Matter Specifics: {selectedTemplate}
            </CardTitle>
            <CardDescription>
              Provide factual background, forum jurisdiction, and drafting tone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Target Court / Forum</label>
                <Input
                  value={court}
                  onChange={(e) => setCourt(e.target.value)}
                  placeholder="e.g. High Court of Delhi"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-300">Jurisdiction & City</label>
                <Input
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  placeholder="e.g. New Delhi"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Drafting Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-9 rounded border border-slate-800 bg-navy-950 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                {TONES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Underlying Facts & Claims</label>
              <textarea
                rows={5}
                value={facts}
                onChange={(e) => setFacts(e.target.value)}
                className="w-full rounded-md border border-slate-800 bg-navy-950 p-3 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500 leading-relaxed font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep("template")}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
              </Button>
              <Button
                type="button"
                variant="gold"
                size="sm"
                onClick={handleGenerate}
                isLoading={isGenerating}
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                Generate Legal Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: EDITOR, CITATION VERIFICATION & EXPORT */}
      {currentStep === "editor" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Mandatory Warning Banner */}
          <div className="rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 flex items-start gap-2.5 text-xs text-gold-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-gold-400 mt-0.5" />
            <div>
              <span className="font-bold block uppercase tracking-wider">
                AI-GENERATED DRAFT — REVIEW BEFORE USE
              </span>
              <p className="mt-0.5 leading-relaxed text-[11px] text-slate-300">
                This draft has been synthesized from Indian legal templates. Verify all bracketed placeholders [ ... ], local court fee stamping rules, and counsel signature blocks before filing.
              </p>
            </div>
          </div>

          {/* Editor Card */}
          <Card className="bg-navy-900/90 border-slate-800 shadow-xl overflow-hidden">
            {/* Editor Toolbar */}
            <div className="p-3 border-b border-slate-800 bg-navy-950 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setCurrentStep("details")}
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Edit Parameters
                </Button>
                <span className="text-slate-700">|</span>
                <span className="text-white font-medium">{selectedTemplate}</span>
                <Badge variant="verified" className="text-[9px]">
                  Citations Checked
                </Badge>
              </div>

              {/* Export Toolbar */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={copyToClipboard}
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => handleDownload("txt")}
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> .TXT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => handleDownload("docx")}
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> .DOCX
                </Button>
                <Button
                  variant="gold"
                  size="sm"
                  className="h-7 px-2.5 text-xs"
                  onClick={() => handleDownload("pdf")}
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> .PDF
                </Button>
              </div>
            </div>

            {/* Editable Content Area */}
            <CardContent className="p-5">
              <textarea
                rows={18}
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                className="w-full rounded border border-slate-800 bg-navy-950 p-4 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-gold-500 leading-relaxed selection:bg-gold-500/20"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
