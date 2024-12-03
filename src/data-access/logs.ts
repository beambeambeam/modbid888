import { desc, eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { database } from "~/db"
import { betLogs, NewBetLog, userLogs } from "~/db/schema"
import { MinigameId, UserId } from "~/types"

export async function userChangeLogs(userId: UserId, action: string) {
  await database
    .insert(userLogs)
    .values({
      id: nanoid(),
      userId: userId,
      action: action,
      timestamp: new Date(),
    })
    .returning()
}

export async function betLog(action: NewBetLog) {
  await database.insert(betLogs).values(action).returning()
}

export async function getTop3MinigameById(minigameId: MinigameId) {
  return await database.query.betLogs.findMany({
    where: eq(betLogs.minigamesId, minigameId),
    orderBy: [desc(betLogs.profit)],
    limit: 3,
  })
}
