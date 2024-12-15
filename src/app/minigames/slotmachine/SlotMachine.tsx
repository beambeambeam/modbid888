"use client"

import React, { useRef, useState } from "react"
import { Coins, Volume2, VolumeX } from "lucide-react"

const SYMBOLS = ["💎", "👑", "💰", "🎰", "⭐"]
const SPIN_DURATION = 2000
const BET_AMOUNTS = [10, 50, 100, 500]

export default function SlotMachine() {
  const [reels, setReels] = useState(["💎", "💎", "💎"])
  const [balance, setBalance] = useState(1000)
  const [spinning, setSpinning] = useState(false)
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0])
  const [muted, setMuted] = useState(false)
  const [lastWin, setLastWin] = useState(0)

  const spinSound = useRef(new Audio("/sounds/spin.mp3"))
  const winSound = useRef(new Audio("/sounds/win.mp3"))
  const loseSound = useRef(new Audio("/sounds/lose.mp3"))

  const playSound = (sound: HTMLAudioElement) => {
    if (!muted) {
      sound.currentTime = 0
      sound.play()
    }
  }

  const spin = () => {
    if (spinning || balance < betAmount) return

    setSpinning(true)
    playSound(spinSound.current)
    setBalance((prev) => prev - betAmount)

    // Simulate spinning animation
    const intervalId = setInterval(() => {
      setReels((prev) =>
        prev.map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      )
    }, 100)

    setTimeout(() => {
      clearInterval(intervalId)
      const finalReels = Array(3)
        .fill(0)
        .map(() => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
      setReels(finalReels)
      checkWin(finalReels)
      setSpinning(false)
    }, SPIN_DURATION)
  }

  const checkWin = (results: string[]) => {
    if (results[0] === results[1] && results[1] === results[2]) {
      const winAmount = betAmount * 10
      setBalance((prev) => prev + winAmount)
      setLastWin(winAmount)
      playSound(winSound.current)
    } else if (results[0] === results[1] || results[1] === results[2]) {
      const winAmount = betAmount * 2
      setBalance((prev) => prev + winAmount)
      setLastWin(winAmount)
      playSound(winSound.current)
    } else {
      setLastWin(0)
      playSound(loseSound.current)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black text-white flex items-center justify-center">
      <div className="max-w-4xl w-full mx-4">
        <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold">{balance} MODS</span>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {muted ? <VolumeX /> : <Volume2 />}
            </button>
          </div>

          <div className="bg-gradient-to-b from-purple-800/50 to-purple-900/50 rounded-xl p-6 mb-8">
            <div className="flex justify-center gap-4 mb-8">
              {reels.map((symbol, index) => (
                <div
                  key={index}
                  className={`w-32 h-32 flex items-center justify-center text-6xl 
                    bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg border-2 
                    border-purple-500/30 shadow-lg ${
                      spinning ? "animate-bounce" : ""
                    }`}
                >
                  {symbol}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                {BET_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setBetAmount(amount)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      betAmount === amount
                        ? "bg-purple-600 text-white"
                        : "bg-purple-900/50 hover:bg-purple-800/50"
                    }`}
                  >
                    {amount} MODS
                  </button>
                ))}
              </div>

              <button
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
              </button>
            </div>
          </div>

          {lastWin > 0 && (
            <div className="text-center text-2xl font-bold text-yellow-500 animate-pulse">
              You won {lastWin} MODS!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
