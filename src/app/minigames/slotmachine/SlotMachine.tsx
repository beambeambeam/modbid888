"use client"

import React, { useRef, useState } from "react"
import NumberFlow from "@number-flow/react"
import { Coins, Volume2, VolumeX } from "lucide-react"
import { useServerAction } from "zsa-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { betTransaction } from "~/hooks/bet/actions"

import { MinigameProps } from "../actions"

const SYMBOLS = [
  { symbol: "🍒", weight: 5 },
  { symbol: "🍋", weight: 4 },
  { symbol: "🍉", weight: 3 },
  { symbol: "🍇", weight: 2 },
  { symbol: "🍓", weight: 2 },
  { symbol: "🍊", weight: 1 },
  { symbol: "🍎", weight: 1 },
  { symbol: "8️⃣", weight: 0.5 },
]

const SYMBOL_VALUES: { [key: string]: number } = {
  "🍒": 5,
  "🍋": 10,
  "🍉": 15,
  "🍇": 20,
  "🍓": 25,
  "🍊": 30,
  "🍎": 35,
  "8️⃣": 100,
}

const SPIN_DURATION = 2000

export default function SlotMachine({
  balance: apiBalance,
  minigameId,
}: MinigameProps) {
  const [reels, setReels] = useState(["8️⃣", "8️⃣", "8️⃣"])
  const [balance, setBalance] = useState(apiBalance)
  const [spinning, setSpinning] = useState(false)
  const [betAmount, setBetAmount] = useState(100)
  const [muted, setMuted] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [multiplier, setMultiplier] = useState(1)
  const [showInstructions, setShowInstructions] = useState(false)

  const { execute: updateBet } = useServerAction(betTransaction)

  const spinSound = useRef(new Audio("/sounds/spin.mp3"))
  const winSound = useRef(new Audio("/sounds/win.mp3"))
  const loseSound = useRef(new Audio("/sounds/lose.mp3"))

  const playSound = (sound: HTMLAudioElement) => {
    if (!muted) {
      sound.currentTime = 0
      sound.play()
    }
  }

  const getRandomSymbol = () => {
    const totalWeight = SYMBOLS.reduce(
      (total, symbol) => total + symbol.weight,
      0
    )
    let random = Math.random() * totalWeight
    for (const { symbol, weight } of SYMBOLS) {
      random -= weight
      if (random <= 0) return symbol
    }
    return SYMBOLS[0].symbol // Fallback
  }

  const spin = () => {
    if (spinning || balance < betAmount) return

    if (spinning || betAmount <= 99 || betAmount > balance) {
      setErrorMessage("Amount must be between 100 and your balance.")
      return
    }

    setSpinning(true)
    playSound(spinSound.current)
    setBalance((prev) => prev - betAmount)

    const intervalId = setInterval(() => {
      setReels((prev) => prev.map(() => getRandomSymbol()))
    }, 100)

    setTimeout(() => {
      clearInterval(intervalId)
      const finalReels = Array(3)
        .fill(0)
        .map(() => getRandomSymbol())
      setReels(finalReels)
      checkWin(finalReels)
      setSpinning(false)
    }, SPIN_DURATION)
  }

  const checkWin = (results: string[]) => {
    if (results[0] === results[1] && results[1] === results[2]) {
      const winAmount = betAmount * SYMBOL_VALUES[results[0]]
      setBalance((prev) => prev + winAmount)
      setLastWin(winAmount)
      setMultiplier(SYMBOL_VALUES[results[0]])
      playSound(winSound.current)

      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: multiplier,
      })
    } else {
      setLastWin(0)
      setMultiplier(1)
      playSound(loseSound.current)

      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "loss",
        multiplier: -1,
      })
    }
  }

  return (
    <div className=" bg-gradient-to-br text-foreground flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        <Card className="p-6">
          <CardHeader className="flex justify-between">
            <CardTitle className="font-alagard text-4xl font-normal">
              Slot Machine.
            </CardTitle>
            <Button
              onClick={() => setShowInstructions(!showInstructions)}
              className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 active:bg-gray-600"
            >
              {showInstructions ? "Hide Instructions" : "How to Play"}
            </Button>
          </CardHeader>
          <CardContent>
            {showInstructions && (
              <div className="mb-8 p-4 bg-gray-800 text-white rounded-lg">
                <h3 className="text-2xl font-bold mb-4">How to Play</h3>
                <p>1. Choose your bet amount (minimum of 100 credits).</p>
                <p>
                  2. Click &quot;SPIN&quot; to start the game. The reels will
                  spin and stop after a short duration.
                </p>
                <p>
                  3. If all three reels match, you win based on the multiplier
                  value for the matching symbol!
                </p>
                <p>
                  4. The winning symbols and their multiplier values are shown
                  below.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <NumberFlow className="text-2xl font-bold" value={balance} />
              </div>
              <Button
                size="icon"
                onClick={() => setMuted(!muted)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                {muted ? <VolumeX /> : <Volume2 />}
              </Button>
            </div>

            <div className="bg-gradient-to-b from-purple-800/50 to-purple-900/50 rounded-xl p-6 mb-8">
              <div className="flex justify-center gap-4 mb-8">
                {reels.map((symbol, index) => (
                  <div
                    key={index}
                    className={`w-32 h-32 flex items-center justify-center text-6xl
                    bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2
                    border-purple-500/30 shadow-lg ${spinning ? "animate-bounce" : ""}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4">
                <p>Bet amount</p>
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    className="bg-background"
                    type="number"
                    min="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                  />
                  <Button
                    onClick={() => setBetAmount(balance)}
                    className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    All In
                  </Button>
                </div>

                <Button
                  onClick={spin}
                  disabled={spinning || balance < betAmount}
                  className={`w-full max-w-md py-4 px-8 text-xl font-bold rounded-lg
                  transition-all transform hover:scale-105 ${
                    spinning || balance < betAmount
                      ? "bg-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                  }`}
                >
                  {spinning ? "Spinning..." : "SPIN"}
                </Button>
              </div>
            </div>

            {lastWin > 0 && (
              <div className="text-center text-2xl font-bold text-yellow-500 animate-pulse">
                You won {lastWin} credit! (Multiplier: x{multiplier})
              </div>
            )}

            {errorMessage && (
              <div className="text-red-500 mt-4 text-center">
                {errorMessage}
              </div>
            )}

            <div className="p-6 bg-gradient-to-br from-purple-800 via-gray-800 to-black text-white rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4">
                Multiplier Values
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍒 - x5 <span className="block text-xs">Rate 1.97%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍋 - x10 <span className="block text-xs">Rate 1.01%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍉 - x15 <span className="block text-xs">Rate 0.43%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍇 - x20 <span className="block text-xs">Rate 0.13%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍓 - x25 <span className="block text-xs">Rate 0.13%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍊 - x30 <span className="block text-xs">Rate 0.02%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  🍎 - x35 <span className="block text-xs">Rate 0.02%</span>
                </p>
                <p className="text-sm md:text-base lg:text-lg text-center">
                  8️⃣ - x100 <span className="block text-xs">Rate 0.002%</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
