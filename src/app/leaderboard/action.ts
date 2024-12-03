"use server"

import { getTop10Balance } from "~/data-access/profiles"
import { unauthenticatedAction } from "~/lib/safe-action"

export const getLeaderboardAction = unauthenticatedAction
  .createServerAction()
  .handler(async () => {
    const data = await getTop10Balance()
    return data
  })
