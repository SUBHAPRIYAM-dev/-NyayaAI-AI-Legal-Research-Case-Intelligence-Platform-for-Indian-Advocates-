import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, findUserByEmail, COOKIE_NAME } from "@/lib/auth";
import { logAuditEvent } from "@/lib/security";
import { DEMO_USERS } from "@/lib/demo-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, demoRole } = body;

    let targetUser = findUserByEmail(email);

    // If demo role shortcut used
    if (demoRole === "admin") {
      targetUser = DEMO_USERS[1];
    } else if (demoRole === "advocate" || (!targetUser && email?.includes("demo"))) {
      targetUser = DEMO_USERS[0];
    }

    if (!targetUser) {
      // For demonstration convenience, allow any valid email to sign in as Advocate demo user
      if (email && email.includes("@")) {
        targetUser = {
          id: `user-${Date.now()}`,
          name: email.split("@")[0].replace(".", " "),
          email: email,
          role: "Partner",
          category: "Advocate",
          organizationId: "org-demo-firm-01",
          organizationName: "Lex Indica Law Chambers (Demo)",
          createdAt: new Date().toISOString(),
          isDemo: true,
        };
      } else {
        return NextResponse.json(
          { error: "Invalid credentials. Please use a valid email or demo button." },
          { status: 401 }
        );
      }
    }

    const token = await createSessionToken({
      userId: targetUser.id,
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      organizationId: targetUser.organizationId,
      organizationName: targetUser.organizationName,
      category: targetUser.category,
    });

    logAuditEvent({
      organizationId: targetUser.organizationId,
      userId: targetUser.id,
      userEmail: targetUser.email,
      action: "USER_LOGIN",
      details: `Successful authentication for ${targetUser.email} (${targetUser.role})`,
    });

    const response = NextResponse.json({
      success: true,
      user: targetUser,
      token,
    });

    // Set secure HTTP-only cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
