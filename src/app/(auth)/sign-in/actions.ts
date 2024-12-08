"use server"

import { cookies } from "next/headers"
import { z } from "zod"

import { getUserByEmail, verifyPassword } from "~/data-access/users"
import { LoginError } from "~/errors"
import { rateLimitByIp } from "~/lib/limiter"
import { unauthenticatedAction } from "~/lib/safe-action"
import { setSession } from "~/lib/session"

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .handler(async ({ input }) => {
    await cookies()

    await rateLimitByIp({ key: input.email, limit: 3, window: 30000 })
    const user = await signInUserUseCase(input.email, input.password)

    await setSession(user.id)
  })

export async function signInUserUseCase(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    throw new LoginError()
  }

  const isPasswordCorrect = await verifyPassword(email, password)

  if (!isPasswordCorrect) {
    throw new LoginError()
  }

  return { id: user.id }
}
