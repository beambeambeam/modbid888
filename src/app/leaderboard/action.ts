"use server"

import { unauthenticatedAction } from "~/lib/safe-action"

export const getLeaderboardAction = unauthenticatedAction
  .createServerAction()
  .handler(async () => {
    return []
  })
