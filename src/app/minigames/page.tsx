import GameCard, { GameCardProps } from "~/app/minigames/_components/game-card"

const MINIGAMES: GameCardProps[] = [
  {
    title: "blackjack",
    desc: "Blackjack is a casino card game where players try to reach a hand total of 21 without exceeding it, aiming to beat the dealer through strategy, decision-making, and luck.",
    img: "/static/image/minigames/blackjack.svg",
  },
  {
    title: "roulette",
    desc: "Roulette is a popular casino game where players bet on where a ball will land on a spinning wheel. The wheel features numbered pockets, and bets can be placed on specific numbers, colors, or number ranges.",
    img: "/static/image/minigames/roulette.svg",
    disabled: true,
  },
]

function MinigamesPage() {
  return (
    <div className="w-full h-full flex items-center justify-center gap-2 flex-col lg:flex-row">
      {MINIGAMES.map((value) => (
        <div key={value.title}>
          <GameCard {...value} />
        </div>
      ))}
    </div>
  )
}
export default MinigamesPage
