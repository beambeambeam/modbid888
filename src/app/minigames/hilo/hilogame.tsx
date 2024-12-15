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

interface HiloGameProps {
  balance: number
  minigameId: number
}

const HiloGame: React.FC<HiloGameProps> = ({ balance, minigameId }) => {
  const [bet, setBet] = useState<number>(100)
  const [guess, setGuess] = useState<string>("")
  const [diceResults, setDiceResults] = useState<number[]>([])
  const [gameMessage, setGameMessage] = useState<string>("")
  const [playerBalance, setPlayerBalance] = useState<number>(balance)
  const [isRolling, setIsRolling] = useState<boolean>(false)

  const { execute: updateBet } = useServerAction(betTransaction)

  const rollDice = (): number[] => {
    setIsRolling(true)
    const results = [1, 2, 3].map(() => Math.floor(Math.random() * 6) + 1)
    new Audio("/sounds/dice-roll.mp3").play() // เล่นเสียงการทอยลูกเต๋า
    return results
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

    if (!guess) {
      setGameMessage("กรุณาเลือกประเภทการเดิมพันก่อน")
      return
    }

    const newDiceResults = rollDice()
    setDiceResults(newDiceResults)

    setIsRolling(true)
    setTimeout(() => {
      const sum = newDiceResults.reduce(
        (acc: number, value: number) => acc + value,
        0
      )

      let multiplier = 0
      if (guess === "low" && sum >= 3 && sum <= 10) {
        multiplier = 2
      } else if (guess === "high" && sum >= 12 && sum <= 18) {
        multiplier = 2
      } else if (guess === "eleven" && sum === 11) {
        multiplier = 7
      }

      setIsRolling(false)

      if (multiplier > 0) {
        setPlayerBalance(playerBalance + bet * multiplier)
        setGameMessage(
          `คุณชนะ! ผลการทอยลูกเต๋าคือ ${sum} และคุณได้รับผลตอบแทน x${multiplier}`
        )
        new Audio("/sounds/win.mp3").play() // เล่นเสียงการชนะ
        updateBet({
          betAmount: bet,
          betResult: "win",
          minigameId: minigameId,
          multiplier: multiplier,
        })
      } else {
        setPlayerBalance(playerBalance - bet)
        setGameMessage(`คุณแพ้! ผลการทอยลูกเต๋าคือ ${sum}`)
        new Audio("/sounds/lose.mp3").play() // เล่นเสียงการแพ้
        updateBet({
          betAmount: bet,
          betResult: "loss",
          minigameId: minigameId,
          multiplier: -1,
        })
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col items-center p-4 gap-4">
      <h1 className="text-3xl font-bold font-alagard text-center">
        Hilo (High-Low)
      </h1>

      <div className="text-lg mb-6 text-center max-w-xl mx-auto">
        <h2 className="font-semibold text-xl mb-2">วิธีการเล่น:</h2>
        <p>ทอยลูกเต๋า 3 ลูกและทำนายผลรวมของลูกเต๋า ตามประเภทที่คุณเลือก</p>
        <ul className="list-disc pl-6 mt-2 mb-4">
          <li>
            <strong>Low:</strong> ทำนายว่าผลรวมจะอยู่ระหว่าง 3 ถึง 10
          </li>
          <li>
            <strong>11:</strong> ทำนายว่าผลรวมจะเป็น 11
          </li>
          <li>
            <strong>High:</strong> ทำนายว่าผลรวมจะอยู่ระหว่าง 12 ถึง 18
          </li>
        </ul>
        <p>
          เมื่อคุณตั้งเดิมพันและเลือกประเภทการเดิมพันแล้ว คลิก &quot;Cook the
          dice!&quot; เพื่อทอยลูกเต๋า
          ผลลัพธ์จะช่วยตัดสินว่าคุณชนะหรือแพ้ตามการทำนายของคุณ
        </p>
        <p className="mt-2">
          หากคุณชนะ คุณจะได้รับผลตอบแทนตามตัวคูณ แต่ถ้าแพ้คุณจะเสียเงินเดิมพัน
        </p>
      </div>

      <div className="text-lg mb-4 text-center">
        Balance: <NumberFlow value={playerBalance} /> บาท
      </div>

      <div className="flex gap-4 flex-row w-fit items-center justify-center">
        <p className="w-full">Bet Amount: </p>
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

      <div className="flex flex-row gap- items-center justify-center">
        <Select onValueChange={(value) => setGuess(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select bet types" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Bet Types</SelectLabel>
              <SelectItem value="low">Low (1-10) x2</SelectItem>
              <SelectItem value="eleven">Number 11 x7</SelectItem>
              <SelectItem value="high">High (12-18) x2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleBet} variant="destructive" disabled={!guess}>
        Cook the dice!
      </Button>

      {diceResults.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl text-center">ผลการทอยลูกเต๋า:</h2>
          <div className="flex space-x-2 justify-center">
            {diceResults.map((result, index) => (
              <div
                key={index}
                className={`text-xl ${isRolling ? "animate-spin" : ""}`}
                style={{ transition: "transform 1s ease" }}
              >
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

      <div className="text-xl font-semibold mb-4 text-center">
        {gameMessage}
      </div>
    </div>
  )
}

export default HiloGame
