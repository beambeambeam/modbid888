import { desc, eq } from "drizzle-orm"

import { database } from "~/db"
import { profiles, Profiles } from "~/db/schema"
import { NotFoundError } from "~/errors"
import { UserId } from "~/types"

export async function createProfile(userId: UserId, displayName: string) {
  const [profile] = await database
    .insert(profiles)
    .values({
      userId,
      displayName,
      balance: 10000,
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

export async function getCurrentBalance(userId: UserId, trx = database) {
  const profile = await trx.query.profiles.findFirst({
    where: eq(profiles.userId, userId),
  })

  if (!profile) {
    throw NotFoundError
  }

  return profile?.balance
}

export async function updateBet(
  userId: UserId,
  betAmount: number,
  multiplier: number,
  trx = database
) {
  const profile = await trx.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  })

  if (!profile) {
    throw NotFoundError
  }

  await trx
    .update(profiles)
    .set({ balance: profile.balance + betAmount * multiplier })
    .where(eq(profiles.userId, userId))

  return betAmount * multiplier
}

export async function getTop10Balance() {
  const top10 = await database.query.profiles.findMany({
    limit: 10,
    orderBy: [desc(profiles.balance)],
  })
  return top10
}
