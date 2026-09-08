"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Scale, Lock, Mail, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("nyayaai_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: "advocate" | "admin") => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          demoRole: role,
          email: role === "admin" ? "demo.admin@nyayaai.test" : "demo.advocate@nyayaai.test",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Demo login failed");

      localStorage.setItem("nyayaai_user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Demo login failed");
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
        <CardTitle className="text-xl justify-center">Welcome to NyayaAI</CardTitle>
        <CardDescription>
          Sign in to access your AI legal research and case workspace
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Demo Logins */}
        <div className="rounded-lg border border-gold-500/20 bg-gold-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" /> One-Click Demo Access
            </span>
            <Badge variant="gold" className="text-[9px] py-0 px-1">
              Sandbox
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleDemoLogin("advocate")}
              isLoading={loading}
            >
              Demo Advocate
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="text-xs border-slate-700"
              onClick={() => handleDemoLogin("admin")}
              isLoading={loading}
            >
              Demo Firm Admin
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-navy-900 px-2 text-[10px] uppercase text-slate-400 font-mono tracking-wider">
            or standard sign in
          </span>
        </div>

        {error && (
          <div className="rounded bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-400 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Official Email
            </label>
            <Input
              type="email"
              placeholder="advocate@barcouncil.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-gold-400 hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <Button type="submit" variant="gold" className="w-full mt-4" isLoading={loading}>
            Sign In to Workspace <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 pt-4 pb-4">
        <p className="text-xs text-slate-400">
          New to NyayaAI?{" "}
          <Link href="/register" className="text-gold-400 hover:underline font-medium">
            Register your chambers
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
