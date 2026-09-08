import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { User, UserRole } from "@/types";
import { DEMO_USERS } from "@/lib/demo-data";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "nyayaai-super-secure-jwt-secret-key-32-chars-min-change-in-prod";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET_STRING);
export const COOKIE_NAME = process.env.COOKIE_NAME || "nyayaai_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  organizationName: string;
  category: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// In-memory demo store for registered users during session
let registeredUsers: User[] = [...DEMO_USERS];

export function findUserByEmail(email: string): User | undefined {
  return registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
}

export function findUserById(id: string): User | undefined {
  return registeredUsers.find((u) => u.id === id);
}

export function registerNewUser(newUser: User): User {
  const existing = findUserByEmail(newUser.email);
  if (existing) {
    return existing;
  }
  registeredUsers.push(newUser);
  return newUser;
}

// Role-Based Access Control matrix
const ROLE_HIERARCHY: Record<UserRole, number> = {
  Owner: 100,
  Admin: 90,
  Partner: 80,
  Associate: 60,
  Researcher: 40,
  Viewer: 20,
};

export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return userRole === "Admin" || userRole === "Owner";
}

export function canManageMembers(userRole: UserRole): boolean {
  return userRole === "Admin" || userRole === "Owner" || userRole === "Partner";
}
