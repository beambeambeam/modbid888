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
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 30, 33, 35,
]

const redNumbers = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 32, 34, 36,
]

const rowMap: { [key: number]: number[] } = {
  1: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
}

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

  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
  ]

  const { execute: updateBet } = useServerAction(betTransaction)

  const payouts: Record<BetType, number> = {
    //show on button
    "1 Number": 35, // Pays 35x
    High: 2, // Pays 2x
    Low: 2, // Pays 2x
    Red: 2, // Pays 2x
    Black: 2, // Pays 2x
    Odd: 2, // Pays 2x
    Even: 2, // Pays 2x
    Zone: 2, // Pays 2x
    Row: 2, // Pays 2x
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

    if (balance < betAmount) {
      setMessage("Insufficient balance to place the bet.")
      return
    }

    // หักเงินเดิมพันทันที
    setBalance((prev) => prev - betAmount)
    setIsSpinning(true)

    const randomNumber = Math.floor(Math.random() * numbers.length) // Random index within the new numbers array
    const spins = 10 // Number of full rotations
    const degreePerNumber = 360 / numbers.length // Adjust angle for each number
    const targetRotation =
      spins * 360 +
      (numbers.length - (randomNumber % numbers.length)) * degreePerNumber

    const totalDuration = 11500 // Total spin duration in milliseconds
    const stopTimeBuffer = 6000 // Buffer time before stopping (e.g., stop 250ms early)
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
          const winningNumber = numbers[randomNumber] // Get the winning number based on its index
          setResult(winningNumber) // Set the result to the winning number
          calculateResult(winningNumber) // Calculate the result based on the winning number
          setIsSpinning(false)
        }, stopTimeBuffer) // Delay by the stop buffer time
      }
    }, 1000 / 60) // 60 FPS
  }

  const calculateResult = (winningNumber: number) => {
    let isWin = false

    // ฟังก์ชันช่วยในการคำนวณเงินรางวัล
    const awardPrize = (multiplier: number) => {
      // Declare type for multiplier
      isWin = true
      setBalance((prev) => prev + multiplier * betAmount)
      updateBet({
        minigameId,
        betAmount,
        betResult: "win",
        multiplier,
      })
    }

    // 1. แทงเลขเดียว (1 Number)
    if (selectedBetType === "1 Number" && selectedNumber === winningNumber) {
      awardPrize(winningNumber === 0 ? 36 : payouts[selectedBetType])
    }

    // 2. แทงสูง (High: 19-36)
    if (
      selectedBetType === "High" &&
      winningNumber >= 19 &&
      winningNumber <= 36
    ) {
      awardPrize(payouts[selectedBetType])
    }

    // 3. แทงต่ำ (Low: 1-18)
    if (
      selectedBetType === "Low" &&
      winningNumber >= 1 &&
      winningNumber <= 18
    ) {
      awardPrize(payouts[selectedBetType])
    }

    // 4. แทงดำ (Black)
    if (selectedBetType === "Black" && blackNumbers.includes(winningNumber)) {
      awardPrize(payouts[selectedBetType])
    }

    // 5. แทงแดง (Red)
    if (selectedBetType === "Red" && redNumbers.includes(winningNumber)) {
      awardPrize(payouts[selectedBetType])
    }

    // 6. แทงเลขคู่ (Even)
    if (
      selectedBetType === "Even" &&
      winningNumber !== 0 &&
      winningNumber % 2 === 0
    ) {
      awardPrize(payouts[selectedBetType])
    }

    // 7. แทงเลขคี่ (Odd)
    if (selectedBetType === "Odd" && winningNumber % 2 !== 0) {
      awardPrize(payouts[selectedBetType])
    }

    // 8. แทงโซน (Zone: 1-12, 13-24, 25-36)
    if (selectedBetType === "Zone") {
      const zoneMap: { [key: number]: number[] } = {
        1: Array.from({ length: 12 }, (_, i) => i + 1),
        2: Array.from({ length: 12 }, (_, i) => i + 13),
        3: Array.from({ length: 12 }, (_, i) => i + 25),
      }
      if (selectedNumber !== null && zoneMap[selectedNumber]) {
        awardPrize(payouts[selectedBetType])
      }
    }

    // 9. แทงแถวแนวนอน (Row: 1, 2, 3)
    if (selectedBetType === "Row" && selectedNumber !== null) {
      // ตรวจสอบว่าเลขที่ชนะอยู่ในแถวที่เลือก
      if (
        rowMap[selectedNumber] &&
        rowMap[selectedNumber].includes(winningNumber)
      ) {
        awardPrize(payouts[selectedBetType])
      }
    }

    // 10-13: แทงหลายตัวเลข (2, 3, 4, 6 Numbers)
    const groupBetTypes = ["2 Numbers", "3 Numbers", "4 Numbers", "6 Numbers"]
    if (selectedBetType && groupBetTypes.includes(selectedBetType)) {
      awardPrize(payouts[selectedBetType])
    }

    // หากแพ้
    if (!isWin) {
      setMessage("\ud83d\ude25 You lost!")
      updateBet({
        minigameId,
        betAmount,
        betResult: "loss",
        multiplier: -1,
      })
    } else {
      setMessage("\ud83c\udf89 You won!")
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
              {Object.keys(rowMap).map((rowKey) => (
                <Button
                  variant="ghost"
                  key={rowKey}
                  onClick={() => setSelectedNumber(Number(rowKey))}
                  className={cn(
                    "py-2 px-4 border",
                    selectedNumber === Number(rowKey) && "ring-red-500 ring",
                    "border-gray-500 cursor-pointer"
                  )}
                >
                  Row {rowKey}
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
