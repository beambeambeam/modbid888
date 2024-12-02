import { database } from "~/db"
import { betLogs, NewBetLog, userLogs } from "~/db/schema"
import { UserId } from "~/types"

export async function userChangeLogs(userId: UserId, action: string) {
  await database
    .insert(userLogs)
    .values({
      userId: userId,
      action: action,
      timestamp: new Date(),
    })
    .returning()
}

export async function betLog(action: NewBetLog) {
  await database.insert(betLogs).values(action).returning()
}
