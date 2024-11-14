import { sha256 } from "@oslojs/crypto/sha2"
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding"

import { database } from "~/db"
import { Session, sessions } from "~/db/schema"

const SESSION_REFRESH_INTERVAL_MS = 1000 * 60 * 60 * 24 * 15
const SESSION_MAX_DURATION_MS = SESSION_REFRESH_INTERVAL_MS * 2

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + SESSION_MAX_DURATION_MS),
  }
  await database.insert(sessions).values(session)
  return session
}
