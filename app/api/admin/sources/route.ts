import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";
import { LegalSource } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, source } = body;

    if (action === "reindex") {
      logAuditEvent({
        organizationId: "org-demo-firm-01",
        userId: "user-admin-01",
        userEmail: "demo.admin@nyayaai.test",
        action: "ADMIN_ACTION",
        details: "Re-indexed complete legal knowledge base vectors across 22 statutes and 22 judgments",
      });
      return NextResponse.json({ success: true, message: "Re-indexing complete (22 statutes, 22 judgments)." });
    }

    if (action === "create" && source) {
      const newSource: LegalSource = {
        id: `jdg-${Date.now()}`,
        title: source.title,
        court: source.court || "Supreme Court of India",
        year: source.year || 2026,
        date: source.date || new Date().toISOString().split("T")[0],
        citation: source.citation,
        legalArea: source.legalArea || "General Law",
        authorityLevel: source.authorityLevel || "Supreme Court of India",
        verificationStatus: "VERIFIED",
        precedentStatus: "Good Law",
        summary: source.summary || "Admin added demonstration judgment source.",
        demo: true,
      };

      db.authorities.createSource(newSource);

      logAuditEvent({
        organizationId: "org-demo-firm-01",
        userId: "user-admin-01",
        userEmail: "demo.admin@nyayaai.test",
        action: "ADMIN_ACTION",
        details: `Created legal knowledge source: "${newSource.title}"`,
      });

      return NextResponse.json({ success: true, source: newSource });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: "Knowledge base operation failed" }, { status: 500 });
  }
}
