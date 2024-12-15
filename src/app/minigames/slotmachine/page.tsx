"use client"

import React from "react"

import Loading from "~/app/minigames/_components/loading"
import SlotMachine from "~/app/minigames/slotmachine/SlotMachine"
import MinigameTable from "~/app/minigames/table"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"
import { useServerActionQuery } from "~/hooks/server-action-hooks"

const SlotPage: React.FC = () => {
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
    <div className="h-full w-full flex flex-col gap-6 px-20 p-6">
      <SlotMachine minigameId={4} balance={balance} />
      <MinigameTable minigameId={4} />
    </div>
  )
}

export default SlotPage
