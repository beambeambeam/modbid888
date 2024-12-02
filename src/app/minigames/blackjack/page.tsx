import { redirect } from "next/navigation"

import Blackjack from "~/app/minigames/blackjack/blackjack"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"

import { getMinigameAction } from "../actions"

async function BlackjackPage() {
  const [balance] = await getCurrentBalanceAction()
  const [minigame] = await getMinigameAction({
    minigameId: 1,
  })

  if (!balance || !minigame) {
    redirect("/")
  }

  return (
    <Blackjack
      balance={balance}
      multiplier={minigame.winMultiplier}
      minigameId={minigame.id}
    />
  )
}

export default BlackjackPage
