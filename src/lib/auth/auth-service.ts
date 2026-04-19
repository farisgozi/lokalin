"use client";

import { ID, OAuthProvider } from "appwrite";
import { account, assertAppwriteConfigured } from "@/lib/appwrite/client";
import type { AuthUser, UserRole } from "@/lib/auth/types";

type AppwritePrefs = {
  role?: UserRole;
  umkmSubmitted?: boolean;
};

type AppwriteUser = {
  $id: string;
  name: string;
  email: string;
  prefs?: AppwritePrefs;
};

function resolveRole(user: AppwriteUser): UserRole {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && user.email.toLowerCase() === adminEmail) return "admin";
  if (user.prefs?.role === "owner" || user.prefs?.role === "admin") return user.prefs.role;
  return "user";
}

function toAuthUser(user: AppwriteUser): AuthUser {
  return {
    id: user.$id,
    name: user.name,
    email: user.email,
    role: resolveRole(user),
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    assertAppwriteConfigured();
    const current = (await account!.get()) as AppwriteUser;
    return toAuthUser(current);
  } catch {
    return null;
  }
}

export async function registerWithEmail(payload: {
  name: string;
  email: string;
  password: string;
  role: "user" | "owner";
}): Promise<AuthUser> {
  assertAppwriteConfigured();

  await account!.create(ID.unique(), payload.email, payload.password, payload.name);
  await account!.createEmailPasswordSession(payload.email, payload.password);
  await account!.updatePrefs({ role: payload.role });

  const current = (await account!.get()) as AppwriteUser;
  return toAuthUser(current);
}

export async function loginWithEmail(email: string, password: string): Promise<AuthUser> {
  assertAppwriteConfigured();

  await account!.createEmailPasswordSession(email, password);
  const current = (await account!.get()) as AppwriteUser;
  return toAuthUser(current);
}

export function loginWithGoogle(): void {
  assertAppwriteConfigured();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  // Use createOAuth2Token instead of createOAuth2Session
  // This passes userId+secret via URL params, avoiding cross-domain cookie issues
  account!.createOAuth2Token(
    OAuthProvider.Google,
    `${origin}/auth/callback`,
    `${origin}/login?error=oauth_cancelled`
  );
}

/**
 * Called from /auth/callback to exchange the OAuth token for a session.
 * createOAuth2Token redirects back with ?userId=...&secret=... in the URL.
 */
export async function createSessionFromToken(
  userId: string,
  secret: string
): Promise<void> {
  assertAppwriteConfigured();
  await account!.createSession(userId, secret);
}

const OAUTH_ROLE_KEY = "oauth-pending-role";

export function setOAuthPendingRole(role: UserRole): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(OAUTH_ROLE_KEY, role);
  }
}

function consumeOAuthPendingRole(): UserRole {
  if (typeof window === "undefined") return "owner";
  const role = localStorage.getItem(OAUTH_ROLE_KEY) as UserRole | null;
  localStorage.removeItem(OAUTH_ROLE_KEY);
  return role || "owner";
}

export async function ensureOAuthPrefs(): Promise<AuthUser> {
  assertAppwriteConfigured();
  const current = (await account!.get()) as AppwriteUser;

  // New Google user — read the role they selected before OAuth redirect
  if (!current.prefs?.role) {
    const selectedRole = consumeOAuthPendingRole();
    await account!.updatePrefs({ role: selectedRole });
    const updated = (await account!.get()) as AppwriteUser;
    return toAuthUser(updated);
  }

  return toAuthUser(current);
}

export async function logoutCurrentUser(): Promise<void> {
  assertAppwriteConfigured();
  await account!.deleteSession("current");
}
