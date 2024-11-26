"use server"

import { z } from "zod"

import { userChangeLogs } from "~/data-access/logs"
import { getProfile, updateProfile } from "~/data-access/profiles"
import { authenticatedAction } from "~/lib/safe-action"
import { getCurrentUser } from "~/lib/session"

export const getUserProfile = authenticatedAction
  .createServerAction()
  .handler(async () => {
    const user = await getCurrentUser()

    if (!user?.id) {
      throw new Error("User ID is undefined")
    }
    const info = await getProfile(user.id)

    return info
  })

export const updateDisplayNameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      newDisplayName: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const user = await getCurrentUser()

    if (!user?.id) {
      throw new Error("User ID is undefined")
    }

    await updateProfile(user.id, {
      displayName: input.newDisplayName,
    })

    await userChangeLogs(user.id, "displayname changed")
  })
