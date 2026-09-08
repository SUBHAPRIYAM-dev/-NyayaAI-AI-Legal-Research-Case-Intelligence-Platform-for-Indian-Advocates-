"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Building,
  Scale,
  Sliders,
  Sparkles,
  BookOpen,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const STEPS = [
  { id: 1, name: "Profile" },
  { id: 2, name: "Practice Areas" },
  { id: 3, name: "Preferred Courts" },
  { id: 4, name: "Research Preferences" },
  { id: 5, name: "Workspace" },
];

const COURTS = [
  "Supreme Court of India",
  "High Court of Delhi",
  "High Court of Bombay",
  "High Court of Karnataka",
  "High Court of Madras",
  "National Company Law Tribunal (NCLT / NCLAT)",
  "National Green Tribunal (NGT)",
  "Commercial Courts & City Civil Courts",
];

const LEGAL_AREAS = [
  "Substantive Criminal Law (BNS 2023)",
  "Criminal Procedure (BNSS 2023)",
  "Law of Evidence (BSA 2023)",
  "Commercial Arbitration & S. 34 / S. 37",
  "Insolvency & Bankruptcy Code (IBC)",
  "Constitutional Writs (Art. 226 / Art. 32)",
  "Intellectual Property & Patents",
  "Direct & Indirect Taxation (GST)",
  "Real Estate & RERA Consumer Protection",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [barNumber, setBarNumber] = React.useState("D/1482/2018");
  const [chamberName, setChamberName] = React.useState("Lex Indica Chambers");
  const [selectedCourts, setSelectedCourts] = React.useState<string[]>([
    "Supreme Court of India",
    "High Court of Delhi",
  ]);
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>([
    "Substantive Criminal Law (BNS 2023)",
    "Commercial Arbitration & S. 34 / S. 37",
  ]);
  const [citationFormat, setCitationFormat] = React.useState("SCC / SCC OnLine");
  const [historicalStatuteAlerts, setHistoricalStatuteAlerts] = React.useState(true);

  const toggleCourt = (court: string) => {
    setSelectedCourts((prev) =>
      prev.includes(court) ? prev.filter((c) => c !== court) : [...prev, court]
    );
  };

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleSkip = () => {
    router.push("/dashboard");
  };

  return (
    <Card className="terminal-border shadow-2xl bg-navy-900/90 backdrop-blur-md max-w-xl mx-auto">
      {/* Step Indicator Header */}
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
            Chambers Onboarding ({currentStep} of 5)
          </span>
          <button
            onClick={handleSkip}
            className="text-xs text-slate-400 hover:text-white hover:underline"
          >
            Skip for now
          </button>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                s.id <= currentStep ? "bg-gold-500" : "bg-navy-800"
              }`}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-6">
        {/* Step 1: Profile */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Chambers & Enrollment Verification</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure your Bar Council enrollment registration number and firm name.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Bar Enrollment Number</label>
                <Input
                  value={barNumber}
                  onChange={(e) => setBarNumber(e.target.value)}
                  placeholder="e.g. D/1482/2018 or MAH/512/2015"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Chambers / Firm Name</label>
                <Input
                  value={chamberName}
                  onChange={(e) => setChamberName(e.target.value)}
                  placeholder="e.g. Nariman & Partners Advocates"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Practice Areas */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Select Core Practice Domains</h3>
              <p className="text-xs text-slate-400 mt-1">
                NyayaAI will optimize its retrieval index and statutory cross-references for these disciplines.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {LEGAL_AREAS.map((area) => {
                const checked = selectedAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                      checked
                        ? "bg-gold-500/10 border-gold-500/50 text-white font-medium"
                        : "bg-navy-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs">{area}</span>
                    {checked && <Check className="h-4 w-4 text-gold-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Preferred Courts */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Primary Jurisdictions & Courts</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pin your frequent courts for automated cause list alerts and jurisdiction filters.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-2">
              {COURTS.map((court) => {
                const checked = selectedCourts.includes(court);
                return (
                  <button
                    key={court}
                    type="button"
                    onClick={() => toggleCourt(court)}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                      checked
                        ? "bg-gold-500/10 border-gold-500/50 text-white font-medium"
                        : "bg-navy-950/40 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xs">{court}</span>
                    {checked && <Check className="h-4 w-4 text-gold-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Research Preferences */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">AI Research & Citation Guardrails</h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure citation preferences and safety protections for modern criminal enactments.
              </p>
            </div>
            <div className="space-y-3 pt-2">
              <div className="rounded-lg border border-slate-800 p-3 bg-navy-950/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Modern Law Conversion Alerts</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Highlight historical IPC/CrPC citations and show corresponding BNS/BNSS 2023 equivalents.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={historicalStatuteAlerts}
                    onChange={(e) => setHistoricalStatuteAlerts(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 accent-gold-500"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 p-3 bg-navy-950/50">
                <label className="text-xs font-semibold text-white block mb-1">
                  Default Citation Reporter Standard
                </label>
                <select
                  value={citationFormat}
                  onChange={(e) => setCitationFormat(e.target.value)}
                  className="w-full h-9 rounded border border-slate-800 bg-navy-900 px-3 text-xs text-slate-200"
                >
                  <option>SCC / SCC OnLine</option>
                  <option>AIR (All India Reporter)</option>
                  <option>SCR (Supreme Court Reports)</option>
                  <option>DLT / Bom CR (High Court Reporters)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Workspace Ready */}
        {currentStep === 5 && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Chambers Workspace is Configured</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Loaded 22 fictional demonstration statutes, 22 landmark judgments, and your case intelligence matrix.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-navy-950/60 p-3 text-left text-xs space-y-1 max-w-sm mx-auto font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Chambers:</span>
                <span className="text-slate-200">{chamberName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Courts:</span>
                <span className="text-slate-200">{selectedCourts.length} selected</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>AI Engine:</span>
                <span className="text-gold-400 font-semibold">Demo AI Mode Active</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-slate-800 px-6 py-4">
        {currentStep > 1 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Back
          </Button>
        ) : (
          <div />
        )}

        <Button variant="gold" size="sm" onClick={handleNext} className="text-xs">
          {currentStep === 5 ? "Launch Dashboard" : "Continue"}
          <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
