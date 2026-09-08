import { describe, it, expect } from "vitest";
import { db } from "@/lib/db";

describe("Billing & AI Quota Metering Suite", () => {
  it("should initialize with professional chambers subscription", () => {
    const sub = db.billing.getSubscription("org-demo-firm-01");
    expect(sub.planId).toBe("professional");
    expect(sub.status).toBe("active");
  });

  it("should increment AI usage and track token consumption", () => {
    const orgId = "org-demo-firm-01";
    const initialUsage = { ...db.billing.getUsage(orgId) };

    const allowed = db.billing.incrementUsage(orgId, "research");
    expect(allowed).toBe(true);

    const updatedUsage = db.billing.getUsage(orgId);
    expect(updatedUsage.researchQueriesUsed).toBe(initialUsage.researchQueriesUsed + 1);
    expect(updatedUsage.tokensConsumed).toBeGreaterThan(initialUsage.tokensConsumed);
  });

  it("should update plan limits when plan changes", () => {
    const orgId = "org-demo-firm-01";
    db.billing.updatePlan(orgId, "advocate");

    const sub = db.billing.getSubscription(orgId);
    expect(sub.planId).toBe("advocate");

    const usage = db.billing.getUsage(orgId);
    expect(usage.researchQueriesLimit).toBe(500);

    // Reset back to professional for demo
    db.billing.updatePlan(orgId, "professional");
    expect(db.billing.getUsage(orgId).researchQueriesLimit).toBe(2000);
  });
});
