import { describe, it, expect } from "vitest";
import { MockLegalReasoningEngine, MANDATORY_LEGAL_DISCLAIMER } from "@/lib/ai";

describe("AI Legal Intelligence Engine Suite", () => {
  it("should generate deterministic structured legal research for bail inquiry", () => {
    const query = "Bail standards under BNSS 2023 for economic offenses";
    const res = MockLegalReasoningEngine.generateResearch(query);

    expect(res.legalIssue).toContain("BNSS");
    expect(res.shortAnswer).toBeDefined();
    expect(res.applicableLaw.length).toBeGreaterThan(0);
    expect(res.applicableLaw.some((l) => l.includes("BNSS"))).toBe(true);
    expect(res.authorities.length).toBeGreaterThan(0);
    expect(res.analysis).toBeDefined();
    expect(res.supportingAuthorities.length).toBeGreaterThan(0);
    expect(res.practicalConsiderations.length).toBeGreaterThan(0);
    expect(res.unresolvedQuestions.length).toBeGreaterThan(0);
    expect(["high", "medium", "low"]).toContain(res.confidence);
    expect(res.verificationStatus).toBe("VERIFIED");
    expect(res.disclaimer).toBe(MANDATORY_LEGAL_DISCLAIMER);
  });

  it("should generate structured research for arbitration inquiries", () => {
    const query = "Arbitration Act Section 34 patent illegality challenge";
    const res = MockLegalReasoningEngine.generateResearch(query);

    expect(res.applicableLaw.some((l) => l.includes("Arbitration"))).toBe(true);
    expect(res.sources.length).toBeGreaterThan(0);
  });

  it("should synthesize case brief with Ratio Decidendi and Obiter Dicta", () => {
    const brief = MockLegalReasoningEngine.generateCaseBrief(
      "Test Commercial Appeal v. State",
      "Concessionaire challenged summary termination of expressway project."
    );

    expect(brief.ratioDecidendi).toBeDefined();
    expect(brief.obiterDicta.length).toBeGreaterThan(0);
    expect(brief.issuesFramed.length).toBeGreaterThan(0);
    expect(brief.argumentsAppellant.length).toBeGreaterThan(0);
    expect(brief.argumentsRespondent.length).toBeGreaterThan(0);
    expect(brief.demo).toBe(true);
  });

  it("should generate legal notice draft with professional review warning", () => {
    const draft = MockLegalReasoningEngine.generateDraft({
      templateType: "Legal Notice",
      jurisdiction: "New Delhi",
      court: "Delhi High Court",
      facts: "Client seeks refund of advance payment of INR 50 Lakhs.",
      tone: "Formal & Assertive",
    });

    expect(draft.templateType).toBe("Legal Notice");
    expect(draft.content).toContain("LEGAL NOTICE");
    expect(draft.content).toContain("INR [Amount]");
    expect(draft.validationWarnings.length).toBeGreaterThan(0);
    expect(draft.demo).toBe(true);
  });
});
