import { AuditLogEntry, User } from "@/types";
import { DEMO_AUDIT_LOGS } from "@/lib/demo-data";

// In-memory audit log storage initialized with demo data
let auditLogs: AuditLogEntry[] = [...DEMO_AUDIT_LOGS];

export function logAuditEvent(params: {
  organizationId: string;
  userId: string;
  userEmail: string;
  action: AuditLogEntry["action"];
  details: string;
  ipAddress?: string;
}): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    organizationId: params.organizationId,
    userId: params.userId,
    userEmail: params.userEmail,
    action: params.action,
    details: params.details,
    ipAddress: params.ipAddress || "127.0.0.1 (Local/Demo)",
    timestamp: new Date().toISOString(),
  };

  // Prepend to maintain newest first, capped at 200 entries in memory
  auditLogs.unshift(newEntry);
  if (auditLogs.length > 200) {
    auditLogs = auditLogs.slice(0, 200);
  }
  return newEntry;
}

export function getAuditLogs(organizationId?: string): AuditLogEntry[] {
  if (!organizationId) return auditLogs;
  return auditLogs.filter((log) => log.organizationId === organizationId);
}

// Tenant Isolation assertion
export class TenantAccessError extends Error {
  constructor(message = "Access denied: Unauthorized cross-tenant resource access") {
    super(message);
    this.name = "TenantAccessError";
  }
}

export function assertTenantAccess(user: { organizationId: string }, entityOrgId: string): void {
  if (user.organizationId !== entityOrgId) {
    throw new TenantAccessError();
  }
}

// Rate Limiter implementation
interface RateLimitBucket {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitBucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 60,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const bucket = rateLimitStore.get(identifier);

  if (!bucket || now > bucket.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowSeconds * 1000,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetSeconds: windowSeconds,
    };
  }

  if (bucket.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((bucket.resetTime - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: maxRequests - bucket.count,
    resetSeconds: Math.ceil((bucket.resetTime - now) / 1000),
  };
}
