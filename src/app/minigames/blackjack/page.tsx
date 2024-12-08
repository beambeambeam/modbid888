import { redirect } from "next/navigation"

import Blackjack from "~/app/minigames/blackjack/blackjack"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"

import MinigameTable from "../table"

async function BlackjackPage() {
  const [balance] = await getCurrentBalanceAction()

  if (balance === null || balance === undefined) {
    return redirect("/")
  }

  return (
    <div className="w-full grid grid-cols-3">
      <div></div>
      <div className="flex flex-col">
        <Blackjack balance={balance} minigameId={1} />
        <MinigameTable minigameId={1} />
      </div>
      <div></div>
    </div>
  )
}

export default BlackjackPage
