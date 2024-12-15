"use client"

import React, { useState } from "react"

const Wheel: React.FC = () => {
  const [result, setResult] = useState<string | null>(null)
  const [coins, setCoins] = useState<number>(0)
  const [mod, setMod] = useState<number>(500)
  const [rotation, setRotation] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState<boolean>(false)
  const [showInstructions, setShowInstructions] = useState<boolean>(false)

  const numbers = [
    { label: "Free 1 coin", color: "#ff9999", probability: 0.2 },
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
    if (coins <= 0 || isSpinning) return

    setCoins((prev) => prev - 1)
    setIsSpinning(true)
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
          case "Free 1 coin":
            setCoins((prev) => prev + 1)
            break
          case "20":
            setMod((prev) => prev + 20)
            break
          case "50":
            setMod((prev) => prev + 50)
            break
          case "100":
            setMod((prev) => prev + 100)
            break
          case "500":
            setMod((prev) => prev + 500)
            break
          case "1,000":
            setMod((prev) => prev + 1000)
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

  const buyCoinsWithMod = () => {
    if (mod >= 500) {
      setCoins((prev) => prev + 5)
      setMod((prev) => prev - 500)
    }
  }

  const buySingleCoinWithMod = () => {
    if (mod >= 100) {
      setCoins((prev) => prev + 1)
      setMod((prev) => prev - 100)
    }
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
      <div className="text-lg font-bold">Balance: {mod}</div>
      <div className="text-lg font-bold">Coins: {coins}</div>
      <div className="text-xl font-bold">▼</div>

      {/* ปุ่ม How to Play */}
      <button
        onClick={() => setShowInstructions(true)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg"
      >
        How to Play
      </button>

      {/* ช่องแสดงคำแนะนำ */}
      {showInstructions && (
        <div className="mt-4 p-4 bg-gray-200 text-black rounded-lg">
          <p>How to Play:</p>
          <p>
            Spin the wheel by pressing the Spin button. You can buy coins with
            balance using the options below.
          </p>
          <button
            onClick={() => setShowInstructions(false)}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Close
          </button>
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

      <button
        onClick={spinWheel}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        disabled={coins <= 0 || isSpinning}
      >
        {isSpinning ? "Spinning..." : coins > 0 ? "Spin" : "Out of Coins"}
      </button>
      <button
        onClick={buyCoinsWithMod}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        disabled={mod < 500 || isSpinning}
      >
        Buy 5 Coins with 500 Balance
      </button>
      <button
        onClick={buySingleCoinWithMod}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
        disabled={mod < 100 || isSpinning}
      >
        Buy 1 Coin with 100 Balance
      </button>
      {result && !isSpinning && (
        <div className="text-lg font-bold">Result: {result}</div>
      )}
    </div>
  )
}

export default Wheel
