"use server"

import { z } from "zod"

import { rateLimitByIp } from "~/lib/limiter"
import { unauthenticatedAction } from "~/lib/safe-action"
import { setSession } from "~/lib/session"
import { signInUserUseCase } from "~/use-cases/users"

export const signInAction = unauthenticatedAction
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
  .handler(async ({ input }) => {
    await rateLimitByIp({ key: input.email, limit: 3, window: 30000 })
    const user = await signInUserUseCase(input.email, input.password)
    await setSession(user.id)
  })
