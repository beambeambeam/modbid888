import { eq } from "drizzle-orm"

import { database } from "~/db"
import { minigames } from "~/db/schema"
import { MinigameId } from "~/types"

export async function getMinigame(id: MinigameId) {
  const minigame = await database.query.minigames.findFirst({
    where: eq(minigames.id, id),
  })
  return minigame
}
