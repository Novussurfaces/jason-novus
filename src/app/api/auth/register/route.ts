import { NextResponse } from "next/server";
import { createUser, createToken, setSessionCookie } from "@/lib/auth";
import { triggerN8nWebhook } from "@/lib/n8n";

export async function POST(request: Request) {
  try {
    const { email, password, name, phone, company } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "PASSWORD_TOO_SHORT" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    const user = await createUser({ email, password, name, phone, company });
    const token = await createToken(user);
    await setSessionCookie(token);

    // Notify n8n of new registration
    triggerN8nWebhook("registration", {
      name: user.name,
      email: user.email,
      phone: user.phone,
      company: user.company,
    });

    return NextResponse.json({ user });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_EXISTS") {
      return NextResponse.json(
        { error: "EMAIL_EXISTS" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
