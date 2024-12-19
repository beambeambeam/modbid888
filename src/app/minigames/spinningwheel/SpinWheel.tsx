"use client"

import React, { useState } from "react"
import NumberFlow from "@number-flow/react"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { useServerAction } from "zsa-react"

import { Button } from "~/components/ui/button"
import { betTransaction } from "~/hooks/bet/actions"

import { MinigameProps } from "../actions"

const Wheel: React.FC<
  MinigameProps & {
    refetch: (options?: RefetchOptions) => Promise<
      QueryObserverResult<
        number,
        {
          code: number
          message: string
        }
      >
    >
  }
> = ({ balance, minigameId, refetch }) => {
  const [result, setResult] = useState<string | null>(null)
  const [mod, setMod] = useState<number>(balance)
  const [rotation, setRotation] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [showInstructions, setShowInstructions] = useState<boolean>(false)

  const { execute: updateBet } = useServerAction(betTransaction)

  const numbers = [
    { label: "20", color: "#99ccff", probability: 0.4 },
    { label: "50", color: "#ffff99", probability: 0.2 },
    { label: "100", color: "#ccff99", probability: 0.1 },
    { label: "500", color: "#ffcc99", probability: 0.06 },
    { label: "1,000", color: "#ff99ff", probability: 0.04 },
  ]

  const segmentAngle: number = 360 / numbers.length

  const playSound = (url: string): void => {
    const audio = new Audio(url)
    audio.play().catch((error) => {
      console.error("Error playing sound:", error)
    })
  }

  const spinWheel = (): void => {
    if (mod >= 100) {
      setMod((prev) => prev - 100)
      setIsSpinning(true)
    }
    playSound("/sounds/SpinningWheel.mp3")

    const prizeIndex: number = getWeightedRandomIndex(
      numbers.map((num) => num.probability)
    )
    const targetResult = numbers[prizeIndex].label
    setResult(targetResult)

    const offset = 90
    const targetAngle = prizeIndex * segmentAngle + segmentAngle / 2 + offset
    const totalRotation = 360 * 5 + (360 - targetAngle)

    const startTime = Date.now()

    const spinInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      if (elapsed >= 7000) {
        clearInterval(spinInterval)
        setRotation(totalRotation % 360)
        setIsSpinning(false)

        switch (targetResult) {
          case "20":
            setMod((prev) => prev + 120)
            updateBet({
              betAmount: 100,
              betResult: "win",
              minigameId: minigameId,
              multiplier: 1.2,
            })
            refetch()

            break
          case "50":
            setMod((prev) => prev + 150)
            updateBet({
              betAmount: 100,
              betResult: "win",
              minigameId: minigameId,
              multiplier: 1.5,
            })
            refetch()
            break
          case "100":
            setMod((prev) => prev + 200)
            updateBet({
              betAmount: 100,
              betResult: "win",
              minigameId: minigameId,
              multiplier: 2,
            })
            refetch()

            break
          case "500":
            setMod((prev) => prev + 600)
            updateBet({
              betAmount: 100,
              betResult: "win",
              minigameId: minigameId,
              multiplier: 5,
            })
            refetch()

            break
          case "1,000":
            setMod((prev) => prev + 1100)
            updateBet({
              betAmount: 100,
              betResult: "win",
              minigameId: minigameId,
              multiplier: 10,
            })
            refetch()

            break
          default:
            break
        }
        playSound("/sounds/win.mp3")
      } else {
        const progress = elapsed / 7000
        const easeOutRotation = totalRotation * (1 - Math.pow(1 - progress, 3))
        setRotation(easeOutRotation)
      }
    }, 1000 / 60)
  }

  const getWeightedRandomIndex = (weights: number[]): number => {
    const cumulativeWeights = weights.reduce<number[]>((acc, weight, index) => {
      acc[index] = weight + (acc[index - 1] || 0)
      return acc
    }, [])
    const randomValue =
      Math.random() * cumulativeWeights[cumulativeWeights.length - 1]
    return cumulativeWeights.findIndex(
      (cumulativeWeight) => randomValue <= cumulativeWeight
    )
  }

  const calculateArcPath = (
    index: number,
    totalSegments: number,
    radius: number
  ): string => {
    const startAngle = (index * 360) / totalSegments
    const endAngle = ((index + 1) * 360) / totalSegments
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

    const x1 = radius + radius * Math.cos((Math.PI * startAngle) / 180)
    const y1 = radius + radius * Math.sin((Math.PI * startAngle) / 180)
    const x2 = radius + radius * Math.cos((Math.PI * endAngle) / 180)
    const y2 = radius + radius * Math.sin((Math.PI * endAngle) / 180)

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-lg font-bold">
        Balance: <NumberFlow value={mod} />
      </div>

      <Button
        onClick={() => setShowInstructions(true)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        How to Play
      </Button>

      <div className="text-xl font-bold">▼</div>

      {/* ช่องแสดงคำแนะนำ */}
      {showInstructions && (
        <div className="mt-4 p-4 bg-gray-200 text-black rounded-lg">
          <p>How to Play:</p>
          <p>
            Spin the wheel by pressing the Spin button. You can buy coins with
            balance using the options below.
          </p>
          <Button
            onClick={() => setShowInstructions(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Close
          </Button>
        </div>
      )}

      <svg
        className="w-72 h-72"
        viewBox="0 0 300 300"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {numbers.map((number, index) => (
          <path
            key={index}
            d={calculateArcPath(index, numbers.length, 150)}
            fill={number.color}
            stroke="#000"
            strokeWidth="1"
          />
        ))}
        {numbers.map((number, index) => {
          const angle =
            (index * segmentAngle + segmentAngle / 2) * (Math.PI / 180)
          const textX = 150 + 100 * Math.cos(angle)
          const textY = 150 + 100 * Math.sin(angle)

          return (
            <text
              key={index}
              x={textX}
              y={textY}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fill="#000"
            >
              {number.label}
            </text>
          )
        })}
      </svg>

      <Button onClick={spinWheel} disabled={isSpinning}>
        {isSpinning ? "Spinning..." : "Spin the wheel"}
      </Button>

      {result && !isSpinning && (
        <div className="text-lg font-bold">Result: {result}</div>
      )}

      {/* คำอธิบาย rate การออก */}
      <div className="mt-4 text-center">
        <h3 className="text-lg font-bold">Win Rates:</h3>
        <ul className="list-none">
          {numbers.map((number, index) => (
            <li key={index} className="text-sm">
              <span
                className="inline-block w-4 h-4 rounded-full"
                style={{ backgroundColor: number.color }}
              ></span>{" "}
              {number.label}: {Math.round(number.probability * 100)}%
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Wheel
