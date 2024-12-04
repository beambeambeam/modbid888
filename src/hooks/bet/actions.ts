"use server"

import { nanoid } from "nanoid"
import { z } from "zod"

import { betLog } from "~/data-access/logs"
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
      betResult: z.enum(["win", "loss"]),
      minigameId: z.number(),
      multiplier: z.number(),
    })
  )
  .handler(async ({ ctx, input }) => {
    createTransaction(async (transaction) => {
      const profit = await updateBet(
        ctx.user.id,
        input.betAmount,
        input.betResult === "win" ? input.multiplier : -1,
        transaction
      )

      await betLog({
        userId: ctx.user.id,
        betAmount: input.betAmount,
        timestamp: new Date(),
        betResult: input.betResult,
        profit: profit,
        multiplier: input.betResult === "win" ? input.multiplier : -1,
        minigamesId: input.minigameId,
        id: nanoid(),
      })
    })
  })
