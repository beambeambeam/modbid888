"use client"

import React from "react"

import Loading from "~/app/minigames/_components/loading"
import HiloGame from "~/app/minigames/hilo/hilogame"
import MinigameTable from "~/app/minigames/table"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"
import { useServerActionQuery } from "~/hooks/server-action-hooks"

function HiloPage() {
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
    <div className="flex flex-col px-10">
      <HiloGame balance={balance} minigameId={3} />
      <MinigameTable minigameId={3} />
    </div>
  )
}

export default HiloPage
