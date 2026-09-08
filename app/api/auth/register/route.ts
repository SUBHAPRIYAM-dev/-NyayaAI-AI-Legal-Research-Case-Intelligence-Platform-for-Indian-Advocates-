import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, registerNewUser, COOKIE_NAME } from "@/lib/auth";
import { logAuditEvent } from "@/lib/security";
import { User } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, category, state, practiceAreas } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "Name and email are required fields." },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || (category === "Law Firm Admin" ? "Admin" : "Partner"),
      category: category || "Advocate",
      state: state || "Delhi NCR",
      practiceAreas: practiceAreas || ["General Practice"],
      organizationId: "org-demo-firm-01",
      organizationName: "Chambers of " + name + " (Demo)",
      createdAt: new Date().toISOString(),
      isDemo: true,
    };

    registerNewUser(newUser);

    const token = await createSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      organizationId: newUser.organizationId,
      organizationName: newUser.organizationName,
      category: newUser.category,
    });

    logAuditEvent({
      organizationId: newUser.organizationId,
      userId: newUser.id,
      userEmail: newUser.email,
      action: "USER_LOGIN",
      details: `New registration completed for ${newUser.email}`,
    });

    const response = NextResponse.json({
      success: true,
      user: newUser,
      token,
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Registration processing encountered an error." },
      { status: 500 }
    );
  }
}
