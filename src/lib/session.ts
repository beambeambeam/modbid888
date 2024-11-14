import { cookies } from "next/headers"

import { createSession, generateSessionToken } from "~/auth"
import { UserId } from "~/use-cases/types"

const SESSION_COOKIE_NAME = "session"

export async function setSession(userId: UserId) {
  const token = generateSessionToken()
  const session = await createSession(token, userId)
  setSessionTokenCookie(token, session.expiresAt)
}

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  ;(await cookies()).set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}
