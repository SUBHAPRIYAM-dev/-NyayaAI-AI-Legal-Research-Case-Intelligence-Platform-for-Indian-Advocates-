"use client";

import * as React from "react";
import Link from "next/link";
import {
  Scale,
  Search,
  CheckCircle2,
  FileText,
  Briefcase,
  PenTool,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  ChevronRight,
  Lock,
  Database,
  Cpu,
  HelpCircle,
  Clock,
  Layers,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [activeWorkflowStage, setActiveWorkflowStage] = React.useState(0);

  const workflowStages = [
    { title: "Query Input", subtitle: "Analyze legal issues in fact pattern...", icon: Search },
    { title: "Understanding Issue", subtitle: "Parsing BNS/BNSS statutory jurisdiction...", icon: Cpu },
    { title: "Searching Authorities", subtitle: "Querying Supreme Court & High Court rulings...", icon: Database },
    { title: "Verifying Citations", subtitle: "Cross-referencing Good Law precedent registry...", icon: CheckCircle2 },
    { title: "Generating Brief", subtitle: "Synthesizing structured legal memorandum...", icon: FileText },
  ];

  // Subtle cyclic animation for Hero Workflow
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStage((prev) => (prev + 1) % workflowStages.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [workflowStages.length]);

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-gold-500/20 selection:text-gold-300">
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-navy-950/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-md">
            <Scale className="h-5 w-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-wider text-white">
              NYAYA<span className="text-gold-400">AI</span>
            </span>
            <span className="text-[10px] text-slate-400 tracking-tight -mt-0.5">
              Legal Intelligence • India
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-300">
          <a href="#research" className="hover:text-gold-400 transition-colors">AI Research</a>
          <a href="#judgment-intelligence" className="hover:text-gold-400 transition-colors">Judgment Intelligence</a>
          <a href="#citations" className="hover:text-gold-400 transition-colors">Citation Verification</a>
          <a href="#case-intelligence" className="hover:text-gold-400 transition-colors">Case Management</a>
          <a href="#drafting" className="hover:text-gold-400 transition-colors">Drafting Studio</a>
          <a href="#pricing" className="hover:text-gold-400 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-gold-400 transition-colors">FAQ</a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="gold" size="sm" className="text-xs">
              Get Started <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gold-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-xs font-semibold text-gold-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>LEGAL INTELLIGENCE • BUILT FOR INDIA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            The AI Legal Research Engine <br />
            <span className="gold-gradient-text">Built for Indian Law</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Research Indian law, analyze landmark judgments, verify citations against precedent registries, and prepare precision legal drafts from one intelligent workspace.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link href="/research">
              <Button variant="gold" size="lg" className="text-sm">
                Start Legal Research <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="secondary" size="lg" className="text-sm">
                Explore Platform Demo
              </Button>
            </Link>
          </div>

          {/* 3. HERO ANIMATED WORKFLOW STAGES */}
          <div className="mt-14 max-w-3xl mx-auto rounded-xl border border-slate-800 bg-navy-900/90 p-5 shadow-2xl backdrop-blur-md text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs font-mono text-slate-400 ml-2">
                  NyayaAI Autonomous RAG Orchestrator
                </span>
              </div>
              <Badge variant="gold" className="text-[10px]">
                Active Verification Pipeline
              </Badge>
            </div>

            {/* Workflow Progress Steps */}
            <div className="grid grid-cols-5 gap-2">
              {workflowStages.map((step, idx) => {
                const isCurrent = activeWorkflowStage === idx;
                const isDone = activeWorkflowStage > idx;
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className={`rounded-lg p-2.5 border transition-all duration-300 ${
                      isCurrent
                        ? "border-gold-500 bg-gold-500/15 shadow-md shadow-gold-500/10"
                        : isDone
                        ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300"
                        : "border-slate-800 bg-navy-950/60 text-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`h-3.5 w-3.5 ${isCurrent ? "text-gold-400 animate-pulse" : isDone ? "text-emerald-400" : "text-slate-500"}`} />
                      <span className={`text-[11px] font-semibold truncate ${isCurrent ? "text-white" : ""}`}>
                        {step.title}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-400 line-clamp-2 leading-tight">
                      {step.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Simulated Stream Output */}
            <div className="mt-4 rounded-lg bg-navy-950 p-3.5 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-2 text-gold-400">
                <Scale className="h-3.5 w-3.5" />
                <span className="font-semibold">Current Matter:</span>
                <span className="text-slate-300">Anticipatory Bail under BNSS Section 482</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ✓ Identified applicable statutes: Bharatiya Nagarik Suraksha Sanhita, 2023 & Article 21
                <br />
                ✓ Verified precedent authority: 2024 SCC OnLine SC 892 (Good Law)
                <br />
                ✓ Ratio extracted: Pre-trial detention cannot be punitive in documentary offenses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUST & INDIAN JURISPRUDENCE METRICS */}
      <section className="border-y border-slate-800/80 bg-navy-900/40 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-gold-400 font-mono">100%</span>
            <p className="text-xs text-slate-300 font-medium">BNS, BNSS & BSA 2023</p>
            <p className="text-[11px] text-slate-400">Full Modern & Historical Law Mapping</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-white font-mono">0</span>
            <p className="text-xs text-slate-300 font-medium">Hallucinated Citations</p>
            <p className="text-[11px] text-slate-400">Strict Precedent Grounding Engine</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-gold-400 font-mono">14+</span>
            <p className="text-xs text-slate-300 font-medium">Indian Drafting Templates</p>
            <p className="text-[11px] text-slate-400">Notices, Petitions, Bails & Written Arguments</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-extrabold text-white font-mono">Enterprise</span>
            <p className="text-xs text-slate-300 font-medium">Chambers RBAC</p>
            <p className="text-[11px] text-slate-400">Multi-tenant Law Firm Workspaces</p>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (RETRIEVE -> VERIFY -> ANALYZE -> CITE -> REVIEW) */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400">
            Methodology
          </span>
          <h2 className="text-3xl font-bold text-white">
            The Five Pillars of NyayaAI Intelligence
          </h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Unlike generic AI chat models, NyayaAI enforces strict verification guardrails designed specifically for the rigorous demands of Indian legal practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Retrieve",
              desc: "Deep search across Central Acts, State Acts, and High Court & Supreme Court authorities.",
              icon: Database,
            },
            {
              step: "02",
              title: "Verify",
              desc: "Automated precedent health check validating whether rulings remain Good Law or Overruled.",
              icon: CheckCircle2,
            },
            {
              step: "03",
              title: "Analyze",
              desc: "Isolate precise Ratio Decidendi from Obiter Dicta and distinguish factual matrices.",
              icon: Cpu,
            },
            {
              step: "04",
              title: "Cite",
              desc: "Format compliant citations across SCC, AIR, SCR, and official law report conventions.",
              icon: BookOpen,
            },
            {
              step: "05",
              title: "Review",
              desc: "Generate court-ready arguments and drafts with mandatory professional human review flags.",
              icon: PenTool,
            },
          ].map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.step}
                className="rounded-xl border border-slate-800 bg-navy-900/60 p-5 hover:border-gold-500/40 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-gold-400">
                    {pillar.step}
                  </span>
                  <Icon className="h-4 w-4 text-slate-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. CORE FEATURE SHOWCASES */}
      <section id="research" className="py-16 px-6 border-t border-slate-800/80 bg-navy-900/30">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Feature 1: AI Legal Research */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <Badge variant="gold">Flagship Intelligence</Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                3-Column Legal Research Workspace
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Formulate complex questions in plain language or fact patterns. Our AI orchestrator decomposes legal issues, cross-references statutes, and returns structured legal briefs with supporting and contrary authorities.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Clear distinction between BNS/BNSS/BSA and historical IPC/CrPC</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Structured outputs with Ratio Decidendi and practical filing considerations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Dedicated source panel with verified legal authority levels</span>
                </li>
              </ul>
              <Link href="/research" className="inline-block pt-2">
                <Button variant="outline" size="sm">
                  Launch Research Engine <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>

            <div className="rounded-xl border border-slate-800 bg-navy-950 p-5 shadow-xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-gold-400">RESEARCH_OUTPUT.JSON</span>
                <span className="text-[10px] text-emerald-400">VERIFIED</span>
              </div>
              <div className="space-y-2 text-[11px] text-slate-300">
                <p><span className="text-slate-500">issue:</span> &quot;Bail discretion under BNSS Section 480/482 in economic offenses&quot;</p>
                <p><span className="text-slate-500">ratio:</span> &quot;Pre-trial custody cannot be punitive when records are seized.&quot;</p>
                <p><span className="text-slate-500">authority:</span> &quot;2024 SCC OnLine SC 892 (Good Law)&quot;</p>
                <p><span className="text-slate-500">disclaimer:</span> &quot;FICTIONAL DEMONSTRATION RECORD&quot;</p>
              </div>
            </div>
          </div>

          {/* Feature 2: Citation Checker */}
          <div id="citations" className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl border border-slate-800 bg-navy-950 p-5 shadow-xl space-y-3 font-mono text-xs order-2 lg:order-1">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-gold-400">CITATION_VERIFIER</span>
                <span className="text-[10px] text-emerald-400">MATCH FOUND</span>
              </div>
              <div className="space-y-2 text-[11px] text-slate-300">
                <div className="p-2 rounded bg-navy-900 border border-slate-800">
                  <p className="font-semibold text-white">2025 SCC OnLine SC 401</p>
                  <p className="text-slate-400 text-[10px]">Apex Mercantile Infra v. UT Indica</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="verified">VERIFIED</Badge>
                    <Badge variant="neutral">Supreme Court</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 order-1 lg:order-2">
              <Badge variant="gold">Precedent Integrity</Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Deterministic Citation Verifier
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eliminate the existential risk of fake AI citations in your court pleadings. NyayaAI tests every citation against verified court registers and flags unverified or overruled authorities instantly.
              </p>
              <Link href="/citation-checker" className="inline-block pt-2">
                <Button variant="outline" size="sm">
                  Test Citation Checker <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING SECTION */}
      <section id="pricing" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <Badge variant="gold">Chambers & Firm Plans</Badge>
          <h2 className="text-3xl font-bold text-white">
            Transparent Pricing for Indian Practitioners
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All plans include access to the core Indian legal database and citation verification. (Demo pricing shown)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: "Free Starter",
              price: "₹0",
              period: "/month",
              desc: "For law students and independent researchers testing the platform.",
              queries: "10 Research Queries",
              badge: "Free",
              btnVariant: "outline" as const,
              action: "Start Free",
            },
            {
              name: "Advocate",
              price: "₹999",
              period: "/month",
              desc: "For individual advocates appearing before High Courts and District Courts.",
              queries: "500 Research Queries",
              badge: "Popular",
              btnVariant: "gold" as const,
              action: "Choose Advocate",
            },
            {
              name: "Professional",
              price: "₹2,499",
              period: "/month",
              desc: "For senior counsels and active litigation chambers managing high case volume.",
              queries: "2,000 Research Queries",
              badge: "Recommended",
              btnVariant: "secondary" as const,
              action: "Choose Professional",
            },
            {
              name: "Law Firm",
              price: "Custom",
              period: "",
              desc: "For full-service firms requiring multi-tenant RBAC, custom RAG, and API access.",
              queries: "Unlimited Queries",
              badge: "Enterprise",
              btnVariant: "outline" as const,
              action: "Contact Chambers",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                plan.name === "Advocate"
                  ? "border-gold-500 bg-navy-900/90 shadow-xl shadow-gold-500/5 relative"
                  : "border-slate-800 bg-navy-900/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{plan.name}</h3>
                  <Badge variant={plan.name === "Advocate" ? "gold" : "neutral"}>
                    {plan.badge}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{plan.desc}</p>
                <div className="rounded bg-navy-950/80 p-2 border border-slate-800 text-xs text-gold-400 font-mono mb-4 text-center">
                  {plan.queries}
                </div>
              </div>

              <Link href="/billing">
                <Button variant={plan.btnVariant} size="sm" className="w-full text-xs">
                  {plan.action}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-16 px-6 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-400">Everything you need to know about NyayaAI</p>
        </div>

        <div className="space-y-3 text-xs">
          {[
            {
              q: "How does NyayaAI prevent hallucinated citations in court pleadings?",
              a: "NyayaAI utilizes a strict Retrieve → Verify pipeline. The AI engine is decoupled from memory generation: every citation must match a ground-truth authority record in the database, or it is explicitly flagged as UNVERIFIED.",
            },
            {
              q: "Does NyayaAI support the modern 2023 criminal laws (BNS, BNSS, BSA)?",
              a: "Yes. NyayaAI features native architectural support for the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), providing automated cross-references with historical IPC, CrPC, and IEA provisions.",
            },
            {
              q: "Is NyayaAI affiliated with the Supreme Court or Government of India?",
              a: "No. NyayaAI is an independent, fictional legal intelligence demonstration platform. It does not represent or hold affiliation with the Supreme Court of India, Bar Council of India, or any statutory body.",
            },
            {
              q: "Can this prototype be run locally without external cloud dependencies?",
              a: "Yes. NyayaAI features a zero-dependency in-memory/file fallback engine with pre-seeded demonstration cases, judgments, and statutes that run instantly on any local development machine.",
            },
          ].map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-800 bg-navy-900/60 p-4 space-y-1.5">
              <h4 className="font-semibold text-white text-sm">{item.q}</h4>
              <p className="text-slate-400 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="py-20 px-6 bg-gradient-to-b from-navy-900/40 to-navy-950 border-t border-slate-800">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Scale className="h-10 w-10 text-gold-400 mx-auto" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Elevate Your Legal Intelligence Today
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join advocates, law chambers, and corporate legal departments across India using NyayaAI for faster research and verified citations.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/register">
              <Button variant="gold" size="lg" className="text-xs font-bold">
                Create Chambers Account <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="text-xs">
                Demo Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. COMPREHENSIVE FOOTER */}
      <footer className="border-t border-slate-800/80 bg-navy-950 py-12 px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-gold-500 text-navy-950 font-bold text-xs">
                N
              </div>
              <span className="font-bold text-white tracking-wider">NYAYAAI</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Research. Analyze. Verify. Draft. The dedicated AI legal intelligence engine built for Indian law.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200">Intelligence</span>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li><Link href="/research" className="hover:text-gold-400">AI Legal Research</Link></li>
              <li><Link href="/citation-checker" className="hover:text-gold-400">Citation Verifier</Link></li>
              <li><Link href="/judgment-analyzer" className="hover:text-gold-400">Judgment Analyzer</Link></li>
              <li><Link href="/case-strategy" className="hover:text-gold-400">Case Strategy</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200">Chambers</span>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li><Link href="/cases" className="hover:text-gold-400">Case Management</Link></li>
              <li><Link href="/documents" className="hover:text-gold-400">Document Vault</Link></li>
              <li><Link href="/drafting" className="hover:text-gold-400">Legal Drafting</Link></li>
              <li><Link href="/firm" className="hover:text-gold-400">Firm Workspace</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="font-semibold text-slate-200">Platform</span>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li><Link href="/billing" className="hover:text-gold-400">Pricing & Plans</Link></li>
              <li><Link href="/admin" className="hover:text-gold-400">Admin Console</Link></li>
              <li><Link href="/settings" className="hover:text-gold-400">Security & Preferences</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 NyayaAI Inc. All rights reserved. FICTIONAL DEMONSTRATION PLATFORM.</p>
          <p className="text-slate-400 max-w-md text-right leading-tight">
            Not affiliated with Supreme Court of India, Bar Council of India, or any official court.
          </p>
        </div>
      </footer>
    </div>
  );
}
