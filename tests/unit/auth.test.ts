import { describe, it, expect } from "vitest";
import {
  createSessionToken,
  verifySessionToken,
  hashPassword,
  comparePassword,
  hasMinimumRole,
  canAccessAdmin,
} from "@/lib/auth";

describe("Authentication & RBAC Suite", () => {
  it("should generate a valid signed JWT and verify payload", async () => {
    const payload = {
      userId: "test-user-123",
      email: "test@nyayaai.test",
      name: "Test Advocate",
      role: "Partner" as const,
      organizationId: "org-123",
      organizationName: "Test Chambers",
      category: "Advocate",
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it("should reject invalid or tampered JWT tokens", async () => {
    const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature";
    const decoded = await verifySessionToken(invalidToken);
    expect(decoded).toBeNull();
  });

  it("should securely hash passwords and verify matches", async () => {
    const raw = "SecurePass123!@#";
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    expect(hashed.length).toBeGreaterThan(20);

    const isMatch = await comparePassword(raw, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword("WrongPassword", hashed);
    expect(isWrongMatch).toBe(false);
  });

  it("should enforce role hierarchy correctly", () => {
    expect(hasMinimumRole("Owner", "Admin")).toBe(true);
    expect(hasMinimumRole("Admin", "Partner")).toBe(true);
    expect(hasMinimumRole("Partner", "Associate")).toBe(true);
    expect(hasMinimumRole("Associate", "Viewer")).toBe(true);
    expect(hasMinimumRole("Viewer", "Partner")).toBe(false);
  });

  it("should permit admin portal only to Admin and Owner roles", () => {
    expect(canAccessAdmin("Owner")).toBe(true);
    expect(canAccessAdmin("Admin")).toBe(true);
    expect(canAccessAdmin("Partner")).toBe(false);
    expect(canAccessAdmin("Associate")).toBe(false);
    expect(canAccessAdmin("Viewer")).toBe(false);
  });
});
