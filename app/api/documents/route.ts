import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";
import { DocumentRecord } from "@/types";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function GET(req: NextRequest) {
  const orgId = "org-demo-firm-01";
  const docs = db.documents.list(orgId);
  return NextResponse.json({ success: true, documents: docs });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, fileType, sizeBytes, caseId, caseTitle, organizationId = "org-demo-firm-01" } = body;

    if (!name) {
      return NextResponse.json({ error: "File name is required" }, { status: 400 });
    }

    if (sizeBytes && sizeBytes > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 25MB maximum limit" }, { status: 400 });
    }

    const newDoc: DocumentRecord = {
      id: `doc-${Date.now()}`,
      organizationId,
      caseId: caseId || undefined,
      caseTitle: caseTitle || "General Corporate Matter",
      name,
      fileType: fileType || "pdf",
      sizeBytes: sizeBytes || 2450000,
      pageCount: Math.floor(Math.random() * 25) + 5,
      uploadedAt: new Date().toISOString(),
      status: "Analyzed",
      aiStatus: "Completed",
      summary: `Document indexed and analyzed for legal risks and statutory citations under Indian law.`,
      extractedProvisions: ["Indian Contract Act, 1872", "Commercial Courts Act, 2015"],
      identifiedRisks: [
        "Unilateral termination clause without notice period",
        "Dispute resolution seat ambiguously specified",
      ],
      demo: true,
    };

    db.documents.create(newDoc);

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "DOCUMENT_UPLOADED",
      details: `Uploaded & indexed document: "${name}" (${newDoc.id})`,
    });

    return NextResponse.json({ success: true, document: newDoc });
  } catch (err) {
    return NextResponse.json(
      { error: "Document processing encountered an error." },
      { status: 500 }
    );
  }
}
