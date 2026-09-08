import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { CaseEvent } from "@/types";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orgId = "org-demo-firm-01";
    const caseItem = db.cases.getById(params.id, orgId);
    if (!caseItem) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, type, date, description, notes } = body;

    const newEvent: CaseEvent = {
      id: `evt-${Date.now()}`,
      caseId: params.id,
      title: title || "Procedural Step",
      type: type || "Hearing",
      date: date || new Date().toISOString().split("T")[0],
      description: description || "",
      notes,
    };

    caseItem.events.unshift(newEvent);
    caseItem.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, event: newEvent, case: caseItem });
  } catch (err) {
    return NextResponse.json({ error: "Failed to add timeline event" }, { status: 500 });
  }
}
