import { desc, eq } from "drizzle-orm"
import { nanoid } from "nanoid"

import { database } from "~/db"
import { betLogs, minigames, NewBetLog, userLogs } from "~/db/schema"
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

export async function getBetLogWithMinigamenames(userId: UserId) {
  return await database
    .select({
      id: betLogs.id,
      minigame: minigames.name,
      timestamp: betLogs.timestamp,
      betAmount: betLogs.betAmount,
      betResult: betLogs.betResult,
      profit: betLogs.profit,
    })
    .from(betLogs)
    .where(eq(betLogs.userId, userId))
    .leftJoin(minigames, eq(minigames.id, betLogs.minigamesId))
}
