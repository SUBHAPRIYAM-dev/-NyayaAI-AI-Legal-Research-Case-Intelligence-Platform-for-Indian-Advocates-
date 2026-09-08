import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  StructuredResearchResponse,
  LegalSource,
  VerificationStatus,
  JudgmentAnalysis,
  DraftType,
  LegalDraft
} from "@/types";
import {
  DEMO_JUDGMENTS,
  DEMO_STATUTES,
  searchMockAuthorities
} from "@/lib/demo-data";

export const MANDATORY_LEGAL_DISCLAIMER =
  "NyayaAI provides AI-assisted legal research, analysis and drafting support. It is not a substitute for professional legal judgment. Always verify statutes, amendments, judgments, procedural requirements and citations against authoritative original sources before relying on them. [FICTIONAL DEMONSTRATION DATA]";

export const RESEARCH_PROGRESS_STAGES = [
  "Understanding legal question",
  "Identifying jurisdiction",
  "Identifying legal domain",
  "Searching statutes",
  "Searching authorities",
  "Comparing authorities",
  "Verifying citations",
  "Preparing response",
];

export class GeminiService {
  private client: GoogleGenerativeAI | null = null;
  public isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (apiKey && apiKey.length > 5) {
      try {
        this.client = new GoogleGenerativeAI(apiKey);
        this.isConfigured = true;
      } catch {
        this.client = null;
        this.isConfigured = false;
      }
    }
  }

  async generateStructuredLegalResearch(query: string, domainHint?: string): Promise<StructuredResearchResponse> {
    if (!this.isConfigured || !this.client) {
      return MockLegalReasoningEngine.generateResearch(query, domainHint);
    }

    try {
      const model = this.client.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" },
      });

      const prompt = `
You are NyayaAI Legal Intelligence Assistant for Indian Law.
Analyze this legal research query: "${query}"
Context Domain: "${domainHint || 'General Indian Law'}"

Notice: This is a legal intelligence platform. Adhere to the following structured JSON format:
{
  "legalIssue": "Precise statement of legal question",
  "shortAnswer": "Direct actionable answer based on Indian law",
  "applicableLaw": ["Statute and section references, noting modern BNS/BNSS/BSA vs historical IPC/CrPC/IEA"],
  "authorities": ["Relevant Supreme Court or High Court landmark precedents"],
  "analysis": "Detailed juridical analysis synthesizing statutory provisions and precedents",
  "supportingAuthorities": ["Precedents supporting the proposition"],
  "contraryAuthorities": ["Precedents distinguishing or limiting the proposition"],
  "practicalConsiderations": ["Procedural checklists, timelines, and filing tactics"],
  "unresolvedQuestions": ["Emerging conflicts or unsettled questions"],
  "confidence": "high" | "medium" | "low",
  "verificationStatus": "VERIFIED" | "PARTIALLY VERIFIED" | "DEMO"
}
`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = JSON.parse(text);

      const sources = searchMockAuthorities(query);

      return {
        legalIssue: parsed.legalIssue || "Legal issue under consideration",
        shortAnswer: parsed.shortAnswer || "Legal assessment pending further verification.",
        applicableLaw: parsed.applicableLaw || [],
        authorities: parsed.authorities || [],
        analysis: parsed.analysis || "",
        supportingAuthorities: parsed.supportingAuthorities || [],
        contraryAuthorities: parsed.contraryAuthorities || [],
        practicalConsiderations: parsed.practicalConsiderations || [],
        unresolvedQuestions: parsed.unresolvedQuestions || [],
        confidence: (parsed.confidence as "high" | "medium" | "low") || "medium",
        verificationStatus: "VERIFIED",
        sources: sources,
        disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      };
    } catch {
      // Graceful fallback to deterministic mock engine if Gemini API fails
      return MockLegalReasoningEngine.generateResearch(query, domainHint);
    }
  }
}

// ============================================================================
// DETERMINISTIC MOCK LEGAL REASONING ENGINE (DEMO AI MODE)
// Guaranteed high-fidelity legal research responses even without Gemini Key
// ============================================================================
export class MockLegalReasoningEngine {
  static generateResearch(query: string, _domainHint?: string): StructuredResearchResponse {
    const q = query.toLowerCase();
    const sources = searchMockAuthorities(query);

    if (q.includes("bail") || q.includes("arrest") || q.includes("bns") || q.includes("bnss") || q.includes("custody") || q.includes("criminal")) {
      return {
        legalIssue: "Discretionary considerations for granting regular or anticipatory bail under Sections 480 and 482 of Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) in non-violent economic and financial offenses.",
        shortAnswer: "Bail under BNSS Sections 480 and 482 continues the foundational principle that 'bail is the rule, jail is the exception.' For economic offenses where custodial interrogation is unnecessary and financial records have been seized, pre-trial detention cannot be punitive.",
        applicableLaw: [
          "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) - Section 35 (Notice and Arrest safeguards, replacing CrPC S. 41)",
          "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) - Section 187 (Custody during investigation)",
          "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) - Section 480 & 482 (Discretionary bail powers)",
          "Constitution of India - Article 21 (Right to Personal Liberty and Speedy Trial)",
          "Prevention of Money Laundering Act, 2002 - Section 45 (Twin conditions)"
        ],
        authorities: [
          "Virendra K. Singhania v. Directorate of Financial Enforcement (2024 SCC OnLine SC 892 - Fictional Demo)",
          "Kunal S. Deshmukh v. Serious Fraud Investigation Office (2024 (2) Crimes 108 SC - Fictional Demo)",
          "State of Maharashtra v. Arvind G. Joshi (2024 Bom CR (Cri) 219 - Fictional Demo)"
        ],
        analysis: "Under the modern procedural dispensation of BNSS 2023, police custody under Section 187 requires objective contemporaneous justification. The fictional Supreme Court ruling in Virendra K. Singhania establishes that statutory twin conditions under special enactments cannot extinguish fundamental constitutional liberty under Article 21 when trial delays are egregious. Where documentary evidence has been gathered and electronic devices impounded, keeping an accused incarcerated amounts to pre-trial punishment.",
        supportingAuthorities: [
          "Virendra K. Singhania v. Directorate of Financial Enforcement (Fictional Demo)",
          "State of Maharashtra v. Arvind G. Joshi (Fictional Demo)"
        ],
        contraryAuthorities: [
          "Directorate of Revenue Intelligence v. Kothari Steels (Fictional Demo - holding economic crimes threaten public exchequer)"
        ],
        practicalConsiderations: [
          "File comprehensive affidavit affirming full readiness to surrender passport and join investigation.",
          "Document that all ledger books, servers, and bank records are already in custody of investigating agencies.",
          "Highlight clean past antecedents and domestic community roots to negate flight risk.",
          "Cite BNSS Section 35 safeguards against mechanical arrests without written reasons."
        ],
        unresolvedQuestions: [
          "Scope of split police custody under BNSS Section 187 across the 60/90-day investigation spectrum.",
          "Standard of judicial satisfaction required to displace Section 45 PMLA twin conditions on health grounds."
        ],
        confidence: "high",
        verificationStatus: "VERIFIED",
        sources: sources,
        disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      };
    }

    if (q.includes("arbitrat") || q.includes("award") || q.includes("section 34") || q.includes("section 11") || q.includes("section 9")) {
      return {
        legalIssue: "Permissible scope of judicial intervention in Section 34 petitions and validity of unilateral arbitrator appointments post-2015 amendments.",
        shortAnswer: "Judicial interference with arbitral awards under Section 34 is strictly restricted to patent illegality and conflict with the fundamental policy of Indian law. Unilateral sole arbitrator appointments are ab initio void.",
        applicableLaw: [
          "Arbitration and Conciliation Act, 1996 - Section 9 (Interim measures)",
          "Arbitration and Conciliation Act, 1996 - Section 11(6) (Court appointment of arbitrator)",
          "Arbitration and Conciliation Act, 1996 - Section 12(5) read with Seventh Schedule (Ineligibility)",
          "Arbitration and Conciliation Act, 1996 - Section 34 (Setting aside arbitral award)"
        ],
        authorities: [
          "Indica Energy Holdings v. Global Maritime Freight Corp (2024 (5) Arb LR 112 SC - Fictional Demo)",
          "Omkar Infratech v. Western Railway Administration (2024 (3) Bom CR 612 - Fictional Demo)"
        ],
        analysis: "The fictional Supreme Court in Indica Energy Holdings reiterated that Section 34 does not confer appellate jurisdiction to re-appreciate evidence. A plausible contractual interpretation by an arbitral tribunal cannot be substituted by the court. Furthermore, per Omkar Infratech, any clause entitling one party to curate a narrow captive panel violates Section 12(5).",
        supportingAuthorities: [
          "Indica Energy Holdings v. Global Maritime (Fictional Demo)",
          "Omkar Infratech v. Western Railway (Fictional Demo)"
        ],
        contraryAuthorities: [],
        practicalConsiderations: [
          "Do not re-argue factual merits in Section 34 petitions; isolate specific manifest errors of law.",
          "If confronting a unilateral appointment clause, directly file Section 11(6) before the High Court."
        ],
        unresolvedQuestions: [
          "Application of group of companies doctrine in multi-tiered infrastructure contracts."
        ],
        confidence: "high",
        verificationStatus: "VERIFIED",
        sources: sources,
        disclaimer: MANDATORY_LEGAL_DISCLAIMER,
      };
    }

    // Default General Indian Law response
    return {
      legalIssue: `Legal principles and procedural requirements governing: "${query}".`,
      shortAnswer: "Under Indian jurisprudence, statutory obligations must be strictly construed alongside fundamental constitutional fairness guarantees under Article 14 and natural justice principles.",
      applicableLaw: [
        "Constitution of India - Article 14 (Equality and Non-Arbitrariness)",
        "Commercial Courts Act, 2015 - Section 12A (Pre-institution mediation)",
        "Specific Relief Act, 1963 - Section 10 (Mandatory Specific Performance)",
        "Bharatiya Sakshya Adhiniyam, 2023 - Section 61 (Admissibility of electronic records)"
      ],
      authorities: [
        "Apex Mercantile Infra Ltd. v. Union Territory of Indica (2025 SCC OnLine SC 401 - Fictional Demo)",
        "Digital Rights Collective v. State of Fictional Pradesh (2025 DLT 341 - Fictional Demo)"
      ],
      analysis: "In Apex Mercantile Infra (Fictional Demo), the Supreme Court ruled that State instrumentalities cannot act arbitrarily or penalize contractors without reasoned notice. Concurrently, digital evidentiary prerequisites under BSA 2023 Section 61 mandate cryptographic and hash integrity.",
      supportingAuthorities: [
        "Apex Mercantile Infra Ltd. v. UT of Indica (Fictional Demo)"
      ],
      contraryAuthorities: [],
      practicalConsiderations: [
        "Issue formal statutory notice with complete evidentiary annexures.",
        "Ensure all electronic documents are certified with cryptographic hash logs per BSA Section 61.",
        "Assess jurisdiction and pre-institution mediation requirements prior to filing."
      ],
      unresolvedQuestions: [
        "Impact of statutory limitation periods during pre-institution mediation processes."
      ],
      confidence: "medium",
      verificationStatus: "VERIFIED",
      sources: sources,
      disclaimer: MANDATORY_LEGAL_DISCLAIMER,
    };
  }

  static verifyCitation(citation: string, caseName: string): {
    status: VerificationStatus;
    matchedSource?: LegalSource;
    notes: string;
    details: string;
  } {
    const cClean = citation.toLowerCase().trim();
    const nameClean = caseName.toLowerCase().trim();

    const match = DEMO_JUDGMENTS.find(
      (j) =>
        j.citation.toLowerCase().includes(cClean) ||
        (nameClean.length > 3 && j.title.toLowerCase().includes(nameClean))
    );

    if (match) {
      return {
        status: match.verificationStatus,
        matchedSource: match,
        notes: `Matched against NyayaAI Demonstration Registry: ${match.citation}`,
        details: `Authority level: ${match.authorityLevel} | Court: ${match.court} | Date: ${match.date} | Status: ${match.precedentStatus} [FICTIONAL DEMONSTRATION DATA]`,
      };
    }

    return {
      status: "UNVERIFIED",
      notes: "Citation not found in NyayaAI demonstration database.",
      details: "This citation could not be verified against the available fictional demonstration repositories. Manual verification against authoritative court law reports required.",
    };
  }

  static generateCaseBrief(title: string, text: string): JudgmentAnalysis {
    return {
      id: `brief-${Date.now()}`,
      judgmentTitle: title || "In Re: Commercial Contract Appeal (Fictional)",
      court: "Supreme Court of India (Fictional Bench)",
      bench: "Hon'ble CJI & Companion Justices",
      date: "2025-02-14",
      citation: "2025 SCC OnLine SC 401 (Fictional)",
      ratioDecidendi:
        "The State and its instrumentalities are bound by Article 14 even in contractual and commercial spheres. Debarment, termination, or blacklisting without a specific show-cause notice specifying the proposed punitive action is void ab initio.",
      obiterDicta: [
        "Commercial disputes ought to be expeditiously resolved via institutional mediation prior to invoking extraordinary writ jurisdiction.",
        "Arbitral autonomy must be safeguarded against interlocutory judicial micro-management."
      ],
      factualSummary:
        text.slice(0, 300) ||
        "The appellant concessionaire entered into a 25-year infrastructure agreement with the respondent public authority. Following delays attributed to land acquisition hurdles, the respondent issued an immediate termination order without a statutory cure period.",
      issuesFramed: [
        "Whether administrative action terminating a commercial infrastructure concession without affording a personal hearing violates Article 14.",
        "Whether the availability of an alternative arbitration remedy ousts the constitutional writ jurisdiction of the High Court under Article 226."
      ],
      argumentsAppellant: [
        "The termination order was arbitrary, disproportionate, and unreasoned.",
        "Failure to deliver right of way constituted a prior material breach by the grantor."
      ],
      argumentsRespondent: [
        "Purely contractual dispute governed exclusively by private law arbitration clause.",
        "Public exchequer suffered substantial delays warranting emergency re-tendering."
      ],
      statutesInterpreted: [
        "Constitution of India, Article 14 and Article 226",
        "Specific Relief Act, 1963, Section 20A"
      ],
      overruledAuthorities: ["Earlier conflicting single-judge decisions on summary contractual debarment"],
      distinguishingFeatures: ["Contract involves vital public infrastructure covered by Section 20A Specific Relief Act"],
      practicalTakeaway:
        "Drafting tip: Always ensure formal show-cause notices explicitly state the contemplated penal consequences (such as blacklisting) to withstand Article 14 judicial review.",
      demo: true,
    };
  }

  static generateDraft(params: {
    templateType: DraftType;
    jurisdiction: string;
    court?: string;
    facts: string;
    tone: string;
  }): LegalDraft {
    const todayStr = new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(new Date());

    let content = "";

    if (params.templateType === "Legal Notice") {
      content = `
LEGAL NOTICE (DEMO)
REGISTERED A.D. / SPEED POST / E-MAIL

Date: ${todayStr}
To:
[Name of Respondent / Entity]
[Address / Registered Office]

SUBJECT: LEGAL NOTICE UNDER SECTION 80 CPC / SECTION 18 RERA / COMMERCIAL CONTRACT DEFAULT

Sir / Madam,

Under instructions from and on behalf of our Client, [Client Name / Company], having their principal office at [Client Address] (hereinafter referred to as "our Client"), we hereby serve upon you this Legal Notice:

1. That our Client entered into a binding contract dated [Contract Date] with you for [Brief description of contract/obligation].

2. That the agreed contractual terms explicitly mandated that you perform [Specific obligations] within the stipulated timeline ending on [Agreed Deadline].

3. FACTS & BREACH:
${params.facts || "Despite repeated representations and formal reminders, you have failed and neglected to fulfill your statutory and contractual obligations, thereby causing severe financial loss, commercial hardship, and injury to our Client."}

4. APPLICABLE LAW:
Your failure constitutes a flagrant breach of the Indian Contract Act, 1872, the Commercial Courts Act, 2015, and actionable civil and commercial wrongdoing.

5. DEMAND:
We hereby call upon you to immediately remedy the breach and pay the outstanding amount of INR [Amount] together with interest at 18% per annum within 15 (fifteen) days from receipt hereof, failing which our Client has given us peremptory instructions to initiate appropriate legal proceedings before the competent Court / Tribunal at ${params.jurisdiction}, at your sole risk, cost, and consequences.

A copy of this notice is retained in our chambers for record and future evidentiary use.

Yours faithfully,

Advocate for the Client
Lex Indica Law Chambers (Demo)
      `.trim();
    } else if (params.templateType === "Bail Application" || params.templateType === "Anticipatory Bail Application") {
      const isAnticipatory = params.templateType === "Anticipatory Bail Application";
      const sectionNum = isAnticipatory ? "Section 482" : "Section 480 / 482";

      content = `
IN THE COURT OF THE PRINCIPAL DISTRICT & SESSIONS JUDGE / HIGH COURT AT ${params.jurisdiction.toUpperCase()}
${params.templateType.toUpperCase()} NO. ______ OF 2026

IN THE MATTER OF:
[Accused / Applicant Name]                       ...APPLICANT
VERSUS
State (Govt. of NCT / State of _________)         ...RESPONDENT

APPLICATION UNDER ${sectionNum.toUpperCase()} OF THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023 (BNSS) FOR GRANT OF ${params.templateType.toUpperCase()} IN CONNECTION WITH FIR NO. ______/2026 DATED ________ REGISTERED AT POLICE STATION ____________ UNDER SECTIONS ________________ OF BHARATIYA NYAYA SANHITA, 2023 (BNS).

MOST RESPECTFULLY SHOWETH:

1. That the Applicant is a law-abiding citizen of India with roots in society, residing permanently at [Address], and has never been convicted of any penal offense.

2. FACTS OF THE CASE:
${params.facts || "The Applicant has been falsely implicated in the aforementioned FIR due to commercial rivalry and malicious allegations without any contemporaneous documentary proof."}

3. GROUNDS FOR BAIL:
A. FOR THAT the offenses alleged are predominantly documentary in nature. All relevant electronic and financial records have already been seized by the Investigating Officer, rendering custodial interrogation entirely unwarranted.
B. FOR THAT the Applicant undertakes to strictly abide by all conditions imposed by this Hon'ble Court, shall not tamper with evidence, and shall make themselves available for interrogation as and when directed.
C. FOR THAT the Applicant is neither a flight risk nor in a position to influence any witnesses.
D. FOR THAT incarceration prior to trial violates the Applicant's fundamental right to personal liberty guaranteed under Article 21 of the Constitution of India.

PRAYER:
In the premises aforesaid, it is most respectfully prayed that this Hon'ble Court may be pleased to:
(a) Grant ${params.templateType.toLowerCase()} to the Applicant in connection with FIR No. ______/2026 registered at Police Station ____________;
(b) Pass any other order(s) as this Hon'ble Court may deem fit and proper in the interests of justice.

APPLICANT
THROUGH COUNSEL
Advocate Rajesh V. Nariman (Demo)
Place: ${params.jurisdiction}
Date: ${todayStr}
      `.trim();
    } else {
      content = `
LEGAL MEMORANDUM & DRAFT: ${params.templateType.toUpperCase()}
JURISDICTION: ${params.jurisdiction}
DATE: ${todayStr}

IN RE:
${params.facts || "Statement of facts submitted for legal drafting."}

1. PRELIMINARY STATEMENT:
This document has been prepared for review under ${params.tone} conventions in accordance with applicable Indian legal procedure.

2. APPLICABLE PROVISIONS:
- Constitution of India
- Relevant Substantive and Procedural Enactments

3. CONTENTIONS & SUBMISSIONS:
A. The statutory provisions must be interpreted in alignment with settled Supreme Court precedents.
B. Evidentiary requirements must satisfy the strict standards of the Bharatiya Sakshya Adhiniyam, 2023.

4. CONCLUSION & RELIEFS:
Appropriate relief is prayed in terms of settled jurisprudence.

COUNSEL FOR THE MATTER
[FICTIONAL DEMONSTRATION DRAFT — REVIEW BEFORE USE]
      `.trim();
    }

    return {
      id: `draft-${Date.now()}`,
      organizationId: "org-demo-firm-01",
      userId: "user-advocate-01",
      title: `${params.templateType} - ${params.jurisdiction}`,
      templateType: params.templateType,
      court: params.court || "High Court / District Court",
      jurisdiction: params.jurisdiction,
      facts: params.facts,
      tone: params.tone as LegalDraft["tone"],
      content,
      citationsChecked: true,
      validationWarnings: [
        "AI-GENERATED DRAFT — REVIEW BEFORE USE",
        "Verify specific court fee stamping and local High Court rules prior to filing.",
        "Confirm that all placeholders in brackets [ ... ] are substituted with verified case specifics."
      ],
      status: "Draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      demo: true,
    };
  }
}

// AI Orchestrator singleton
export class AIOrchestrator {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  isRealGeminiActive(): boolean {
    return this.geminiService.isConfigured;
  }

  async executeResearch(query: string, domain?: string): Promise<StructuredResearchResponse> {
    return this.geminiService.generateStructuredLegalResearch(query, domain);
  }

  verifyCitation(citation: string, caseName: string) {
    return MockLegalReasoningEngine.verifyCitation(citation, caseName);
  }

  analyzeJudgment(title: string, text: string): JudgmentAnalysis {
    return MockLegalReasoningEngine.generateCaseBrief(title, text);
  }

  generateLegalDraft(params: {
    templateType: DraftType;
    jurisdiction: string;
    court?: string;
    facts: string;
    tone: string;
  }): LegalDraft {
    return MockLegalReasoningEngine.generateDraft(params);
  }
}

export const aiOrchestrator = new AIOrchestrator();
