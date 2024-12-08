import "server-only"

import { cache } from "react"
import { cookies } from "next/headers"

import { createSession, generateSessionToken, validateRequest } from "~/auth"
import { AuthenticationError } from "~/errors"
import { UserId } from "~/types"

const SESSION_COOKIE_NAME = "session"

export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  })
}

export async function setSession(userId: UserId) {
  const token = generateSessionToken()
  const session = await createSession(token, userId)
  setSessionTokenCookie(token, session.expiresAt)
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export const assertAuthenticated = async () => {
  const user = await getCurrentUser()
  if (!user) {
    throw new AuthenticationError()
  }
  return user
}

export const getCurrentUser = cache(async () => {
  const { user } = await validateRequest()
  return user ?? undefined
})

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  })
}
