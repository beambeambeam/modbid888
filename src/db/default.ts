import { Minigame } from "~/db/schema"

export const MINIGAME_DEFAULT: Minigame[] = [
  {
    id: 1,
    name: "blackjack",
    description: "blackjack",
    winMultiplier: 1.8,
  },
  {
    id: 2,
    name: "roulette",
    description: "roulette",
    winMultiplier: 0,
  },
]
