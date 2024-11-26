import { database } from "~/db"
import { userLogs } from "~/db/schema"
import { UserId } from "~/use-cases/types"

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
