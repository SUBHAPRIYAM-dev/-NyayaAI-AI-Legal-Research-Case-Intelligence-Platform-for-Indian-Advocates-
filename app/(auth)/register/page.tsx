"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, User, Mail, Lock, MapPin, Briefcase, ArrowRight, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ProfessionalCategory } from "@/types";

const ROLES: ProfessionalCategory[] = [
  "Advocate",
  "Law Student",
  "Legal Researcher",
  "Corporate Legal",
  "Law Firm Admin",
  "Other"
];

const STATES = [
  "Delhi NCR",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "West Bengal",
  "Gujarat",
  "Uttar Pradesh",
  "Other Jurisdiction"
];

const POPULAR_PRACTICE_AREAS = [
  "Constitutional Law",
  "Criminal Law (BNS/BNSS)",
  "Commercial Arbitration",
  "Corporate & IBC",
  "Intellectual Property",
  "Direct & Indirect Tax",
  "Real Estate & RERA",
  "Cyber Law & Data Privacy"
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [category, setCategory] = React.useState<ProfessionalCategory>("Advocate");
  const [state, setState] = React.useState("Delhi NCR");
  const [selectedAreas, setSelectedAreas] = React.useState<string[]>(["Constitutional Law", "Criminal Law (BNS/BNSS)"]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      setSelectedAreas(selectedAreas.filter((a) => a !== area));
    } else {
      setSelectedAreas([...selectedAreas, area]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          category,
          state,
          practiceAreas: selectedAreas,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      localStorage.setItem("nyayaai_user", JSON.stringify(data.user));
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="terminal-border shadow-2xl bg-navy-900/90 backdrop-blur-md">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
          <Scale className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl justify-center">Create Chambers Profile</CardTitle>
        <CardDescription>
          Access verified Indian legal intelligence and AI case management
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="rounded bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-400 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Full Legal Name</label>
            <Input
              type="text"
              placeholder="Adv. Vikramaditya Sen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Official Email</label>
            <Input
              type="email"
              placeholder="vikram@senchambers.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Role</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProfessionalCategory)}
                className="w-full h-10 rounded-md border border-slate-800 bg-navy-900 px-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Primary State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-10 rounded-md border border-slate-800 bg-navy-900 px-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-gold-500"
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-slate-300">Practice Areas</label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_PRACTICE_AREAS.map((area) => {
                const selected = selectedAreas.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`text-[11px] px-2 py-1 rounded border transition-all ${
                      selected
                        ? "bg-gold-500/20 text-gold-300 border-gold-500/50 font-medium"
                        : "bg-navy-950/60 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" variant="gold" className="w-full mt-4" isLoading={loading}>
            Create Profile & Continue <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 pt-4 pb-4">
        <p className="text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-gold-400 hover:underline font-medium">
            Sign in to existing account
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
