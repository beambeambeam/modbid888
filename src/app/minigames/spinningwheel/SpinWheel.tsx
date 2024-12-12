"use client"

import React, { useState } from "react"

import "./SpinWheel.css"

interface Segment {
  label: string
  color: string
  probability: number // คำนวนตวามน่าจะเป็น
}

const Wheel: React.FC = () => {
  const [spinning, setSpinning] = useState<boolean>(false)
  const [result, setResult] = useState<string | null>(null)
  const [spinDegrees, setSpinDegrees] = useState<number>(0)
  const [coins, setCoins] = useState<number>(0)
  const [mod, setMod] = useState<number>(500)

  const segments: Segment[] = [
    { label: "Free 1 coin", color: "#ff9999", probability: 0.2 }, // ชื่อ และโอกาศออกของแต่ละอันวันใน Wheel
    { label: "20", color: "#99ccff", probability: 0.4 },
    { label: "50", color: "#ffff99", probability: 0.2 },
    { label: "100", color: "#ccff99", probability: 0.06 },
    { label: "500", color: "#ffcc99", probability: 0.03 },
    { label: "1,000", color: "#ff99ff", probability: 0.01 },
  ]

  const segmentAngle: number = 360 / segments.length

  const spinWheel = (): void => {
    if (spinning || coins <= 0) return

    setCoins(coins - 1) // ลดเหรียญตอนกดหมุน
    setSpinning(true)
    setSpinDegrees(0)

    setTimeout(() => {
      // set เวลาการหมุน
      const prizeIndex: number = getWeightedRandomIndex(
        segments.map((seg) => seg.probability)
      )
      const targetResult = segments[prizeIndex].label

      const spinRanges: { [key: string]: [number, number] } = {
        "Free 1 coin": [1025, 1080], // range องศาการหมุนของแต่ละอัน
        "20": [1320, 1375],
        "50": [1260, 1315],
        "100": [1205, 1255],
        "500": [1145, 1200],
        "1,000": [1085, 1140],
      }

      const [minSpin, maxSpin] = spinRanges[targetResult]
      const randomSpin = Math.floor(
        minSpin + Math.random() * (maxSpin - minSpin)
      ) // สมการคำนวนองศาการหมุน

      const totalSpin = randomSpin
      if (totalSpin < 1000) {
        setSpinDegrees(0) // Reset Wheel ให้หมุนกลับไป 0 องศา
        return
      }

      setSpinDegrees(totalSpin) // หมุนต่อหลังจาก Reset

      setTimeout(() => {
        setResult(targetResult)
        setSpinning(false)

        // รางวัลที่ได้จาก Wheel
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
      }, 3000)
    }, 3000) // Delay ในก่าร spin
  }

  const buyCoinsWithMod = () => {
    // การเปลี่ยนจาก Mod เป็น coin
    if (mod >= 500) {
      setCoins((prev) => prev + 5)
      setMod((prev) => prev - 500)
    }
  }

  const getWeightedRandomIndex = (weights: number[]): number => {
    // เลือกส่วนที่ชนะจากความน่าจะเป็น
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
    //คำนวนเส้นโค้งที่ใช้ในการหมุนตอนเริ่่ม และตอนท้าย
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
    // ส่วนประกอบในหน้า web และ ปุ่มต่าง ๆ
    <div className="wheel-container">
      <div className="mod">Mod: {mod}</div>
      <div className="coins">Coins: {coins}</div>
      <div className="arrow">▼</div>

      <svg
        className={`wheel ${spinning ? "spinning" : ""}`}
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{
          transform: `rotate(${spinDegrees}deg)`,
        }}
      >
        {segments.map((segment, index) => (
          <path
            key={index}
            d={calculateArcPath(index, segments.length, 150)}
            fill={segment.color}
            stroke="#000"
            strokeWidth="1"
          />
        ))}
        {segments.map((segment, index) => {
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
              {segment.label}
            </text>
          )
        })}
      </svg>

      <button onClick={spinWheel} disabled={spinning || coins <= 0}>
        {spinning ? "Spinning..." : coins > 0 ? "Spin" : "Out of Coins"}
      </button>
      <button onClick={buyCoinsWithMod} disabled={mod < 500}>
        Buy 5 Coins with 500 Mod
      </button>
      {result && !spinning && <div className="result">Result: {result}</div>}
    </div>
  )
}

export default Wheel
