import { animals, colors, uniqueNamesGenerator } from "unique-names-generator"

import { createAccount } from "~/data-access/accounts"
import { createProfile } from "~/data-access/profiles"
import { createUser, getUserByEmail } from "~/data-access/users"
import { PublicError } from "~/use-cases/errors"

export async function registerUserUseCase(email: string, password: string) {
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    throw new PublicError("An user with that email already exists.")
  }
  const user = await createUser(email)
  await createAccount(user.id, password)

  const displayName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    separator: " ",
    style: "capital",
  })
  await createProfile(user.id, displayName)

  return { id: user.id }
}
