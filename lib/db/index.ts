import {
  CaseRecord,
  DocumentRecord,
  ResearchSession,
  LegalDraft,
  SubscriptionInfo,
  AIUsageMetrics,
  AuditLogEntry,
  FeatureFlagConfig,
  SystemHealthStatus,
  User,
  LegalSource
} from "@/types";
import {
  DEMO_CASES,
  DEMO_DOCUMENTS,
  DEMO_JUDGMENTS,
  DEMO_RESEARCH_SESSIONS,
  DEMO_STATUTES,
  DEMO_SUBSCRIPTION,
  DEMO_AI_USAGE,
  DEMO_USERS,
  StatuteRecord
} from "@/lib/demo-data";
import { assertTenantAccess } from "@/lib/security";

// In-Memory Database State (persisted across requests during server runtime)
interface DatabaseState {
  users: User[];
  cases: CaseRecord[];
  documents: DocumentRecord[];
  researchSessions: ResearchSession[];
  drafts: LegalDraft[];
  statutes: StatuteRecord[];
  judgments: LegalSource[];
  subscriptions: Record<string, SubscriptionInfo>;
  aiUsage: Record<string, AIUsageMetrics>;
  featureFlags: FeatureFlagConfig;
}

const dbState: DatabaseState = {
  users: [...DEMO_USERS],
  cases: [...DEMO_CASES],
  documents: [...DEMO_DOCUMENTS],
  researchSessions: [...DEMO_RESEARCH_SESSIONS],
  drafts: [],
  statutes: [...DEMO_STATUTES],
  judgments: [...DEMO_JUDGMENTS],
  subscriptions: {
    "org-demo-firm-01": { ...DEMO_SUBSCRIPTION },
  },
  aiUsage: {
    "org-demo-firm-01": { ...DEMO_AI_USAGE },
  },
  featureFlags: {
    aiResearch: true,
    citationVerification: true,
    documentAnalysis: true,
    draftingEngine: true,
    billingSystem: true,
    firmWorkspace: true,
    realGeminiIntegration: false,
  },
};

export const db = {
  // Cases
  cases: {
    list: (orgId: string): CaseRecord[] => {
      return dbState.cases.filter((c) => c.organizationId === orgId);
    },
    getById: (id: string, orgId: string): CaseRecord | undefined => {
      const item = dbState.cases.find((c) => c.id === id);
      if (item) assertTenantAccess({ organizationId: orgId }, item.organizationId);
      return item;
    },
    create: (newCase: CaseRecord): CaseRecord => {
      dbState.cases.unshift(newCase);
      return newCase;
    },
    update: (id: string, orgId: string, updates: Partial<CaseRecord>): CaseRecord | null => {
      const index = dbState.cases.findIndex((c) => c.id === id);
      if (index === -1) return null;
      assertTenantAccess({ organizationId: orgId }, dbState.cases[index].organizationId);
      dbState.cases[index] = { ...dbState.cases[index], ...updates, updatedAt: new Date().toISOString() };
      return dbState.cases[index];
    },
    delete: (id: string, orgId: string): boolean => {
      const index = dbState.cases.findIndex((c) => c.id === id);
      if (index === -1) return false;
      assertTenantAccess({ organizationId: orgId }, dbState.cases[index].organizationId);
      dbState.cases.splice(index, 1);
      return true;
    },
  },

  // Documents
  documents: {
    list: (orgId: string): DocumentRecord[] => {
      return dbState.documents.filter((d) => d.organizationId === orgId);
    },
    getById: (id: string, orgId: string): DocumentRecord | undefined => {
      const doc = dbState.documents.find((d) => d.id === id);
      if (doc) assertTenantAccess({ organizationId: orgId }, doc.organizationId);
      return doc;
    },
    create: (doc: DocumentRecord): DocumentRecord => {
      dbState.documents.unshift(doc);
      return doc;
    },
    delete: (id: string, orgId: string): boolean => {
      const index = dbState.documents.findIndex((d) => d.id === id);
      if (index === -1) return false;
      assertTenantAccess({ organizationId: orgId }, dbState.documents[index].organizationId);
      dbState.documents.splice(index, 1);
      return true;
    },
  },

  // Research Sessions
  research: {
    list: (orgId: string): ResearchSession[] => {
      return dbState.researchSessions.filter((s) => s.organizationId === orgId);
    },
    getById: (id: string, orgId: string): ResearchSession | undefined => {
      const session = dbState.researchSessions.find((s) => s.id === id);
      if (session) assertTenantAccess({ organizationId: orgId }, session.organizationId);
      return session;
    },
    create: (session: ResearchSession): ResearchSession => {
      dbState.researchSessions.unshift(session);
      return session;
    },
    update: (id: string, orgId: string, updates: Partial<ResearchSession>): ResearchSession | null => {
      const index = dbState.researchSessions.findIndex((s) => s.id === id);
      if (index === -1) return null;
      assertTenantAccess({ organizationId: orgId }, dbState.researchSessions[index].organizationId);
      dbState.researchSessions[index] = { ...dbState.researchSessions[index], ...updates, updatedAt: new Date().toISOString() };
      return dbState.researchSessions[index];
    },
  },

  // Drafts
  drafts: {
    list: (orgId: string): LegalDraft[] => {
      return dbState.drafts.filter((d) => d.organizationId === orgId);
    },
    create: (draft: LegalDraft): LegalDraft => {
      dbState.drafts.unshift(draft);
      return draft;
    },
    getById: (id: string, orgId: string): LegalDraft | undefined => {
      const item = dbState.drafts.find((d) => d.id === id);
      if (item) assertTenantAccess({ organizationId: orgId }, item.organizationId);
      return item;
    },
  },

  // Statutes & Judgments (Global Authority Knowledge Base)
  authorities: {
    listStatutes: (): StatuteRecord[] => dbState.statutes,
    listJudgments: (): LegalSource[] => dbState.judgments,
    createSource: (source: LegalSource): LegalSource => {
      dbState.judgments.unshift(source);
      return source;
    },
    updateSource: (id: string, updates: Partial<LegalSource>): LegalSource | null => {
      const index = dbState.judgments.findIndex((j) => j.id === id);
      if (index === -1) return null;
      dbState.judgments[index] = { ...dbState.judgments[index], ...updates };
      return dbState.judgments[index];
    },
    deleteSource: (id: string): boolean => {
      const index = dbState.judgments.findIndex((j) => j.id === id);
      if (index === -1) return false;
      dbState.judgments.splice(index, 1);
      return true;
    },
  },

  // Subscriptions & Usage
  billing: {
    getSubscription: (orgId: string): SubscriptionInfo => {
      return dbState.subscriptions[orgId] || {
        organizationId: orgId,
        planId: "free",
        planName: "Free Starter",
        amountInr: 0,
        billingCycle: "monthly",
        status: "active",
        currentPeriodEnd: "2026-12-31T23:59:59Z",
        provider: "mock",
      };
    },
    updatePlan: (orgId: string, planId: "free" | "advocate" | "professional" | "firm"): SubscriptionInfo => {
      const planNames = {
        free: "Free Starter",
        advocate: "Advocate Individual",
        professional: "Professional Chambers",
        firm: "Enterprise Law Firm",
      };
      const planPrices = { free: 0, advocate: 999, professional: 2499, firm: 7999 };
      const planLimits = {
        free: { research: 10, doc: 5, draft: 5, citation: 20 },
        advocate: { research: 500, doc: 50, draft: 50, citation: 500 },
        professional: { research: 2000, doc: 100, draft: 150, citation: 1000 },
        firm: { research: 10000, doc: 1000, draft: 1000, citation: 10000 },
      };

      const updated: SubscriptionInfo = {
        organizationId: orgId,
        planId,
        planName: planNames[planId],
        amountInr: planPrices[planId],
        billingCycle: "monthly",
        status: "active",
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        provider: "mock",
      };
      dbState.subscriptions[orgId] = updated;

      // Update limits
      const usage = dbState.aiUsage[orgId] || { ...DEMO_AI_USAGE, organizationId: orgId };
      usage.researchQueriesLimit = planLimits[planId].research;
      usage.documentAnalysesLimit = planLimits[planId].doc;
      usage.draftsGeneratedLimit = planLimits[planId].draft;
      usage.citationChecksLimit = planLimits[planId].citation;
      dbState.aiUsage[orgId] = usage;

      return updated;
    },
    getUsage: (orgId: string): AIUsageMetrics => {
      return dbState.aiUsage[orgId] || { ...DEMO_AI_USAGE, organizationId: orgId };
    },
    incrementUsage: (orgId: string, metric: "research" | "document" | "draft" | "citation"): boolean => {
      const usage = db.billing.getUsage(orgId);
      if (metric === "research") {
        if (usage.researchQueriesUsed >= usage.researchQueriesLimit) return false;
        usage.researchQueriesUsed += 1;
        usage.tokensConsumed += 1250;
      } else if (metric === "document") {
        if (usage.documentAnalysesUsed >= usage.documentAnalysesLimit) return false;
        usage.documentAnalysesUsed += 1;
        usage.tokensConsumed += 4500;
      } else if (metric === "draft") {
        if (usage.draftsGeneratedUsed >= usage.draftsGeneratedLimit) return false;
        usage.draftsGeneratedUsed += 1;
        usage.tokensConsumed += 2800;
      } else if (metric === "citation") {
        if (usage.citationChecksUsed >= usage.citationChecksLimit) return false;
        usage.citationChecksUsed += 1;
        usage.tokensConsumed += 350;
      }
      dbState.aiUsage[orgId] = usage;
      return true;
    },
  },

  // Feature Flags
  flags: {
    get: (): FeatureFlagConfig => dbState.featureFlags,
    toggle: (key: keyof FeatureFlagConfig): FeatureFlagConfig => {
      dbState.featureFlags[key] = !dbState.featureFlags[key];
      return dbState.featureFlags;
    },
  },

  // System Health
  system: {
    getHealth: (): SystemHealthStatus => {
      const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
      return {
        api: "Operational",
        database: "Operational",
        redis: "Demo Mode",
        aiService: hasKey ? "Operational" : "Demo AI Mode",
        queue: "In-Memory Mode",
        storage: "Local Emulated",
        geminiConnected: hasKey,
        version: "1.0.0-saas-prototype",
        uptimeSeconds: Math.floor(process.uptime()),
      };
    },
  },
};
