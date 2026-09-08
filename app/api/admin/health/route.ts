import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuditLogs } from "@/lib/security";

export async function GET(req: NextRequest) {
  const health = db.system.getHealth();
  const flags = db.flags.get();
  const auditLogs = getAuditLogs().slice(0, 50);

  return NextResponse.json({
    success: true,
    health,
    flags,
    auditLogs,
  });
}
