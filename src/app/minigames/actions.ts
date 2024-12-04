import { z } from "zod"

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
