"use client"

import React, { useState } from "react"
import Image from "next/image"
import NumberFlow from "@number-flow/react"
import { useServerAction } from "zsa-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { betTransaction } from "~/hooks/bet/actions"

// กำหนดประเภทสำหรับพร็อพที่คอมโพเนนต์นี้จะรับ
interface HiloGameProps {
  balance: number
  minigameId: number
}

const HiloGame: React.FC<HiloGameProps> = ({ balance, minigameId }) => {
  const [bet, setBet] = useState<number>(100)
  const [guess, setGuess] = useState<string>("")
  const [diceResults, setDiceResults] = useState<number[]>([])
  const [gameMessage, setGameMessage] = useState<string>("")
  const [playerBalance, setPlayerBalance] = useState<number>(balance) // ใช้ค่า balance ที่รับมาเป็นค่าเริ่มต้น
  const [isRolling, setIsRolling] = useState<boolean>(false) // สถานะการหมุนลูกเต๋า

  const { execute: updateBet } = useServerAction(betTransaction)

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
        updateBet({
          betAmount: bet,
          betResult: "win",
          minigameId: minigameId,
          multiplier: multiplier,
        })
      } else {
        setPlayerBalance(playerBalance - bet)
        setGameMessage(`คุณแพ้! ผลการทอยลูกเต๋าคือ ${sum}`)
        updateBet({
          betAmount: bet,
          betResult: "loss",
          minigameId: minigameId,
          multiplier: -1,
        })
      }
    }, 1000) // ตั้งเวลา 1 วินาทีให้ลูกเต๋าหมุน
  }

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-3xl font-bold font-alagard">Hilo (High-Low)</h1>
      <div className="text-lg">
        Balance: <NumberFlow value={playerBalance} /> บาท
      </div>
      <div className="flex gap-4 flex-row w-fit items-center justify-center">
        <p className="w-full">Bet Amount : </p>
        <Input
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          className="w-full"
        />
        <Button onClick={() => setBet(playerBalance)} className="w-full">
          All In
        </Button>
      </div>

      <div className="flex flex-row gap- items-center">
        <Select onValueChange={(value) => setGuess(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select bet types" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bet Types</SelectLabel>
              <SelectItem value="low">Low (1-10)</SelectItem>
              <SelectItem value="eleven">11</SelectItem>
              <SelectItem value="high">High (12-18)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleBet} variant="destructive">
        Cook the dice!
      </Button>

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
                  src={`/static/image/minigames/dice-six-faces-${result.toString()}.svg`}
                  alt={`Dice ${result}`}
                  width={0}
                  height={0}
                  className={`w-16 h-16 ${isRolling ? "animate-spin" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xl font-semibold mb-4">{gameMessage}</div>
    </div>
  )
}

export default HiloGame
