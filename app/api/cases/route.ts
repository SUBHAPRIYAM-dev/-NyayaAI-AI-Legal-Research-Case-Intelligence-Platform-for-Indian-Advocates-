import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";
import { CaseRecord } from "@/types";

export async function GET(req: NextRequest) {
  const orgId = "org-demo-firm-01";
  const cases = db.cases.list(orgId);
  return NextResponse.json({ success: true, cases });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      caseNumber,
      court,
      clientName,
      practiceArea,
      status = "Active",
      nextHearingDate,
      assignedLawyer = "Adv. Rajesh V. Nariman",
      summary,
      organizationId = "org-demo-firm-01",
    } = body;

    if (!title || !court) {
      return NextResponse.json({ error: "Title and Court are required fields." }, { status: 400 });
    }

    const newCase: CaseRecord = {
      id: `case-${Date.now()}`,
      organizationId,
      title,
      caseNumber: caseNumber || `ARB (COMM) ${Math.floor(Math.random() * 800) + 100}/2026`,
      court,
      clientName: clientName || "Confidential Client",
      practiceArea: practiceArea || "Commercial Litigation",
      status,
      nextHearingDate,
      assignedLawyer,
      assignedLawyerEmail: "demo.advocate@nyayaai.test",
      summary: summary || "New matter registered in chambers litigation docket.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      events: [
        {
          id: `evt-${Date.now()}`,
          caseId: `case-${Date.now()}`,
          title: "Matter Registered in Chambers",
          type: "Filing",
          date: new Date().toISOString().split("T")[0],
          description: "Initial client engagement, power of attorney executed, and case file created.",
        },
      ],
      hearings: nextHearingDate
        ? [
            {
              id: `hrg-${Date.now()}`,
              caseId: `case-${Date.now()}`,
              court,
              bench: "Designated Bench",
              hearingDate: nextHearingDate,
              purpose: "First Returnable Hearing",
              status: "Scheduled",
            },
          ]
        : [],
      documentsCount: 0,
      demo: true,
    };

    db.cases.create(newCase);

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "CASE_CREATED",
      details: `Created case docket: "${title}" (${newCase.caseNumber})`,
    });

    return NextResponse.json({ success: true, case: newCase });
  } catch (err) {
    return NextResponse.json(
      { error: "Case creation encountered an unexpected issue." },
      { status: 500 }
    );
  }
}
