"use server"

import { z } from "zod"

import { rateLimitByIp } from "~/lib/limiter"
import { unauthenticatedAction } from "~/lib/safe-action"

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
    console.log(input)
  })
