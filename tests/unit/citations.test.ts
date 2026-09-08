import { describe, it, expect } from "vitest";
import { MockLegalReasoningEngine } from "@/lib/ai";

describe("Precedent & Citation Verification Suite", () => {
  it("should verify valid landmark demonstration citations accurately", () => {
    const result = MockLegalReasoningEngine.verifyCitation(
      "2024 SCC OnLine SC 892",
      "Virendra K. Singhania"
    );

    expect(result.status).toBe("VERIFIED");
    expect(result.matchedSource).toBeDefined();
    expect(result.matchedSource?.title).toContain("Singhania");
    expect(result.matchedSource?.precedentStatus).toBe("Good Law");
  });

  it("should match another landmark citation from the registry", () => {
    const result = MockLegalReasoningEngine.verifyCitation(
      "2025 SCC OnLine SC 401",
      "Apex Mercantile Infra"
    );

    expect(result.status).toBe("VERIFIED");
    expect(result.matchedSource?.court).toContain("Supreme Court");
  });

  it("should flag unknown or fabricated citations as UNVERIFIED", () => {
    const result = MockLegalReasoningEngine.verifyCitation(
      "2023 SCC 999999",
      "NonExistent Imaginary Case"
    );

    expect(result.status).toBe("UNVERIFIED");
    expect(result.matchedSource).toBeUndefined();
    expect(result.notes).toContain("not found");
  });
});
