import { eq } from "drizzle-orm"

import { getAccountByUserId } from "~/data-access/accounts"
import { database } from "~/db"
import { userLogs, users } from "~/db/schema"
import { UserId } from "~/use-cases/types"

import { hashPassword } from "./utils"

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

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    return false
  }

  const account = await getAccountByUserId(user.id)

  if (!account) {
    return false
  }

  const salt = account.salt
  const savedPassword = account.password

  if (!salt || !savedPassword) {
    return false
  }

  const hash = await hashPassword(plainTextPassword, salt)

  return hash === savedPassword
}
