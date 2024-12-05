"use server"

import { getTop10Balance } from "~/data-access/profiles"
import { rateLimitByIp } from "~/lib/limiter"
import { unauthenticatedAction } from "~/lib/safe-action"

export const getLeaderboardAction = unauthenticatedAction
  .createServerAction()
  .handler(async () => {
    await rateLimitByIp({
      key: `leaderboard`,
      limit: 10,
      window: 10000,
    })
    const data = await getTop10Balance()
    return data
  })
