"use client"

import React from "react"

import Loading from "~/app/minigames/_components/loading"
import SpinWheel from "~/app/minigames/spinningwheel/SpinWheel"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"
import { useServerActionQuery } from "~/hooks/server-action-hooks"

import MinigameTable from "../table"

function WheelPage() {
  const {
    data: balance,
    isLoading,
    refetch,
  } = useServerActionQuery(getCurrentBalanceAction, {
    queryKey: ["balance"],
    input: undefined,
  })

  if (balance === null || balance === undefined || isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col px-20 gap-4 h-full items-center justify-center">
      <SpinWheel minigameId={5} balance={balance} refetch={refetch} />
      <MinigameTable minigameId={5} />
    </div>
  )
}

export default WheelPage
