import { redirect } from "next/navigation"

import Blackjack from "~/app/minigames/blackjack/blackjack"
import { getCurrentBalanceAction } from "~/hooks/bet/actions"

async function BlackjackPage() {
  const [data] = await getCurrentBalanceAction()

  if (!data) {
    redirect("/")
  }

  return <Blackjack balance={data} multiplier={1.8} minigameId={1} />
}

export default BlackjackPage
