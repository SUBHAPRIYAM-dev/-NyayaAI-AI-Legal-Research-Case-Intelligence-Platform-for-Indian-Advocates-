import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrator } from "@/lib/ai";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateType, jurisdiction, court, facts, tone, organizationId = "org-demo-firm-01" } = body;

    if (!templateType || !jurisdiction) {
      return NextResponse.json(
        { error: "Template type and jurisdiction are required" },
        { status: 400 }
      );
    }

    db.billing.incrementUsage(organizationId, "draft");

    const draft = aiOrchestrator.generateLegalDraft({
      templateType,
      jurisdiction,
      court,
      facts: facts || "",
      tone: tone || "Formal & Assertive",
    });

    db.drafts.create(draft);

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "DRAFT_GENERATED",
      details: `Generated legal draft: "${draft.title}" (${templateType})`,
    });

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Draft generation failed. Please try again." },
      { status: 500 }
    );
  }
}
