import { database } from "~/db"
import { profiles } from "~/db/schema"
import { UserId } from "~/use-cases/types"

export async function createProfile(userId: UserId, displayName: string) {
  const [profile] = await database
    .insert(profiles)
    .values({
      userId,
      displayName,
    })
    .onConflictDoNothing()
    .returning()
  return profile
}
