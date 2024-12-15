import React from "react"
import { redirect } from "next/navigation"

import HiloGame from "~/app/minigames/hilo/hilogame"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"

import MinigameTable from "../table"

async function HiloPage() {
  const [balance] = await getCurrentBalanceAction()

  if (balance === null || balance === undefined) {
    return redirect("/")
  }

  return (
    <div className="flex flex-col px-10">
      <HiloGame balance={balance} minigameId={3} />
      <MinigameTable minigameId={3} />
    </div>
  )
}

export default HiloPage
