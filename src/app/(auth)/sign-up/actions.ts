"use server"

import { z } from "zod"

import { rateLimitByIp } from "~/lib/limiter"
import { unauthenticatedAction } from "~/lib/safe-action"
import { setSession } from "~/lib/session"
import { registerUserUseCase } from "~/use-cases/users"

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
