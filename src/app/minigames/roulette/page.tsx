import React from "react"
import { redirect } from "next/navigation"

import Roulette from "~/app/minigames/roulette/roulette"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"

async function RoulettePage() {
  const [balance] = await getCurrentBalanceAction()

  if (balance === null || balance === undefined) {
    return redirect("/")
  }
  return (
    <div>
      <Roulette balance={balance} minigameId={2} />
    </div>
  )
}

export default RoulettePage
