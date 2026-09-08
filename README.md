# NYAYAAI: AI-Powered Indian Legal Intelligence Platform
> *"Research. Analyze. Verify. Draft."*

NYAYAAI is an AI-powered legal intelligence platform engineered specifically for Indian advocates, law chambers, corporate legal counsel, and judicial researchers. It combines multi-statutory RAG search across modern 2023 criminal codes (**BNS**, **BNSS**, **BSA**) and historical legislation (**IPC**, **CrPC**, **IEA**) with deterministic citation verification, ratio decidendi extraction, case management with visual procedural timelines, and court-ready legal drafting.

> [!IMPORTANT]
> **LEGAL DISCLAIMER & DEMONSTRATION NOTICE**:  
> NyayaAI provides AI-assisted legal research, analysis, and drafting support. It is not a substitute for professional legal judgment. All case names, citations, and judgment records are **FICTIONAL DEMONSTRATION DATA** and must never be relied upon as binding law in actual court proceedings. Never claim affiliation with the Supreme Court of India, High Courts, Bar Council of India, or any statutory authority.

---

## Key Capabilities

1. **AI Legal Research Workspace (3-Column Layout)**
   - Deconstructs complex inquiries into legal issues, short answers, applicable statutes, ratio decidendi, and contrary precedents.
   - Animated multi-stage execution pipeline (*Understanding question* → *Searching statutes* → *Verifying citations* → *Preparing response*).
   - Dedicated source panel with authority levels and verification badges.
2. **Precedent & Citation Verifier**
   - Eliminates hallucinated citations by cross-referencing against verified precedent status registries.
   - Status indicators: `VERIFIED`, `PARTIALLY VERIFIED`, `UNVERIFIED`, `POTENTIALLY INCORRECT`, `DEMO`.
3. **Judgment Analyzer & Brief Generator**
   - Automatically isolates **Ratio Decidendi** from **Obiter Dicta**.
   - Compares appellant vs respondent arguments and details statutory interpretations.
   - Dual-mode explanations: Chambers Brief vs Junior Advocate Walkthrough.
4. **Document Vault & Contextual AI Reader**
   - Secure file storage abstraction with MIME type and 25MB file size enforcement.
   - Split-screen reader: view document text on left, run interactive AI risk discovery, provision checks, and clause explanations on right.
5. **Case Management & Visual Timeline**
   - Track active litigation dockets, client details, courts, and next hearing dates.
   - Interactive procedural timeline supporting Filings, Notices, Replies, Hearings, and Orders.
6. **Case Strategy & Risk Matrix**
   - Evaluates strengths, weaknesses, arguments, and counter-arguments without false outcome guarantees ("You will win" is forbidden; uses "Potential argument" and "Requires professional review").
7. **Legal Drafting Studio**
   - 14+ Indian legal templates: Legal Notice, Bail Application, Anticipatory Bail, Writ Petition, Written Statement, Affidavit, Plaint, Legal Opinion, etc.
   - Multi-step generator with tone selection and multi-format export (.txt, .docx, .pdf).
8. **Statutory Knowledge Base (Modern vs Historical Laws)**
   - 22 pre-seeded Indian statutes and 22 landmark demonstration judgments.
   - Dedicated cross-reference matrix comparing BNS/BNSS/BSA 2023 with IPC/CrPC/IEA without silent substitution.
9. **Firm Workspace & RBAC**
   - Law firm team roster with roles: `Owner`, `Admin`, `Partner`, `Associate`, `Researcher`, `Viewer`.
10. **Subscriptions & Live Quota Metering**
    - Free (10 queries), Advocate (500 queries), Professional (2,000 queries), and Law Firm tiers.
    - Mock payment provider adapter supporting Razorpay and Stripe abstractions.
11. **Admin Console & System Health**
    - Live health monitoring (API, Database, Redis, AI Service, Queue, Storage).
    - Dynamic feature flag toggles and immutable audit logs.

---

## Pre-Configured Demo Credentials

One-click demo login buttons are provided on the `/login` screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Demo Advocate** | `demo.advocate@nyayaai.test` | *(Any value / One-click)* | Senior Partner, full litigation & research access |
| **Demo Firm Admin** | `demo.admin@nyayaai.test` | *(Any value / One-click)* | Managing Partner & Administrator, full access including `/admin` |
| **Demo Associate** | `demo.associate@nyayaai.test` | *(Any value / One-click)* | Associate Advocate, research and drafting |

---

## Quick Start & Local Execution

NYAYAAI has been engineered with zero external dependency requirements out of the box. It will run 100% locally using an in-memory/file-persisted reactive store and deterministic legal reasoning engine.

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Demonstration Legal Database
```bash
npm run db:seed
```

### 3. Run Automated Test Suite
```bash
npm test
```

### 4. Run TypeScript Check
```bash
npm run typecheck
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Optional: Real Google Gemini API Integration

If you wish to connect real Google Gemini AI models:
1. Obtain an API key from Google AI Studio.
2. Edit `.env.local`:
   ```env
   GEMINI_API_KEY="AIzaSyYourActualKeyHere..."
   ```
3. Restart the dev server. The top navigation bar will automatically display **"Gemini 1.5 Flash"** with live model streaming.

---

## Production Deployment (Docker Compose)

For production environments with dedicated PostgreSQL + `pgvector` and Redis:
```bash
docker-compose up --build
```
This spawns:
- `web`: Next.js production SSR container
- `postgres`: PostgreSQL 16 with `pgvector` extension enabled
- `redis`: Redis 7 cache and queue broker

---

## Technology Stack

- **Frontend**: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Recharts
- **Backend & APIs**: Next.js Route Handlers, Zod Validation, Jose JWT, BCrypt
- **AI & RAG**: Google Generative AI SDK (`@google/generative-ai`) + Deterministic Fallback Engine
- **Storage & State**: Unified Database Adapter with tenant isolation and audit logging
- **Testing**: Vitest automated unit & integration test runner
