import { NextRequest, NextResponse } from "next/server";
import { aiOrchestrator } from "@/lib/ai";
import { db } from "@/lib/db";
import { logAuditEvent } from "@/lib/security";
import { ResearchSession, ResearchMessage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, sessionId, organizationId = "org-demo-firm-01", userId = "user-advocate-01" } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query string is required" }, { status: 400 });
    }

    // Check usage limits
    const allowed = db.billing.incrementUsage(organizationId, "research");
    if (!allowed) {
      return NextResponse.json(
        { error: "Monthly AI research query limit reached for your plan. Please upgrade to continue." },
        { status: 429 }
      );
    }

    // Execute research through AI Orchestrator
    const structuredResponse = await aiOrchestrator.executeResearch(query);

    // Save or update session
    let session = sessionId ? db.research.getById(sessionId, organizationId) : undefined;
    const isNew = !session;

    const userMessage: ResearchMessage = {
      id: `msg-${Date.now()}-user`,
      sessionId: session?.id || `res-${Date.now()}`,
      sender: "user",
      content: query,
      timestamp: new Date().toISOString(),
    };

    const aiMessage: ResearchMessage = {
      id: `msg-${Date.now()}-ai`,
      sessionId: session?.id || `res-${Date.now()}`,
      sender: "ai",
      content: structuredResponse.shortAnswer + "\n\n" + structuredResponse.analysis,
      structuredResponse,
      timestamp: new Date().toISOString(),
      stagesCompleted: [
        "Understanding legal question",
        "Identifying jurisdiction",
        "Identifying legal domain",
        "Searching statutes",
        "Searching authorities",
        "Comparing authorities",
        "Verifying citations",
        "Preparing response",
      ],
    };

    if (isNew) {
      session = {
        id: `res-${Date.now()}`,
        organizationId,
        userId,
        title: query.slice(0, 48) + (query.length > 48 ? "..." : ""),
        previewQuery: query,
        legalArea: "General Indian Law",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSaved: true,
        messages: [userMessage, aiMessage],
        sources: structuredResponse.sources,
      };
      db.research.create(session);
    } else {
      session!.messages.push(userMessage, aiMessage);
      session!.sources = [...session!.sources, ...structuredResponse.sources];
      session!.updatedAt = new Date().toISOString();
    }

    logAuditEvent({
      organizationId,
      userId,
      userEmail: "demo.advocate@nyayaai.test",
      action: "RESEARCH_QUERY",
      details: `Legal research executed: "${query.slice(0, 60)}"`,
    });

    return NextResponse.json({
      success: true,
      session,
      response: structuredResponse,
      message: aiMessage,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Legal research engine temporarily encountered an issue. Please try again." },
      { status: 500 }
    );
  }
}
