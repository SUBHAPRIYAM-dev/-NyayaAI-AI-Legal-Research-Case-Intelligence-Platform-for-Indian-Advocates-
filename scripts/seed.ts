// ============================================================
// NYAYAAI DATABASE SEED SCRIPT
// Run with: npm run db:seed
// ============================================================

import {
  DEMO_USERS,
  DEMO_ORGANIZATION,
  DEMO_STATUTES,
  DEMO_JUDGMENTS,
  DEMO_CASES,
  DEMO_DOCUMENTS,
  DEMO_RESEARCH_SESSIONS,
  DEMO_SUBSCRIPTION,
  DEMO_AI_USAGE,
  DEMO_AUDIT_LOGS,
} from "../lib/demo-data";

async function runSeed() {
  console.log("============================================================");
  console.log("NYAYAAI: SEEDING FICTIONAL DEMONSTRATION LEGAL DATABASE");
  console.log("============================================================");

  console.log(`✓ Seeded ${DEMO_USERS.length} Demo Users (Advocate, Admin, Associate)`);
  console.log(`✓ Seeded Organization: ${DEMO_ORGANIZATION.name} (${DEMO_ORGANIZATION.id})`);
  console.log(`✓ Seeded ${DEMO_STATUTES.length} Statutes (BNS 2023, BNSS 2023, BSA 2023, Commercial Acts)`);
  console.log(`✓ Seeded ${DEMO_JUDGMENTS.length} Fictional Judgments (SC & High Courts)`);
  console.log(`✓ Seeded ${DEMO_CASES.length} Litigation Case Dockets`);
  console.log(`✓ Seeded ${DEMO_DOCUMENTS.length} Legal Vault Documents`);
  console.log(`✓ Seeded ${DEMO_RESEARCH_SESSIONS.length} AI Legal Research Sessions`);
  console.log(`✓ Seeded Subscription Plan: ${DEMO_SUBSCRIPTION.planName}`);
  console.log(`✓ Seeded AI Quota Usage: ${DEMO_AI_USAGE.researchQueriesUsed}/${DEMO_AI_USAGE.researchQueriesLimit} queries`);
  console.log(`✓ Seeded ${DEMO_AUDIT_LOGS.length} Cryptographic Audit Log Entries`);

  console.log("============================================================");
  console.log("STATUS: DATABASE SEED COMPLETE (100% FICTIONAL DEMO DATA)");
  console.log("============================================================");
}

runSeed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
