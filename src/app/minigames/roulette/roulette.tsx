"use client"

import React, { useState } from "react"
import NumberFlow from "@number-flow/react"
import { useServerAction } from "zsa-react"

import { Button } from "~/components/ui/button"
import { betTransaction } from "~/hooks/bet/actions"
import { cn } from "~/lib/utils"

import MinigameTable from "../table"

type BetType =
  | "1 Number"
  | "High"
  | "Low"
  | "Red"
  | "Black"
  | "Odd"
  | "Even"
  | "Zone"
  | "Row"
  | "2 Numbers"
  | "3 Numbers"
  | "4 Numbers"
  | "6 Numbers"

type RouletteProps = {
  balance: number
  minigameId: number
}

const blackNumbers = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 27, 29, 31, 33, 35,
]

const redNumbers = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]

const RouletteGame: React.FC<RouletteProps> = ({
  balance: dbBalance,
  minigameId,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [selectedBetType, setSelectedBetType] = useState<BetType | null>(null)
  const [selectedNumbers, setSelectedNumbers] = useState<Set<number>>(new Set()) // For multiple number selections
  const [result, setResult] = useState<number | null>(null)
  const [rotation, setRotation] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  const [balance, setBalance] = useState<number>(dbBalance)
  const [betAmount, setBetAmount] = useState<number>(10) // Default bet amount

  const [ballRotation] = useState<number>(0)

  const numbers = Array.from({ length: 37 }, (_, i) => i) // 0-36

  const { execute: updateBet } = useServerAction(betTransaction)

  const payouts: Record<BetType, number> = {
    "1 Number": 35, // Pays 35x
    High: 1, // Pays 2x
    Low: 1, // Pays 2x
    Red: 1, // Pays 2x
    Black: 1, // Pays 2x
    Odd: 1, // Pays 2x
    Even: 1, // Pays 2x
    Zone: 1, // Pays 2x
    Row: 1, // Pays 2x
    "2 Numbers": 17, // Pays 17x
    "3 Numbers": 11, // Pays 11x
    "4 Numbers": 8, // Pays 8x
    "6 Numbers": 5, // Pays 5x
  }

  const spinRoulette = () => {
    if (isSpinning || !selectedBetType) {
      setMessage("Please select a bet type and numbers before spinning!")
      return
    }

    if (balance <= 0) {
      setBetAmount(100)
    }

    setIsSpinning(true)
    const randomNumber = Math.floor(Math.random() * 37) // Random number between 0 and 36
    const spins = 10 // Number of full rotations
    const degreePerNumber = 360 / 37 // Angle for each number
    const targetRotation = spins * 360 + (37 - randomNumber) * degreePerNumber // Adjust for clockwise rotation

    const totalDuration = 15000 // Total spin duration in milliseconds
    const stopTimeBuffer = 5000 // Buffer time before stopping (e.g., stop 250ms early)
    const adjustedDuration = totalDuration - stopTimeBuffer // Adjusted total duration
    const startTime = Date.now()

    // Start the animation interval for the wheel
    const animationInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / adjustedDuration, 1) // Normalize progress (0 to 1)

      // Adjusted ease-out effect for faster deceleration at the end
      const adjustedProgress = progress * (2 - progress) // Quadratic ease-out with faster end deceleration
      const easedProgress = 1 - Math.pow(1 - adjustedProgress, 2) // Combine quadratic with cubic ease-out
      const currentRotation = easedProgress * targetRotation

      setRotation(currentRotation) // Update wheel rotation

      // Stop the animation once complete
      if (progress === 1) {
        clearInterval(animationInterval)

        // Delay final actions to match totalDuration
        setTimeout(() => {
          setResult(randomNumber)
          calculateResult(randomNumber)
          setIsSpinning(false)
        }, stopTimeBuffer) // Delay by the stop buffer time
      }
    }, 1000 / 60) // 60 FPS
  }

  const calculateResult = (winningNumber: number) => {
    let isWin = false

    // Ensure selectedBetType is a valid key in payouts
    const payout =
      selectedBetType && payouts[selectedBetType] !== undefined
        ? payouts[selectedBetType] + 1
        : 0

    // 1. แบบแทงเลือก1ตัวเลข: อัตราจ่าย 35 เท่า ถ้าเป็นเลข 0 จะจ่าย 36 เท่า
    if (selectedBetType === "1 Number") {
      if (selectedNumber === winningNumber) {
        isWin = true
        setBalance(
          (prev) => prev + (winningNumber === 0 ? 36 : payout) * betAmount
        )
        updateBet({
          minigameId: minigameId,
          betAmount: betAmount,
          betResult: "win",
          multiplier: winningNumber === 0 ? 36 : payout,
        })
      }
    }

    // 2. แบบแทงสูง (19-36): อัตราจ่าย 2 เท่า
    if (
      selectedBetType === "High" &&
      winningNumber >= 19 &&
      winningNumber <= 36
    ) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 3. แบบแทงต่ำ (1-18): อัตราจ่าย 2 เท่า
    if (
      selectedBetType === "Low" &&
      winningNumber >= 1 &&
      winningNumber <= 18
    ) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 4. แบบแทงดำ: อัตราจ่าย 2 เท่า (เลขสีดำคือเลขที่อยู่ในช่องเลขคี่ที่ไม่เป็นแดง)

    if (selectedBetType === "Black" && blackNumbers.includes(winningNumber)) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 5. แบบแทงแดง: อัตราจ่าย 2 เท่า (เลขสีแดงคือเลขที่อยู่ในช่องเลขคู่ที่ไม่เป็นดำ)

    if (selectedBetType === "Red" && redNumbers.includes(winningNumber)) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 6. แบบแทงเลขคู่ (ไม่รวมเลข 0): อัตราจ่าย 2 เท่า
    if (
      selectedBetType === "Even" &&
      winningNumber !== 0 &&
      winningNumber % 2 === 0
    ) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 7. แบบแทงเลขคี่: อัตราจ่าย 2 เท่า
    if (
      selectedBetType === "Odd" &&
      winningNumber !== 0 &&
      winningNumber % 2 !== 0
    ) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 8. แบบแทงเต็งโซน (1-12, 13-24, 25-36): อัตราจ่าย 2 เท่า
    const zone1 = Array.from({ length: 12 }, (_, i) => i + 1)
    const zone2 = Array.from({ length: 12 }, (_, i) => i + 13)
    const zone3 = Array.from({ length: 12 }, (_, i) => i + 25)

    if (selectedBetType === "Zone") {
      if (
        (selectedNumber === 1 && zone1.includes(winningNumber)) ||
        (selectedNumber === 2 && zone2.includes(winningNumber)) ||
        (selectedNumber === 3 && zone3.includes(winningNumber))
      ) {
        isWin = true
        setBalance((prev) => prev + payout * betAmount)
        updateBet({
          minigameId: minigameId,
          betAmount: betAmount,
          betResult: "win",
          multiplier: payout,
        })
      }
    }

    // 9. แบบแทงเต็งแถวแนวนอน (1, 4, 7...; 2, 5, 8...; 3, 6, 9...)
    const row1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34]
    const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35]
    const row3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]

    if (selectedBetType === "Row") {
      if (
        (selectedNumber === 1 && row1.includes(winningNumber)) ||
        (selectedNumber === 2 && row2.includes(winningNumber)) ||
        (selectedNumber === 3 && row3.includes(winningNumber))
      ) {
        isWin = true
        setBalance((prev) => prev + payout * betAmount)
        updateBet({
          minigameId: minigameId,
          betAmount: betAmount,
          betResult: "win",
          multiplier: payout,
        })
      }
    }

    // 10. แบบแทงเลือก 2 ตัวเลข: อัตราจ่าย 17 เท่า
    if (selectedBetType === "2 Numbers" && selectedNumbers.has(winningNumber)) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 11. แบบแทงเลือก 3 ตัวเลข: อัตราจ่าย 11 เท่า
    if (selectedBetType === "3 Numbers" && selectedNumbers.has(winningNumber)) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 12. แบบแทงเลือก 4 ตัวเลข: อัตราจ่าย 8 เท่า
    if (selectedBetType === "4 Numbers" && selectedNumbers.has(winningNumber)) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }

    // 13. แบบแทงเลือก 6 ตัวเลข: อัตราจ่าย 5 เท่า
    if (selectedBetType === "6 Numbers" && selectedNumbers.has(winningNumber)) {
      isWin = true
      setBalance((prev) => prev + payout * betAmount)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "win",
        multiplier: payout,
      })
    }
    // If the player lost, update the message and balance
    if (!isWin) {
      setBalance((prev) => prev - betAmount) // Deduct the bet if they lost
      setMessage(`😢 You lost!`)
      updateBet({
        minigameId: minigameId,
        betAmount: betAmount,
        betResult: "loss",
        multiplier: -1,
      })
    } else {
      setMessage(`🎉 You won!`)
      setBalance((prev) => prev + payout * betAmount) // Update balance on win
    }
  }

  const handleNumberSelection = (num: number) => {
    if (
      selectedBetType === "2 Numbers" ||
      selectedBetType === "3 Numbers" ||
      selectedBetType === "4 Numbers" ||
      selectedBetType === "6 Numbers"
    ) {
      // Handle multiple numbers selection (already in place)
      const updatedNumbers = new Set(selectedNumbers)

      if (updatedNumbers.has(num)) {
        updatedNumbers.delete(num)
      } else {
        if (selectedBetType === "2 Numbers" && updatedNumbers.size < 2) {
          updatedNumbers.add(num)
        } else if (selectedBetType === "3 Numbers" && updatedNumbers.size < 3) {
          updatedNumbers.add(num)
        } else if (selectedBetType === "4 Numbers" && updatedNumbers.size < 4) {
          updatedNumbers.add(num)
        } else if (selectedBetType === "6 Numbers" && updatedNumbers.size < 6) {
          updatedNumbers.add(num)
        }
      }
      setSelectedNumbers(updatedNumbers)
    } else {
      setSelectedNumber(num) // For 1 Number bet
    }
  }

  return (
    <div className="flex-col-reverse lg:grid-cols-2 p-4 flex lg:grid">
      <div className="flex-1 p-5">
        <h1>Betting Area</h1>
        <h2>
          Balance: <NumberFlow value={balance} />
        </h2>

        <div className="flex flex-col">
          <label>Bet Type: {selectedBetType || "None"}</label>
          <label>Bet Amount: </label>
          <div className="flex flex-row">
            <input
              type="number"
              value={betAmount}
              min="1"
              max={balance}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="w-full"
            />
            <Button
              onClick={() => setBetAmount(balance)}
              className="ml-2 px-4 py-2 border-none rounded cursor-pointer bg-blue-500 hover:bg-blue-400 text-white font-alagard"
            >
              All In
            </Button>
          </div>
        </div>

        {/* Bet Type Selection */}
        <div className="flex flex-col gap-2 mb-4">
          <p className="font-alagard">Select a type of bet:</p>
          <div className="flex flex-wrap gap-2">
            {Object.keys(payouts).map((type) => (
              <Button
                variant="outline"
                key={type}
                onClick={() => setSelectedBetType(type as BetType)}
                className={`py-2 px-4 border ${selectedBetType === type && "ring-red-500 ring"} text-foreground`}
              >
                {type} ({payouts[type as BetType]}x)
              </Button>
            ))}
          </div>
        </div>

        {/* Zone Selection */}
        {selectedBetType === "Zone" && (
          <div>
            <p>Select a Zone:</p>
            <p>Zone1 : 1-12</p>
            <p>Zone2 : 13-24</p>
            <p>Zone3 : 25-36</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3].map((zone) => (
                <Button
                  variant="ghost"
                  key={zone}
                  onClick={() => setSelectedNumber(zone)}
                  className={cn(
                    "py-2 px-4 border",
                    selectedNumber === zone && "ring-red-500 ring",
                    "border-gray-500 cursor-pointer"
                  )}
                >
                  Zone {zone}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Row Selection */}
        {selectedBetType === "Row" && (
          <div>
            <p>Select a Row:</p>
            <p>Row1 : 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34</p>
            <p>Row2 : 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35</p>
            <p>Row3 : 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36</p>
            <div style={{ display: "flex", gap: "10px" }}>
              {[1, 2, 3].map((zone) => (
                <Button
                  variant="ghost"
                  key={zone}
                  onClick={() => setSelectedNumber(zone)}
                  className={cn(
                    "py-2 px-4 border",
                    selectedNumber === zone && "ring-red-500 ring",
                    "border-gray-500 cursor-pointer"
                  )}
                >
                  Zone {zone}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Number Selection for Multiple Numbers Bets */}
        {(selectedBetType === "2 Numbers" ||
          selectedBetType === "3 Numbers" ||
          selectedBetType === "4 Numbers" ||
          selectedBetType === "6 Numbers") && (
          <div>
            <p>Select numbers based on the bet type:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {numbers.map((num) => (
                <Button
                  variant="outline"
                  key={num}
                  onClick={() => handleNumberSelection(num)}
                  className={cn(
                    "p-4 w-12 h-12 rounded-full cursor-pointer text-lg text-foreground",
                    selectedNumbers.has(num) && "ring-red-500 ring"
                  )}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 1 Number Selection */}
        {selectedBetType === "1 Number" && (
          <div>
            <h1 className="text-xl font-bold mb-4">Select a number (0-36):</h1>
            <h1 className="text-xl font-bold mb-4">
              IF SELECT 0 MULTIPLE WILL BE 36x :
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {numbers.map((num) => (
                <Button
                  variant="outline"
                  key={num}
                  onClick={() => handleNumberSelection(num)}
                  className={cn(
                    "p-4 w-12 h-12 rounded-full cursor-pointer text-lg text-foreground bg-background",
                    selectedNumber === num && "ring-red-500 ring"
                  )}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div>
          <h1 className="text-xl font-alagard">Leaderboard of roulette</h1>
          <MinigameTable minigameId={2} />
        </div>
      </div>

      {/* Roulette Wheel */}
      <div className="flex-2 text-center">
        <h1 className="font-alagard text-3xl">Roulette Wheel</h1>
        <div
          style={{
            margin: "20px auto",
            width: "320px", // Slightly larger
            height: "320px", // Slightly larger
            border: "6px solid black", // Thicker border
            borderRadius: "50%",
            position: "relative",
            overflow: "hidden",
          }}
          className="bg-background ring-white ring-inset ring-[1.7rem]"
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "50% 50%", // เพิ่มจุดศูนย์กลางหมุน
              transition: isSpinning ? "transform 5s ease-out" : "none",
              willChange: "transform", // เพิ่ม will-change
            }}
          >
            {numbers.map((num, index) => (
              <div
                key={num}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  transform: `rotate(${(index * 360) / 37}deg)`,
                  transformOrigin: "50% 150px",
                  textAlign: "center",
                  fontSize: "14px",
                  color:
                    num === 0
                      ? "green"
                      : blackNumbers.includes(num)
                        ? "black"
                        : "red",
                }}
              >
                {num}
              </div>
            ))}
          </div>
          {/* Add Ball */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "20px",
              height: "20px",
              backgroundColor: "white",
              borderRadius: "50%",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              transform: `rotate(${ballRotation}deg) translate(-50%, -150px)`,
              transformOrigin: "50% 50%",
              transition: isSpinning ? "transform 0s linear" : "none",
            }}
          />
        </div>
        <Button
          onClick={spinRoulette}
          className="mt-5 px-5 py-2.5  border-none rounded cursor-pointer disabled:opacity-50 bg-red-500 hover:bg-red-400 text-white font-alagard text-xl"
          disabled={
            isSpinning ||
            !selectedBetType ||
            (selectedBetType === "1 Number" && selectedNumber === null) ||
            (["2 Numbers", "3 Numbers", "4 Numbers", "6 Numbers"].includes(
              selectedBetType
            ) &&
              selectedNumbers.size === 0)
          }
        >
          Spin the Wheel
        </Button>
        {/* แสดงหมายเลขที่ชนะ */}
        <h2 className="text-xl">
          The winning number is: {result !== null ? result : "-"}
        </h2>

        {/* แสดงข้อความชนะหรือแพ้ */}
        <h3>{message}</h3>
      </div>
    </div>
  )
}

export default RouletteGame
