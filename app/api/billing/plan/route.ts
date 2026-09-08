import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { planId, provider = "mock", organizationId = "org-demo-firm-01" } = body;

    if (!["free", "advocate", "professional", "firm"].includes(planId)) {
      return NextResponse.json({ error: "Invalid plan identifier" }, { status: 400 });
    }

    const updatedSub = db.billing.updatePlan(organizationId, planId);
    const updatedUsage = db.billing.getUsage(organizationId);

    logAuditEvent({
      organizationId,
      userId: "user-advocate-01",
      userEmail: "demo.advocate@nyayaai.test",
      action: "PLAN_CHANGED",
      details: `Subscription updated to ${updatedSub.planName} via ${provider.toUpperCase()} provider`,
    });

    return NextResponse.json({
      success: true,
      subscription: updatedSub,
      usage: updatedUsage,
      message: `Successfully updated to ${updatedSub.planName} (Demo Mode).`,
    });
  } catch (err) {
    return NextResponse.json({ error: "Billing plan update failed." }, { status: 500 });
  }
}
