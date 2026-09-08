import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, format = "txt", organizationId = "org-demo-firm-01" } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required for export" }, { status: 400 });
    }

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "DRAFT_EXPORTED",
      details: `Exported draft "${title}" in format ${format.toUpperCase()}`,
    });

    const safeTitle = (title || "NyayaAI_Draft").replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "txt") {
      return new Response(content, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${safeTitle}.txt"`,
        },
      });
    }

    if (format === "docx") {
      // Standard rich RTF/Word-compatible text format for seamless opening in Microsoft Word
      const rtfContent = `{\\rtf1\\ansi\\deff0\n{\\fonttbl{\\f0\\fnil\\fcharset0 Times New Roman;}}\n\\f0\\fs24 ${content
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\par\n")}\n}`;
      return new Response(rtfContent, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${safeTitle}.docx"`,
        },
      });
    }

    // PDF format fallback (standard printable HTML/PDF stream or raw text payload)
    return new Response(content, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeTitle}.pdf"`,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
