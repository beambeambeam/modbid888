import { redirect } from "next/navigation"

import { getMinigameAction } from "~/app/minigames/actions"
import Blackjack from "~/app/minigames/blackjack/blackjack"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"

import MinigameTable from "../table"

async function BlackjackPage() {
  const [balance] = await getCurrentBalanceAction()
  const [minigame] = await getMinigameAction({
    minigameId: 1,
  })

  if (balance === null || balance === undefined || !minigame) {
    return redirect("/")
  }

  return (
    <div className="w-full grid grid-cols-3">
      <div></div>
      <div className="flex flex-col">
        <Blackjack
          balance={balance}
          multiplier={minigame.winMultiplier}
          minigameId={minigame.id}
        />
        <MinigameTable minigameId={1} />
      </div>
      <div></div>
    </div>
  )
}

export default BlackjackPage
