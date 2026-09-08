# NYAYAAI Architecture Documentation

## 1. System Philosophy: Retrieve → Verify → Analyze → Cite → Review
NyayaAI is an AI-powered legal intelligence platform purpose-built for the Indian legal ecosystem. Unlike generic LLM chat interfaces, NyayaAI enforces strict grounding against authoritative precedent databases and statutory corpora.

The AI model never behaves as an unconstrained oracle. It operates within a tightly orchestrated pipeline:
1. **Retrieve**: Query expansion, jurisdictional detection, and multi-vector search across Central Acts, State Acts, and official court reporters (SCC, SCR, AIR, DLT, Bom CR).
2. **Verify**: Citations are verified against precedent status tables (Good Law, Overruled, Distinguished, Pending Review). Unverified citations are marked `UNVERIFIED`.
3. **Analyze**: Separation of *Ratio Decidendi* (binding legal proposition) from *Obiter Dicta* (persuasive judicial remarks).
4. **Cite**: Standardized legal citation formatting adhering to Indian law reporting conventions.
5. **Review**: All AI-generated briefs and drafts carry mandatory human-in-the-loop review warnings.

## 2. Indian Legal Domain Model & Modern 2023 Sanhitas
NyayaAI provides native architectural support for India's 2023 criminal codes while preserving historical precedents:
- **Bharatiya Nyaya Sanhita, 2023 (BNS)** ↔ Indian Penal Code, 1860 (IPC)
- **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)** ↔ Code of Criminal Procedure, 1973 (CrPC)
- **Bharatiya Sakshya Adhiniyam, 2023 (BSA)** ↔ Indian Evidence Act, 1872 (IEA)

The platform prevents silent substitution: historical judgments are annotated with modern statutory equivalents without obscuring historical legal context.

## 3. Multi-Tenancy & Security
- **Tenant Isolation**: Every entity belongs to an `organization_id`. Authorization checks are enforced server-side before querying or updating records.
- **RBAC Matrix**: Role hierarchy (`Owner` > `Admin` > `Partner` > `Associate` > `Researcher` > `Viewer`).
- **Cryptographic Audit Trail**: Immutable logging of logins, research sessions, document indexing, and citation verifications.
- **Rate Limiting**: Sliding-window rate limiter per organization tier to prevent service degradation.

## 4. Dual-Mode Backend (Zero-Dependency Local Demo + Production Cloud)
- **Local Zero-Dependency Mode**: Out of the box, runs with an in-memory/file-persisted reactive store and deterministic legal reasoning engine. No Docker, external Postgres, or Redis installation required to demonstrate full functionality.
- **Production Cloud Mode**: Fully configured for PostgreSQL + `pgvector`, Redis + BullMQ asynchronous workers, and Google Gemini 1.5 Flash API via `docker-compose.yml`.
