# NYAYAAI: Complete Platform Architecture, User Guide & Feature Manual

**AI-Powered Indian Legal Intelligence Platform**  
*Tagline: "Research. Analyze. Verify. Draft."*  
*Version: 1.0.0 (Production Release) — September 2026*

---

## 1. Executive Summary & Vision

**NYAYAAI** is an enterprise-grade AI legal intelligence platform designed specifically for Indian advocates, senior counsels, law chambers, and legal scholars. The platform tackles the fundamental operational bottlenecks in Indian legal practice:

1. **The Dual-Law Era**: Seamless transition and comparative analysis between India's historic criminal codes (**IPC 1860**, **CrPC 1973**, **IEA 1872**) and the 2023 enactments (**Bharatiya Nyaya Sanhita [BNS]**, **Bharatiya Nagarik Suraksha Sanhita [BNSS]**, and **Bharatiya Sakshya Adhiniyam [BSA]**).
2. **Zero-Hallucination Legal Research**: A 5-stage research pipeline producing 9-part structured legal briefs with verified statutory and precedential citations.
3. **Citation & Precedent Verification**: Verification of Supreme Court and High Court citations (AIR, SCC, SCR) with real-time "Good Law", "Partially Verified", and "Overruled" status tags.
4. **Judgment Analyzer**: Automated segregation of binding **Ratio Decidendi** from persuasive **Obiter Dicta**, with dual-mode views for Senior Counsels and Junior Advocates.
5. **Procedural Case Management**: Interactive visual timelines tracking cases from initial filing to final decree.
6. **Intelligent Legal Drafting Studio**: 14 standardized Indian legal templates with multi-format export (.DOCX, .PDF, .TXT).
7. **Bar Council of India (BCI) Compliance**: Non-solicitation adherence, strict client confidentiality, and cryptographic SHA-256 audit logging.

---

## 2. How to Run the Platform

### 2.1 Local Developer Environment

#### Prerequisites:
* **Node.js**: v18.17.0+ or v20.x or v22.x
* **npm**: v9+ or v10+
* **Git**: Installed and configured

#### Quick Start Commands:
```bash
# 1. Clone the repository
git clone https://github.com/SUBHAPRIYAM-dev/-NyayaAI-AI-Legal-Research-Case-Intelligence-Platform-for-Indian-Advocates-.git
cd -NyayaAI-AI-Legal-Research-Case-Intelligence-Platform-for-Indian-Advocates-

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Open **http://localhost:3000** in your web browser. The app runs immediately with pre-loaded demo data.

#### Quality & Verification Commands:
* `npm test` — Executes the complete Vitest test suite (19/19 tests passing).
* `npm run typecheck` — Validates TypeScript types across the entire project (0 errors).
* `npm run build` — Compiles the optimized Next.js production build for all 35 routes.
* `npm run db:seed` — Seeds the in-memory database with 22 statutes, 22 judgments, 22 cases, 10 documents, and 10 research sessions.

---

### 2.2 Cloud Deployment on Vercel

1. Log in to [vercel.com](https://vercel.com) using your GitHub credentials.
2. Click **"Add New..."** &rarr; **"Project"**.
3. Import the repository: `-NyayaAI-AI-Legal-Research-Case-Intelligence-Platform-for-Indian-Advocates-`.
4. **Important**: Change the **Project Name** in Vercel to `nyayaai` (Vercel disallows names starting or ending with hyphens).
5. In **Environment Variables**, add:
   * `JWT_SECRET`: `nyayaai-super-secure-jwt-secret-key-32-chars-min-change-in-prod`
   * `COOKIE_NAME`: `nyayaai_session`
   * `NODE_ENV`: `production`
   * `GEMINI_API_KEY`: *(Optional)* Add your Google AI Studio key, or leave blank to run in offline Demo AI Mode.
6. Click **Deploy**. Vercel compiles and hosts the app on a live HTTPS URL.

---

## 3. How a User Operates NYAYAAI: Step-by-Step User Journey

### Step 1: Authentication & Chambers Setup
* **1-Click Demo Login**: Visit `/login` and click either:
  * **"Demo Advocate"**: Instantly signs in as Adv. Arjun Sharma (Senior Partner, Supreme Court practice).
  * **"Demo Firm Admin"**: Signs in as Chambers Administrator with system health telemetry and audit access.
* **New Advocate Registration**: Register at `/register` and complete the 5-step Onboarding Wizard at `/onboarding` (Bar Council enrollment, chambers structure, practice areas, citation style, and confidentiality settings).

### Step 2: Navigating the Executive Dashboard (`/dashboard`)
* Use the **Global Command Palette** (`Cmd+K` or `Ctrl+K`) to jump directly to any matter, statute, or tool.
* View upcoming Supreme Court and High Court hearing dates, recent research queries, active litigation matters, and AI quota meters.

### Step 3: 3-Column AI Legal Research Engine (`/research`)
* **Left Column**: Filter past research sessions by practice area (Criminal, Corporate, Constitutional, Taxation).
* **Center Column**: Enter any natural language legal question (e.g., *"Anticipatory bail standards under BNSS Section 482 vs CrPC Section 438"*).
* **5-Stage Progress Visualizer**:
  1. *Understanding legal proposition...*
  2. *Identifying jurisdiction & active statutes...*
  3. *Searching statutory provisions (BNS / IPC)...*
  4. *Verifying citations against official reporters...*
  5. *Compiling structured legal brief...*
* **9-Part Structured Legal Brief**:
  1. **Legal Issue**: Clear statement of the legal controversy.
  2. **Short Answer**: Direct affirmative or negative answer under current law.
  3. **Applicable Law**: Dual statutory provisions (BNS vs IPC).
  4. **Relevant Authorities**: Reported Supreme Court and High Court citations.
  5. **In-Depth Analysis**: Structured IRAC (Issue, Rule, Application, Conclusion) legal reasoning.
  6. **Supporting Authorities**: Favorable precedents with bench holdings.
  7. **Contrary Authorities**: Distinguishable cases and conflicting precedents.
  8. **Practical Considerations**: Filing tactics, limitation issues, and evidentiary prerequisites.
  9. **Unresolved Questions**: Gray areas or matters pending before a Larger Bench.
* **Actions**: One-click **Copy Brief**, **Export (.TXT)**, **Create Case Docket**, or **Prepare Draft**.

### Step 4: Citation & Precedent Verification (`/citation-checker`)
* Input a case name or citation (e.g., `2024 INSC 412`).
* Inspect verification status:
  * `VERIFIED` — Good Law, binding under Article 141 of the Constitution.
  * `PARTIALLY VERIFIED` — Distinguished on facts or limited statutory scope.
  * `UNVERIFIED` — Overruled or non-existent citation (hallucination safeguard).

### Step 5: Judgment Analyzer & Ratio Decidendi Extractor (`/judgment-analyzer`)
* Upload or select any lengthy judgment.
* Automatically segregates:
  * **Ratio Decidendi**: The binding legal principle.
  * **Obiter Dicta**: Incidental judicial remarks.
  * **Submissions**: Appellant vs Respondent arguments.
* Switch between **Senior Chambers Brief** and **Junior Advocate Walkthrough**.

### Step 6: Case Docket & Visual Procedural Timeline (`/cases` & `/cases/[id]`)
* Manage case metadata: CNR Number, Court Hall, Bench, Stage, and Next Hearing Date.
* Interactive chronological roadmap:
  `Filing` &rarr; `Notice Issued` &rarr; `Written Statement` &rarr; `Framing of Issues` &rarr; `Evidence` &rarr; `Final Hearing` &rarr; `Judgment & Decree`.
* Log new orders and adjourned hearing dates directly into the case timeline.

### Step 7: Case Strategy & Risk Matrix (`/case-strategy`)
* Evaluate litigation posture across 4 quadrants:
  * **Procedural Risk**: Limitation periods, CPC Order VII Rule 11 grounds.
  * **Precedent Risk**: Adverse rulings, pending Larger Bench references.
  * **Evidentiary Risk**: Electronic evidence certificates (BSA Section 63).
  * **Financial Risk**: Costs under CPC §35A, deposit requirements.

### Step 8: Document Vault & Contextual AI Reader (`/documents`)
* Split-screen reader: view contracts, petitions, and orders on the left.
* Contextual AI actions on the right: **Find Legal Risks**, **Find Provisions**, **Find Authorities**, and **Explain Clause**.

### Step 9: Legal Drafting Studio (`/drafting`)
* Choose from **14 standardized Indian legal templates**:
  1. Anticipatory Bail Petition (BNSS §482 / CrPC §438)
  2. Regular Bail Application (BNSS §480 / CrPC §437)
  3. Legal Notice for Cheque Dishonour (NI Act §138)
  4. Commercial Suit Plaint (Commercial Courts Act)
  5. Writ Petition (Constitution Art. 226 / 32)
  6. Special Leave Petition (Constitution Art. 136)
  7. Written Statement / Defence (CPC Order VIII)
  8. Section 9 Interim Measures (Arbitration Act §9)
  9. Caveat Petition (CPC §148A)
  10. Statement of Claim (Arbitration Act §23)
  11. Criminal Revision Application (BNSS §438 / CrPC §397)
  12. Consumer Dispute Complaint (CPA 2019 §35)
  13. Trademark Opposition Notice (Trade Marks Act §21)
  14. Criminal Quashing Petition (BNSS §528 / CrPC §482)
* Select drafting tone: *Aggressive*, *Neutral*, *Conciliatory*, or *Firm*.
* Export in 1-click to **.DOCX**, **.PDF**, and **.TXT**.

### Step 10: Firm Workspace & Role-Based Access Control (`/firm`)
* Manage chambers team members with roles: `Partner`, `Associate`, and `Admin`.
* Invite colleagues and assign matter permissions.

### Step 11: Billing & AI Quota Metering (`/billing`)
* Real-time consumption meters for Queries, Documents, Drafts, Citations, and Tokens.
* Compare tiers: Chambers Starter, Senior Advocate Pro, Enterprise Chambers.

### Step 12: Enterprise Administration Console (`/admin`)
* Real-time subsystem health status (Database, Redis, Gemini AI, Vector Store, Auth).
* Runtime feature flag toggles.
* Immutable SHA-256 cryptographic audit logs with tenant filtering.

---

## 4. Complete Feature Inventory (35 Routes)

| Module | Route | Type | Core Functionality |
| :--- | :--- | :--- | :--- |
| **Marketing Landing Page** | `/` | Page | Showcase, BNS comparison, pricing, trust badges |
| **Authentication** | `/login`, `/register`, `/forgot-password` | Pages | JWT auth, bcrypt passwords, demo shortcuts |
| **Onboarding Wizard** | `/onboarding` | Page | 5-step chambers setup wizard |
| **Executive Dashboard** | `/dashboard` | Page | Hearings, dockets, research feed, AI quota meters |
| **AI Legal Research** | `/research` | Page | 3-column workspace, 5-stage simulation, IRAC brief |
| **Citation Checker** | `/citation-checker` | Page | Precedent verifier (AIR, SCC), Good Law badges |
| **Judgment Analyzer** | `/judgment-analyzer` | Page | Ratio Decidendi vs Obiter Dicta, dual persona view |
| **Litigation Dockets** | `/cases`, `/cases/[id]` | Pages | CNR search, procedural timeline, event logger |
| **Case Strategy** | `/case-strategy` | Page | 4-factor risk matrix, tactical recommendations |
| **Document Vault** | `/documents` | Page | Split-screen reader, contextual risk & clause analysis |
| **Drafting Studio** | `/drafting` | Page | 14 Indian legal templates, tone selector, export |
| **Authorities Library** | `/authorities` | Page | BNS/BNSS/BSA vs IPC/CrPC/IEA comparative browser |
| **Firm Management** | `/firm` | Page | Law chamber team roster, RBAC (Partner/Associate/Admin) |
| **Billing & Quotas** | `/billing` | Page | Quota meters, token tracking, 1-click upgrades |
| **User Settings** | `/settings` | Page | Advocate profile, bar enrollment, preferences |
| **Admin Console** | `/admin` | Page | System health, feature flags, audit trail, indexing |
| **API Backend** | `17 route handlers in /api/*` | API | Serverless REST endpoints with tenant isolation |

---

## 5. Ethical, Regulatory & Security Framework

* **Bar Council of India Rule 36 Compliance**: Strict non-advertising posture; operations confined to internal chambers research.
* **Zero-Hallucination Policy**: Visual warnings on unverified citations and watermarks on synthetic demonstration records.
* **Mandatory Disclaimers**: All drafts and analyses include statutory notices requiring advocate verification prior to court filing.
* **Cryptographic Audit Trail**: Every user action is logged with an immutable SHA-256 hash for enterprise compliance audits.
