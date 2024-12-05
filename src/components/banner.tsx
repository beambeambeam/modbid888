"use client"

import { useState } from "react"
import { X } from "lucide-react"

function Banner() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  return (
    <div className="w-full bg-background flex px-12 h-10 items-center justify-between">
      <div className="w-full h-full flex items-center gap-2">
        <span className="size-6 bg-[#FF0000] gap-2" />
        <div className="font-alagard text-foreground flex flex-row text-2xl gap-2">
          Welcome to<p className="font-alagard text-[#FF0000]">beta!</p>
        </div>
        <p className="text-base">
          All the data will be reset after 1.0.0 release
        </p>
      </div>
      <X
        className="size-6 text-foreground cursor-pointer"
        onClick={() => setVisible(false)}
      />
    </div>
  )
}
export default Banner
