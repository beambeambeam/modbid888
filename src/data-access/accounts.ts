import crypto from "crypto"
import { and, eq } from "drizzle-orm"

import { hashPassword } from "~/data-access/utils"
import { database } from "~/db"
import { accounts } from "~/db/schema"
import { UserId } from "~/use-cases/types"

export async function createAccount(userId: UserId, password: string) {
  const salt = crypto.randomBytes(128).toString("base64")
  const hash = await hashPassword(password, salt)
  const [account] = await database
    .insert(accounts)
    .values({
      userId,
      password: hash,
      salt,
    })
    .returning()
  return account
}

export async function getAccountByUserId(userId: UserId) {
  const account = await database.query.accounts.findFirst({
    where: eq(accounts.userId, userId),
  })
  return account
}

export async function updatePassword(
  userId: UserId,
  password: string,
  trx = database
) {
  const salt = crypto.randomBytes(128).toString("base64")
  const hash = await hashPassword(password, salt)
  await trx
    .update(accounts)
    .set({
      password: hash,
      salt,
    })
    .where(and(eq(accounts.userId, userId)))
}
