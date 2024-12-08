import {
  getBalanceByUserId,
  getProfileDisplayName,
} from "~/data-access/profiles"
import { authenticatedAction } from "~/lib/safe-action"

export const getProfileAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    return await getProfileDisplayName(ctx.user.id)
  })

export const getBalanceAction = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx }) => {
    return await getBalanceByUserId(ctx.user.id)
  })
