"use server"

import { z } from "zod"

import { getCurrentBalance, updateBet } from "~/data-access/profiles"
import { createTransaction } from "~/data-access/utils"
import { authenticatedAction } from "~/lib/safe-action"

export const getCurrentBalanceAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    const balance = await getCurrentBalance(ctx.user.id)

    return balance
  })

export const betTransaction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      betAmount: z.number().min(1),
      betResult: z.enum(["WIN", "LOSS"]),
      minigameId: z.number(),
      multiplier: z.number(),
    })
  )
  .handler(async ({ ctx, input }) => {
    createTransaction(async (transaction) => {
      const finalBalance = await updateBet(
        ctx.user.id,
        input.betAmount,
        input.betResult === "WIN" ? input.multiplier : -1,
        transaction
      )

      return finalBalance
    })
  })
