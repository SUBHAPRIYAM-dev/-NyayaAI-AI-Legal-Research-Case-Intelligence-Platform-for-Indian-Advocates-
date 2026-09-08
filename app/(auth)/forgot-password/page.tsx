"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <Card className="terminal-border shadow-2xl bg-navy-900/90 backdrop-blur-md">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
          <Scale className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl justify-center">Reset Password</CardTitle>
        <CardDescription>
          Enter your registered advocate email to receive recovery instructions
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <div className="text-center p-4 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">Instructions Dispatched</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If an account is associated with <span className="text-gold-300 font-mono">{email}</span>, a secure password reset link has been dispatched. (Demo simulated)
            </p>
            <Link href="/login" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Registered Email</label>
              <Input
                type="email"
                placeholder="advocate@barcouncil.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                required
              />
            </div>

            <Button type="submit" variant="gold" className="w-full" isLoading={loading}>
              Send Reset Link
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="justify-center border-t border-slate-800/80 pt-4 pb-4">
        <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
        </Link>
      </CardFooter>
    </Card>
  );
}
