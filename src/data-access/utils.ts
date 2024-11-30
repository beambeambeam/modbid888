import crypto from "crypto"

import { database } from "~/db"

export const ITERATIONS = 10000

export async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err)
        resolve(derivedKey.toString("hex"))
      }
    )
  })
}

export async function createTransaction<T extends typeof database>(
  cb: (trx: T) => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await database.transaction(cb as any)
}
