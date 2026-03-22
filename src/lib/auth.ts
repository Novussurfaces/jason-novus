import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "novus-surfaces-secret-key-change-in-production-2026"
);

const COOKIE_NAME = "novus-session";

export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: "client" | "admin";
  createdAt: string;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
};

// ── In-memory store (swap for DB in production) ──
const users = new Map<string, User & { passwordHash: string }>();
const conversations = new Map<string, Conversation[]>();

// ── Password hashing ──
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ── JWT ──
export async function createToken(user: User): Promise<string> {
  return new SignJWT({ id: user.id, email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as "client" | "admin") || "client",
      createdAt: "",
    };
  } catch {
    return null;
  }
}

// ── Session (cookie-based) ──
export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ── User CRUD ──
export function findUserByEmail(email: string) {
  for (const user of users.values()) {
    if (user.email.toLowerCase() === email.toLowerCase()) return user;
  }
  return null;
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}): Promise<User> {
  const existing = findUserByEmail(data.email);
  if (existing) throw new Error("EMAIL_EXISTS");

  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const passwordHash = await hashPassword(data.password);

  const user: User & { passwordHash: string } = {
    id,
    email: data.email.toLowerCase(),
    name: data.name,
    phone: data.phone,
    company: data.company,
    role: "client",
    createdAt: new Date().toISOString(),
    passwordHash,
  };

  users.set(id, user);
  return { id, email: user.email, name: user.name, phone: user.phone, company: user.company, role: user.role, createdAt: user.createdAt };
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = findUserByEmail(email);
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return { id: user.id, email: user.email, name: user.name, phone: user.phone, company: user.company, role: user.role, createdAt: user.createdAt };
}

// ── Conversations ──
export function getUserConversations(userId: string): Conversation[] {
  return conversations.get(userId) || [];
}

export function getOrCreateConversation(userId: string): Conversation {
  const existing = conversations.get(userId) || [];
  const active = existing.find(
    (c) => Date.now() - new Date(c.updatedAt).getTime() < 30 * 60 * 1000 // within 30 min
  );
  if (active) return active;

  const conv: Conversation = {
    id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId,
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  existing.push(conv);
  conversations.set(userId, existing);
  return conv;
}

export function addMessageToConversation(
  userId: string,
  conversationId: string,
  message: ChatMessage
) {
  const convs = conversations.get(userId) || [];
  const conv = convs.find((c) => c.id === conversationId);
  if (conv) {
    conv.messages.push(message);
    conv.updatedAt = new Date().toISOString();
  }
}
