import crypto from "crypto"

import { database } from "~/db"
import { accounts } from "~/db/schema"
import { UserId } from "~/use-cases/types"

import { hashPassword } from "./utils"

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
