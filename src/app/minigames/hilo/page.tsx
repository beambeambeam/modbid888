import React from "react"
import { redirect } from "next/navigation"

import HiloGame from "~/app/minigames/hilo/hilogame" // คอมโพเนนต์ของเกม Hilo ที่คุณสร้างเอง
import { getCurrentBalanceAction } from "~/hooks/bet/actions" // การดึงยอดเงินจาก API หรือ hook ที่ใช้

// หน้า Hilo
async function HiloPage() {
  const [balance] = await getCurrentBalanceAction()

  // ถ้ายอดเงินเป็น null หรือ undefined, จะทำการ redirect ไปที่หน้าแรก
  if (balance === null || balance === undefined) {
    return redirect("/")
  }

  // ถ้ายอดเงินพร้อม, ให้แสดงหน้าของเกม Hilo
  return (
    <div>
      <HiloGame balance={balance} minigameId={3} />{" "}
      {/* ส่งค่า balance และ minigameId ไปที่คอมโพเนนต์เกม */}
    </div>
  )
}

export default HiloPage
