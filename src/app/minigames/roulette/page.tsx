"use client"

import React from "react"

import Loading from "~/app/minigames/_components/loading"
import Roulette from "~/app/minigames/roulette/roulette"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"
import { useServerActionQuery } from "~/hooks/server-action-hooks"

function RoulettePage() {
  const { data: balance, isLoading } = useServerActionQuery(
    getCurrentBalanceAction,
    {
      queryKey: ["balance"],
      input: undefined,
    }
  )

  if (balance === null || balance === undefined || isLoading) {
    return <Loading />
  }

  return (
    <div>
      <Roulette balance={balance} minigameId={2} />
    </div>
  )
}

export default RoulettePage
