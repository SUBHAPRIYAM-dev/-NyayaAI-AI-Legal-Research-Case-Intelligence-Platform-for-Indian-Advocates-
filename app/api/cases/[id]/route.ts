import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const orgId = "org-demo-firm-01";
  const item = db.cases.getById(params.id, orgId);
  if (!item) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, case: item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orgId = "org-demo-firm-01";
    const body = await req.json();
    const updated = db.cases.update(params.id, orgId, body);
    if (!updated) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, case: updated });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
