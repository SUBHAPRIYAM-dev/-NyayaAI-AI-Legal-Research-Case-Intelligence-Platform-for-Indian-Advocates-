"use client";

import * as React from "react";
import {
  Settings,
  User,
  Shield,
  Sliders,
  Bell,
  CheckCircle2,
  Lock,
  Key,
  Globe,
  Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<"profile" | "security" | "preferences" | "notifications">("profile");

  // Profile state
  const [name, setName] = React.useState("Adv. Rajesh V. Nariman");
  const [email, setEmail] = React.useState("demo.advocate@nyayaai.test");
  const [role, setRole] = React.useState("Partner");
  const [state, setState] = React.useState("Delhi NCR");
  const [practiceAreas, setPracticeAreas] = React.useState("Constitutional Law, Criminal Law (BNSS), Arbitration");

  // Preferences
  const [defaultCourt, setDefaultCourt] = React.useState("Supreme Court of India");
  const [citationFormat, setCitationFormat] = React.useState("SCC / SCC OnLine");
  const [savedMsg, setSavedMsg] = React.useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg("Settings updated successfully!");
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-gold-400" />
          Chambers & Advocate Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, authentication credentials, and research defaults.
        </p>
      </div>

      {savedMsg && (
        <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs gap-2">
        {[
          { id: "profile", label: "Advocate Profile", icon: User },
          { id: "security", label: "Security & MFA", icon: Shield },
          { id: "preferences", label: "Research Preferences", icon: Sliders },
          { id: "notifications", label: "Notifications", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-gold-500 text-gold-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === "profile" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm">Personal & Chambers Information</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={handleSave} className="space-y-4 text-xs max-w-lg">
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Full Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Email Address</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Role</label>
                  <Input value={role} disabled />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-slate-300">Bar State</label>
                  <Input value={state} onChange={(e) => setState(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-medium text-slate-300">Practice Areas</label>
                <Input
                  value={practiceAreas}
                  onChange={(e) => setPracticeAreas(e.target.value)}
                />
              </div>
              <Button type="submit" variant="gold" size="sm" className="mt-2">
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: SECURITY */}
      {activeTab === "security" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm">Authentication & Session Security</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs max-w-lg">
            <div className="p-3 rounded border border-slate-800 bg-navy-950 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Multi-Factor Authentication (MFA)</span>
                <Badge variant="gold">MFA Ready</Badge>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Add an extra layer of protection to your chambers research vault using TOTP authenticator apps.
              </p>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Configure Authenticator
              </Button>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="font-semibold text-white">Change Password</h4>
              <div className="space-y-2">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password (min 12 chars)" />
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button variant="gold" size="sm" className="mt-1" onClick={handleSave}>
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: PREFERENCES */}
      {activeTab === "preferences" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm">Research Defaults & Reporting Standard</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs max-w-lg">
            <div className="space-y-1">
              <label className="font-medium text-slate-300">Default Primary Court</label>
              <select
                value={defaultCourt}
                onChange={(e) => setDefaultCourt(e.target.value)}
                className="w-full h-9 rounded border border-slate-800 bg-navy-950 px-3 text-xs text-white"
              >
                <option>Supreme Court of India</option>
                <option>High Court of Delhi</option>
                <option>High Court of Bombay</option>
                <option>High Court of Karnataka</option>
                <option>National Company Law Tribunal (NCLT)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-slate-300">Default Citation Format</label>
              <select
                value={citationFormat}
                onChange={(e) => setCitationFormat(e.target.value)}
                className="w-full h-9 rounded border border-slate-800 bg-navy-950 px-3 text-xs text-white"
              >
                <option>SCC / SCC OnLine</option>
                <option>AIR (All India Reporter)</option>
                <option>SCR (Supreme Court Reports)</option>
              </select>
            </div>

            <Button variant="gold" size="sm" onClick={handleSave}>
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <Card className="bg-navy-900/80 border-slate-800 animate-in fade-in">
          <CardHeader className="pb-3 border-b border-slate-800">
            <CardTitle className="text-sm">Alert Preferences</CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-3 text-xs max-w-lg">
            {[
              "Cause list hearing alerts (24 hours prior)",
              "Citation status updates (if precedent overruled)",
              "Document OCR and virus indexing completed",
              "Chambers colleague shared new research memorandum",
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded bg-navy-950 border border-slate-800">
                <span className="text-slate-300">{pref}</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-slate-700 accent-gold-500"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
