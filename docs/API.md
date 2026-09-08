# NYAYAAI REST API Documentation

## Authentication Endpoints
- `POST /api/auth/login`: Authenticate advocate or admin credentials, return signed JWT session cookie.
- `POST /api/auth/register`: Register new advocate profile, state jurisdiction, and practice areas.
- `POST /api/auth/logout`: Invalidate session and clear HTTP-only cookie.

## AI Legal Research Endpoints
- `POST /api/research/query`: Execute structured legal research query, orchestrate RAG pipeline, and return structured JSON response with sources.

## Precedent & Citation Verification
- `POST /api/citations/verify`: Cross-reference citation, case name, court, and proposition against ground-truth registry. Returns `VERIFIED`, `PARTIALLY VERIFIED`, `UNVERIFIED`, or `POTENTIALLY INCORRECT`.

## Judgment Analysis Endpoints
- `POST /api/judgments/analyze`: Extract ratio decidendi, obiter dicta, issues, and arguments from court judgment text.

## Document Vault Endpoints
- `GET /api/documents`: List indexed vault documents for organization.
- `POST /api/documents`: Upload and index new legal file with MIME type and size validation.
- `POST /api/documents/[id]/analyze`: Perform contextual AI actions (`find-risks`, `find-provisions`, `find-authorities`, `explain-selection`, `summarize`).

## Case Management Endpoints
- `GET /api/cases`: Fetch all active, pending, or closed litigation cases for organization.
- `POST /api/cases`: Create a new case docket with court, client, and next hearing date.
- `GET /api/cases/[id]`: Retrieve single case with visual timeline events and scheduled hearings.
- `PATCH /api/cases/[id]`: Update case metadata or status.
- `POST /api/cases/[id]/events`: Append procedural event (Filing, Notice, Reply, Hearing, Order) to case timeline.

## Legal Drafting Endpoints
- `POST /api/drafting/generate`: Synthesize legal draft from 14 Indian templates with tone selection and citation check.
- `POST /api/drafting/export`: Export draft in plain text (.txt), Word (.docx), or printable PDF format.

## Billing & Subscriptions
- `POST /api/billing/plan`: Switch subscription tier (`free`, `advocate`, `professional`, `firm`) and update AI quota limits via mock Razorpay/Stripe provider.

## Admin & System Health
- `GET /api/admin/health`: Inspect API, database, redis, AI service, and queue operational diagnostics.
- `POST /api/admin/flags`: Toggle platform feature flags.
- `POST /api/admin/sources`: Curation operations (create legal source, re-index vectors).
