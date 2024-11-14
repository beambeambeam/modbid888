import { eq } from "drizzle-orm"

import { database } from "~/db"
import { userLogs, users } from "~/db/schema"
import { UserId } from "~/use-cases/types"

export async function deleteUser(userId: UserId) {
  await database.delete(users).where(eq(users.id, userId))
  addUserLogs(userId, "deleted")
}

export async function getUser(userId: UserId) {
  const user = await database.query.users.findFirst({
    where: eq(users.id, userId),
  })

  return user
}

export async function createUser(email: string) {
  const [user] = await database
    .insert(users)
    .values({
      email,
    })
    .returning()

  addUserLogs(user.id, "created")
  return user
}

export async function getUserByEmail(email: string) {
  const user = await database.query.users.findFirst({
    where: eq(users.email, email),
  })

  return user
}

export async function addUserLogs(userId: UserId, action: string) {
  await database.insert(userLogs).values({
    userId,
    action,
    timestamp: new Date(),
  })
}
