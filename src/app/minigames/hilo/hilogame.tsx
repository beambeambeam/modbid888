"use client"

import React, { useState } from "react"
import Image from "next/image"

// กำหนดประเภทสำหรับพร็อพที่คอมโพเนนต์นี้จะรับ
interface HiloGameProps {
  balance: number
  minigameId: number
}

const HiloGame: React.FC<HiloGameProps> = ({ balance, minigameId }) => {
  console.log(minigameId)
  const [bet, setBet] = useState<number>(100)
  const [guess, setGuess] = useState<string>("")
  const [diceResults, setDiceResults] = useState<number[]>([])
  const [gameMessage, setGameMessage] = useState<string>("")
  const [playerBalance, setPlayerBalance] = useState<number>(balance) // ใช้ค่า balance ที่รับมาเป็นค่าเริ่มต้น
  const [isRolling, setIsRolling] = useState<boolean>(false) // สถานะการหมุนลูกเต๋า

  // ปรับให้ฟังก์ชัน rollDice คืนค่าเป็น array ของตัวเลข
  const rollDice = (): number[] => {
    setIsRolling(true) // ตั้งค่าให้การหมุนเริ่มต้น
    return [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1)
  }

  const handleBet = () => {
    if (bet <= 0) {
      setGameMessage("กรุณากำหนดจำนวนเงินเดิมพันที่ถูกต้อง")
      return
    }

    if (bet < 100 && playerBalance >= 100) {
      setGameMessage("จำนวนเงินเดิมพันขั้นต่ำคือ 100 บาท")
      return
    }

    if (bet > playerBalance) {
      setGameMessage("ไม่สามารถเดิมพันได้มากกว่าจำนวนเงินที่มีอยู่")
      return
    }

    // เริ่มต้นการหมุนลูกเต๋า
    const newDiceResults = rollDice()
    setDiceResults(newDiceResults) // แสดงผลการทอยลูกเต๋าทันทีที่เริ่มหมุน

    setIsRolling(true)
    setTimeout(() => {
      const sum = newDiceResults.reduce(
        (acc: number, value: number) => acc + value,
        0
      ) // คำนวณผลรวมของลูกเต๋า

      let multiplier = 0 // ตัวแปรเก็บผลตอบแทน

      if (guess === "low" && sum >= 3 && sum <= 10) {
        multiplier = 2 // ผลตอบแทน x2 ถ้าแทงต่ำ (3-10)
      } else if (guess === "high" && sum >= 12 && sum <= 18) {
        multiplier = 2 // ผลตอบแทน x2 ถ้าแทงสูง (12-18)
      } else if (guess === "eleven" && sum === 11) {
        multiplier = 7 // ผลตอบแทน x7 ถ้าแทงว่าออก 11
      }

      // หลังจากการหมุนเสร็จสิ้นแล้ว
      setIsRolling(false)

      if (multiplier > 0) {
        setPlayerBalance(playerBalance + bet * multiplier)
        setGameMessage(
          `คุณชนะ! ผลการทอยลูกเต๋าคือ ${sum} และคุณได้รับผลตอบแทน x${multiplier}`
        )
      } else {
        setPlayerBalance(playerBalance - bet)
        setGameMessage(`คุณแพ้! ผลการทอยลูกเต๋าคือ ${sum}`)
      }
    }, 1000) // ตั้งเวลา 1 วินาทีให้ลูกเต๋าหมุน
  }

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">เกม Hilo (High-Low)</h1>
      <div className="mb-4">
        <label className="block mb-2">จำนวนเงินเดิมพัน:</label>
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">ทาย High, Low หรือ 11:</label>
        <select
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="low">Low (3-10)</option>
          <option value="eleven">11</option>
          <option value="high">High (12-18)</option>
        </select>
      </div>

      <button
        onClick={handleBet}
        className="p-2 bg-blue-500 text-white rounded-md mb-4"
      >
        ทอยลูกเต๋า
      </button>

      {diceResults.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl">ผลการทอยลูกเต๋า:</h2>
          <div className="flex space-x-2">
            {diceResults.map((result, index) => (
              <div
                key={index}
                className={`text-xl ${isRolling ? "animate-spin" : ""}`}
                style={{ transition: "transform 1s ease" }}
              >
                {/* แสดงภาพลูกเต๋าจากพาธที่แก้ไข */}
                <Image
                  src={`/static/image/minigames/dice-six-faces-${result}.svg`}
                  alt={`Dice ${result}`}
                  width={64} // Adjust the width as needed
                  height={64} // Adjust the height as needed
                  className={`w-16 h-16 ${isRolling ? "animate-spin" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xl font-semibold mb-4">{gameMessage}</div>

      <div className="text-lg">ยอดเงินของคุณ: {playerBalance} บาท</div>
    </div>
  )
}

export default HiloGame
