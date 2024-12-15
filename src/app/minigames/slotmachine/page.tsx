import React from "react"
import { redirect } from "next/navigation"

import { getCurrentBalanceAction } from "~/hooks/bet/actions"

import MinigameTable from "../table"
import SlotMachine from "./SlotMachine"

const SlotPage: React.FC = async () => {
  const [balance] = await getCurrentBalanceAction()

  if (balance === null || balance === undefined) {
    return redirect("/")
  }

  return (
    <div className="h-full w-full flex flex-col gap-6 px-20 p-6">
      <SlotMachine minigameId={4} balance={balance} />
      <MinigameTable minigameId={4} />
    </div>
  )
}

export default SlotPage
