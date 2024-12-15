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
  },
  {
    title: "hilo",
    desc: "Hi-Lo gambling is a betting game where players predict if the next outcome of a roll of dice will be higher or lower. It’s a simple game of chance often played for entertainment or gambling purposes",
    img: "/static/image/minigames/hilo.svg",
  },
  {
    title: "slotmachine",
    desc: "Slot machine gambling involves spinning reels with various symbols, aiming to align matching combinations for a payout. Players place bets, pull levers or press buttons, and rely on luck as the machine's random number generator determines the results.",
    img: "/static/image/minigames/slotmachine.svg",
  },
  {
    title: "spinningwheel",
    desc: "Spinning Wheel gambling involves a wheel divided into segments with different outcomes, such as numbers or colors. Players place bets on predicted results, and the wheel is spun. Winnings depend on luck and alignment with the winning segment.",
    img: "/static/image/minigames/spiningwheel.svg",
  },
]

function MinigamesPage() {
  return (
    <div className="w-full h-fit flex items-center justify-center gap-10 flex-col lg:flex-row lg:flex-wrap lg:p-10">
      {MINIGAMES.map((value) => (
        <div key={value.title}>
          <GameCard {...value} />
        </div>
      ))}
    </div>
  )
}
export default MinigamesPage
