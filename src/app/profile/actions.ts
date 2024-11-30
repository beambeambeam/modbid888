"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { invalidateSession, validateRequest } from "~/auth"
import { updatePassword } from "~/data-access/accounts"
import { userChangeLogs } from "~/data-access/logs"
import { getProfile, updateProfile } from "~/data-access/profiles"
import { verifyPassword } from "~/data-access/users"
import { createTransaction } from "~/data-access/utils"
import { NotFoundError } from "~/errors"
import { authenticatedAction } from "~/lib/safe-action"

export default authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    const info = await getProfile(ctx.user.id)

    return info
  })

export const updateDisplayNameAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      newDisplayName: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    await updateProfile(ctx.user.id, {
      displayName: input.newDisplayName,
    })

    await userChangeLogs(ctx.user.id, "displayname changed")
  })

export const updatePasswordAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      newPassword: z.string().min(6),
      oldPassword: z.string().min(6),
    })
  )
  .handler(async ({ input, ctx }) => {
    const verify = await verifyPassword(ctx.user.email, input.oldPassword)

    if (!verify) {
      throw NotFoundError
    }

    await createTransaction(async (trx) => {
      await updatePassword(ctx.user.id, input.newPassword, trx)
      await userChangeLogs(ctx.user.id, "password changed")
    })

    const { session } = await validateRequest()
    if (!session) {
      redirect("/sign-in")
    }
    await invalidateSession(session.id)
    redirect("/")
  })
