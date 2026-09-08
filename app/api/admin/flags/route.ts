import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";
import { FeatureFlagConfig } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { key } = body as { key: keyof FeatureFlagConfig };

    if (!key) {
      return NextResponse.json({ error: "Flag key required" }, { status: 400 });
    }

    const updatedFlags = db.flags.toggle(key);

    logAuditEvent({
      organizationId: "org-demo-firm-01",
      userId: "user-admin-01",
      userEmail: "demo.admin@nyayaai.test",
      action: "ADMIN_ACTION",
      details: `Toggled feature flag: "${key}" to ${updatedFlags[key]}`,
    });

    return NextResponse.json({ success: true, flags: updatedFlags });
  } catch (err) {
    return NextResponse.json({ error: "Failed to toggle flag" }, { status: 500 });
  }
}
