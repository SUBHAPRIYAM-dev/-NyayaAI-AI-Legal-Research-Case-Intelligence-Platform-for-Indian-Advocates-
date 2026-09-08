import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrator } from "@/lib/ai";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { citation, caseName, court, year, proposition, organizationId = "org-demo-firm-01" } = body;

    if (!citation && !caseName) {
      return NextResponse.json({ error: "Citation or Case Name is required" }, { status: 400 });
    }

    db.billing.incrementUsage(organizationId, "citation");

    const result = aiOrchestrator.verifyCitation(citation || "", caseName || "");

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "CITATION_VERIFIED",
      details: `Citation verification executed for "${citation || caseName}" - Status: ${result.status}`,
    });

    return NextResponse.json({
      success: true,
      result: {
        citation,
        caseName,
        court,
        year,
        proposition,
        status: result.status,
        matchedSource: result.matchedSource,
        notes: result.notes,
        details: result.details,
        disclaimer: "FICTIONAL DEMONSTRATION DATA — Grounded in NyayaAI Precedent Registry.",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Citation verification engine error. Please try again." },
      { status: 500 }
    );
  }
}
