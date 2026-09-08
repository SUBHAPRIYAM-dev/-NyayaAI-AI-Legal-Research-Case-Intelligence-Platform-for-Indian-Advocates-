// ============================================================
// NYAYAAI CORE TYPES & DOMAIN MODELS
// ============================================================

export type UserRole = "Owner" | "Admin" | "Partner" | "Associate" | "Researcher" | "Viewer";

export type ProfessionalCategory = 
  | "Advocate"
  | "Law Student"
  | "Legal Researcher"
  | "Corporate Legal"
  | "Law Firm Admin"
  | "Other";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  category: ProfessionalCategory;
  state?: string;
  practiceAreas?: string[];
  organizationId: string;
  organizationName: string;
  createdAt: string;
  avatarUrl?: string;
  isDemo?: boolean;
}

export interface Organization {
  id: string;
  name: string;
  planId: "free" | "advocate" | "professional" | "firm";
  memberCount: number;
  createdAt: string;
  isDemo?: boolean;
}

export type AuthorityLevel = 
  | "Supreme Court of India"
  | "High Court"
  | "Central Statute"
  | "State Statute"
  | "Tribunal"
  | "Regulatory Regulation";

export type VerificationStatus = 
  | "VERIFIED"
  | "PARTIALLY VERIFIED"
  | "UNVERIFIED"
  | "CONFLICTING"
  | "DEMO";

export interface LegalSource {
  id: string;
  title: string;
  court: string;
  year: number;
  date: string;
  citation: string;
  legalArea: string;
  authorityLevel: AuthorityLevel;
  verificationStatus: VerificationStatus;
  relevantSection?: string;
  url?: string;
  isHistorical?: boolean; // e.g. IPC vs BNS
  precedentStatus: "Good Law" | "Distinguished" | "Clarified" | "Overruled" | "Pending Review";
  summary: string;
  demo: true; // Mandatory flag for demo safety
}

export interface StructuredResearchResponse {
  legalIssue: string;
  shortAnswer: string;
  applicableLaw: string[];
  authorities: string[];
  analysis: string;
  supportingAuthorities: string[];
  contraryAuthorities: string[];
  practicalConsiderations: string[];
  unresolvedQuestions: string[];
  confidence: "high" | "medium" | "low";
  verificationStatus: VerificationStatus;
  sources: LegalSource[];
  disclaimer: string;
}

export interface ResearchMessage {
  id: string;
  sessionId: string;
  sender: "user" | "ai" | "system";
  content: string;
  structuredResponse?: StructuredResearchResponse;
  timestamp: string;
  stagesCompleted?: string[];
}

export interface ResearchSession {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  previewQuery: string;
  legalArea: string;
  createdAt: string;
  updatedAt: string;
  isSaved?: boolean;
  messages: ResearchMessage[];
  sources: LegalSource[];
}

export type CaseStatus = "Active" | "Pending" | "Closed" | "Archived";

export interface CaseEvent {
  id: string;
  caseId: string;
  title: string;
  type: "Filing" | "Notice" | "Reply" | "Evidence" | "Hearing" | "Arguments" | "Order" | "Procedural";
  date: string;
  description: string;
  documentId?: string;
  documentName?: string;
  notes?: string;
}

export interface CaseHearing {
  id: string;
  caseId: string;
  court: string;
  bench: string;
  hearingDate: string;
  purpose: string;
  status: "Scheduled" | "Completed" | "Adjourned";
  orderSummary?: string;
}

export interface CaseRecord {
  id: string;
  organizationId: string;
  title: string;
  caseNumber: string;
  court: string;
  clientName: string;
  practiceArea: string;
  status: CaseStatus;
  nextHearingDate?: string;
  assignedLawyer: string;
  assignedLawyerEmail: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  events: CaseEvent[];
  hearings: CaseHearing[];
  documentsCount: number;
  demo: true;
}

export interface DocumentRecord {
  id: string;
  organizationId: string;
  caseId?: string;
  caseTitle?: string;
  name: string;
  fileType: "pdf" | "docx" | "txt" | "image";
  sizeBytes: number;
  pageCount: number;
  uploadedAt: string;
  status: "Uploading" | "Processing" | "Indexed" | "Analyzed" | "Failed";
  aiStatus: "Ready" | "Analyzing" | "Completed" | "Error";
  summary?: string;
  extractedProvisions?: string[];
  identifiedRisks?: string[];
  keyClauses?: { title: string; excerpt: string; significance: string }[];
  demo: true;
}

export interface JudgmentAnalysis {
  id: string;
  judgmentTitle: string;
  court: string;
  bench: string;
  date: string;
  citation: string;
  ratioDecidendi: string;
  obiterDicta: string[];
  factualSummary: string;
  issuesFramed: string[];
  argumentsAppellant: string[];
  argumentsRespondent: string[];
  statutesInterpreted: string[];
  overruledAuthorities: string[];
  distinguishingFeatures: string[];
  practicalTakeaway: string;
  demo: true;
}

export type DraftType = 
  | "Legal Notice"
  | "Bail Application"
  | "Anticipatory Bail Application"
  | "Writ Petition"
  | "Plaint"
  | "Written Statement"
  | "Reply"
  | "Affidavit"
  | "Application"
  | "Legal Opinion"
  | "Research Memorandum"
  | "Written Arguments"
  | "Client Communication"
  | "Contract Review";

export interface LegalDraft {
  id: string;
  organizationId: string;
  userId: string;
  title: string;
  templateType: DraftType;
  court?: string;
  jurisdiction: string;
  facts: string;
  tone: "Formal & Assertive" | "Persuasive & Academic" | "Concise & Urgent" | "Neutral & Analytical";
  content: string;
  citationsChecked: boolean;
  validationWarnings: string[];
  status: "Draft" | "Reviewed" | "Finalized";
  createdAt: string;
  updatedAt: string;
  demo: true;
}

export interface AIUsageMetrics {
  organizationId: string;
  periodMonth: string;
  researchQueriesUsed: number;
  researchQueriesLimit: number;
  documentAnalysesUsed: number;
  documentAnalysesLimit: number;
  draftsGeneratedUsed: number;
  draftsGeneratedLimit: number;
  citationChecksUsed: number;
  citationChecksLimit: number;
  tokensConsumed: number;
}

export interface SubscriptionInfo {
  organizationId: string;
  planId: "free" | "advocate" | "professional" | "firm";
  planName: string;
  amountInr: number;
  billingCycle: "monthly" | "annual";
  status: "active" | "canceled" | "past_due";
  currentPeriodEnd: string;
  provider: "mock" | "razorpay" | "stripe";
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  userEmail: string;
  action: 
    | "USER_LOGIN" 
    | "USER_LOGOUT" 
    | "RESEARCH_QUERY" 
    | "CITATION_VERIFIED" 
    | "DOCUMENT_UPLOADED" 
    | "DOCUMENT_ANALYZED" 
    | "CASE_CREATED" 
    | "DRAFT_GENERATED" 
    | "DRAFT_EXPORTED" 
    | "PLAN_CHANGED" 
    | "ADMIN_ACTION";
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemHealthStatus {
  api: "Operational" | "Degraded" | "Outage";
  database: "Operational" | "Degraded" | "Outage";
  redis: "Operational" | "Degraded" | "Demo Mode";
  aiService: "Operational" | "Degraded" | "Demo AI Mode";
  queue: "Operational" | "Degraded" | "In-Memory Mode";
  storage: "Operational" | "Degraded" | "Local Emulated";
  geminiConnected: boolean;
  version: string;
  uptimeSeconds: number;
}

export interface FeatureFlagConfig {
  aiResearch: boolean;
  citationVerification: boolean;
  documentAnalysis: boolean;
  draftingEngine: boolean;
  billingSystem: boolean;
  firmWorkspace: boolean;
  realGeminiIntegration: boolean;
}
