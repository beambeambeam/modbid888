"use client"

import React, { useState } from "react"

import "./SlotMachine.css"

import Reel from "./Reel"

const symbols = ["🍒", "🍋", "🍊", "🍇", "⭐", "🔔"]

const rewards: { [key: string]: number } = {
  "🍒": 100,
  "🍋": 150,
  "🍊": 200,
  "🍇": 250,
  "⭐": 500,
  "🔔": 1000,
}

const SlotMachine: React.FC = () => {
  const [reelsSet1, setReelsSet1] = useState<string[]>(["", "", ""])
  const [reelsSet2, setReelsSet2] = useState<string[]>(["", "", ""])
  const [reelsSet3, setReelsSet3] = useState<string[]>(["", "", ""])
  const [isSpinning, setIsSpinning] = useState(false)
  const [message, setMessage] = useState("")
  const [balance, setBalance] = useState(1000) // Starting balance

  const spinReels = () => {
    if (balance < 100) {
      setMessage("Not enough balance to spin!")
      return
    }

    setIsSpinning(true)
    setMessage("")
    setBalance((prev) => prev - 100) // Deduct 100 coins for spinning

    // Generate random reels for each set
    const newReelsSet1 = Array(3)
      .fill("")
      .map(() => symbols[Math.floor(Math.random() * symbols.length)])

    const newReelsSet2 = Array(3)
      .fill("")
      .map(() => symbols[Math.floor(Math.random() * symbols.length)])

    const newReelsSet3 = Array(3)
      .fill("")
      .map(() => symbols[Math.floor(Math.random() * symbols.length)])

    // Simulate spinning delay
    setTimeout(() => {
      setReelsSet1(newReelsSet1)
      setReelsSet2(newReelsSet2)
      setReelsSet3(newReelsSet3)
      setIsSpinning(false)
      checkWin(newReelsSet1, newReelsSet2, newReelsSet3)
    }, 1000)
  }

  const checkWin = (set1: string[], set2: string[], set3: string[]) => {
    let totalReward = 0

    // Check horizontal matches
    const isSet1Win = new Set(set1).size === 1
    const isSet2Win = new Set(set2).size === 1
    const isSet3Win = new Set(set3).size === 1

    if (isSet1Win) totalReward += rewards[set1[0]]
    if (isSet2Win) totalReward += rewards[set2[0]]
    if (isSet3Win) totalReward += rewards[set3[0]]

    // Check vertical matches
    const isVertical1Win = set1[0] === set2[0] && set1[0] === set3[0]
    const isVertical2Win = set1[1] === set2[1] && set1[1] === set3[1]
    const isVertical3Win = set1[2] === set2[2] && set1[2] === set3[2]

    if (isVertical1Win) totalReward += rewards[set1[0]]
    if (isVertical2Win) totalReward += rewards[set1[1]]
    if (isVertical3Win) totalReward += rewards[set1[2]]

    // Check diagonal matches
    const isDiagonal1Win = set1[0] === set2[1] && set1[0] === set3[2]
    const isDiagonal2Win = set1[2] === set2[1] && set1[2] === set3[0]

    if (isDiagonal1Win) totalReward += rewards[set1[0]]
    if (isDiagonal2Win) totalReward += rewards[set1[2]]

    if (totalReward > 0) {
      setMessage(`🎉 You Won ${totalReward} mods! 🎉`)
      setBalance((prev) => prev + totalReward)
    } else {
      setMessage("Try Again!")
    }
  }

  return (
    <div className="slot-machine">
      <h2>Balance: {balance} mods</h2>
      <div className="reels">
        {reelsSet1.map((symbol, index) => (
          <Reel key={`set1-${index}`} symbol={symbol} isSpinning={isSpinning} />
        ))}
      </div>
      <div className="reels">
        {reelsSet2.map((symbol, index) => (
          <Reel key={`set2-${index}`} symbol={symbol} isSpinning={isSpinning} />
        ))}
      </div>
      <div className="reels">
        {reelsSet3.map((symbol, index) => (
          <Reel key={`set3-${index}`} symbol={symbol} isSpinning={isSpinning} />
        ))}
      </div>
      <button onClick={spinReels} disabled={isSpinning || balance < 100}>
        {isSpinning ? "Spinning..." : "Spin"}
      </button>
      {message && <p className="message">{message}</p>}
      <div className="payout-info">
        <p>Spin 1 use 100 mods</p>
        <p>🍒🍒🍒 = 100 mods</p>
        <p>🍋🍋🍋 = 150 mods</p>
        <p>🍊🍊🍊 = 200 mods</p>
        <p>🍇🍇🍇 = 250 mods</p>
        <p>⭐⭐⭐ = 500 mods</p>
        <p>🔔🔔🔔 = 1000 mods</p>
      </div>
    </div>
  )
}

export default SlotMachine
