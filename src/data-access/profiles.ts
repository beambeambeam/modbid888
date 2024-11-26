import { eq } from "drizzle-orm"

import { database } from "~/db"
import { profiles, Profiles } from "~/db/schema"
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

export async function getRoleByUserId(userId: UserId) {
  const user = await database.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })

  return user?.role
}

export async function getProfile(userId: UserId) {
  const profile = await database.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })

  return profile
}

export async function updateProfile(
  userId: UserId,
  updateProfile: Partial<Profiles>
) {
  await database
    .update(profiles)
    .set(updateProfile)
    .where(eq(profiles.userId, userId))
}
