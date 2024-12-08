"use server"

import { z } from "zod"

import { getTop3MinigameById } from "~/data-access/logs"
import { getMinigame } from "~/data-access/minigames"
import { authenticatedAction } from "~/lib/safe-action"

export const getMinigameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      minigameId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    const minigame = await getMinigame(input.minigameId)

    return minigame
  })

export const getTop3BetAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      minigameId: z.number(),
    })
  )
  .handler(async ({ input }) => {
    const top3 = await getTop3MinigameById(input.minigameId)

    return top3
  })
