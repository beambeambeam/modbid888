"use server"

import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"
import { z } from "zod"

import { createAccount } from "~/data-access/accounts"
import { createProfile } from "~/data-access/profiles"
import { createUser, getUserByEmail } from "~/data-access/users"
import { PublicError } from "~/errors"
import { rateLimitByIp } from "~/lib/limiter"
import { unauthenticatedAction } from "~/lib/safe-action"
import { setSession } from "~/lib/session"

export const signUpAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: "register", limit: 3, window: 30000 })
    const user = await registerUserUseCase(input.email, input.password)
    await setSession(user.id)
  })

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new PublicError("An user with that email already exists.")
  }
  const user = await createUser(email)
  await createAccount(user.id, password)

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  })
  await createProfile(user.id, displayName)

  return { id: user.id }
}
