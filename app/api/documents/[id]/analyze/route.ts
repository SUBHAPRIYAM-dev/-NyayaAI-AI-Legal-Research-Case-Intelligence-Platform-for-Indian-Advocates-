import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docId = params.id;
    const body = await req.json();
    const { action, selection, organizationId = "org-demo-firm-01" } = body;

    const doc = db.documents.getById(docId, organizationId);
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    db.billing.incrementUsage(organizationId, "document");

    let responseText = "";

    switch (action) {
      case "find-risks":
        responseText = `
IDENTIFIED LEGAL RISKS & LIABILITIES:
1. Clause 34.2 (Unilateral Termination): Lacks mandatory cure period. In Apex Mercantile Infra (2025 Fictional SC), the Court held summary termination of commercial contracts by public authorities violates Article 14 fairness.
2. Indemnity Exposure: Section 74 of the Indian Contract Act caps damages to reasonable compensation; strict indemnity without proof of actual loss is legally vulnerable.
3. Jurisdiction Conflict: Clause mentions 'Courts at Delhi' but arbitration seat designated elsewhere; clarify seat vs venue.
        `.trim();
        break;

      case "find-provisions":
        responseText = `
APPLICABLE STATUTORY PROVISIONS EXTRACTED:
- Section 10, Specific Relief Act, 1963 (Specific performance of commercial agreements)
- Section 61, Bharatiya Sakshya Adhiniyam, 2023 (Admissibility of electronic digital records & hash validation)
- Section 12A, Commercial Courts Act, 2015 (Pre-institution mediation prerequisite)
        `.trim();
        break;

      case "find-authorities":
        responseText = `
RELEVANT PRECEDENTS FOR THIS DOCUMENT:
- Apex Mercantile Infra Ltd. v. UT of Indica (2025 SCC OnLine SC 401 - Fictional Demo) [Good Law]
- Indica Energy Holdings v. Global Maritime Freight (2024 (5) Arb LR 112 SC - Fictional Demo) [Good Law]
- Bharat Solar Power Corp v. Southern Power Distribution (2024 Kar LJ 450 - Fictional Demo) [Good Law]
        `.trim();
        break;

      case "explain-selection":
        responseText = `
EXPLANATION OF SELECTED CLAUSE:
"${selection || 'Arbitration clause and dispute resolution'}"
This clause establishes binding institutional arbitration under the Arbitration and Conciliation Act, 1996. Key consideration: Unilateral nomination of a sole arbitrator is prohibited under Section 12(5).
        `.trim();
        break;

      case "summarize":
      default:
        responseText = `
EXECUTIVE SUMMARY:
${doc.name} governs the contractual commercial rights and dispute covenants between the contracting parties. The document is structured across ${doc.pageCount} pages, establishing performance milestones, indemnities, and governing law.
        `.trim();
        break;
    }

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "DOCUMENT_ANALYZED",
      details: `Document AI Action "${action}" performed on ${doc.name}`,
    });

    return NextResponse.json({
      success: true,
      action,
      result: responseText,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Document intelligence analysis failed." },
      { status: 500 }
    );
  }
}
