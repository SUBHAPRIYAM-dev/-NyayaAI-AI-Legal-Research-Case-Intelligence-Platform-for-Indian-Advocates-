import { describe, it, expect } from "vitest";
import {
  assertTenantAccess,
  TenantAccessError,
  checkRateLimit,
  logAuditEvent,
  getAuditLogs,
} from "@/lib/security";

describe("Security, Tenant Isolation & Rate Limiting Suite", () => {
  it("should permit access when organizationId matches", () => {
    expect(() => {
      assertTenantAccess({ organizationId: "org-alpha" }, "org-alpha");
    }).not.toThrow();
  });

  it("should strictly reject cross-tenant data access with TenantAccessError", () => {
    expect(() => {
      assertTenantAccess({ organizationId: "org-alpha" }, "org-beta");
    }).toThrow(TenantAccessError);
  });

  it("should enforce rate limiting bounds correctly", () => {
    const testId = `test-ip-${Date.now()}`;
    // Limit to 3 requests in 60 seconds
    const first = checkRateLimit(testId, 3, 60);
    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(2);

    const second = checkRateLimit(testId, 3, 60);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(1);

    const third = checkRateLimit(testId, 3, 60);
    expect(third.allowed).toBe(true);
    expect(third.remaining).toBe(0);

    const fourth = checkRateLimit(testId, 3, 60);
    expect(fourth.allowed).toBe(false);
    expect(fourth.remaining).toBe(0);
  });

  it("should append audit log entries with timestamp and details", () => {
    const entry = logAuditEvent({
      organizationId: "org-test",
      userId: "user-test",
      userEmail: "audit@test.com",
      action: "RESEARCH_QUERY",
      details: "Test research query executed",
    });

    expect(entry.id).toBeDefined();
    expect(entry.timestamp).toBeDefined();

    const logs = getAuditLogs("org-test");
    expect(logs.some((l) => l.id === entry.id)).toBe(true);
  });
});
