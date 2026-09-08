import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrator } from "@/lib/ai";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, text, mode = "brief", organizationId = "org-demo-firm-01" } = body;

    db.billing.incrementUsage(organizationId, "document");

    const analysis = aiOrchestrator.analyzeJudgment(title, text || "");

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "DOCUMENT_ANALYZED",
      details: `Judgment analyzed: "${title || 'Untitled Judgment'}" (Mode: ${mode})`,
    });

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Judgment analysis pipeline failed. Please try again." },
      { status: 500 }
    );
  }
}
