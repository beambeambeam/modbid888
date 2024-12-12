import React from "react"

import "./Reel.css"

interface ReelProps {
  symbol: string
  isSpinning: boolean
}

const Reel: React.FC<ReelProps> = ({ symbol, isSpinning }) => {
  return (
    <div className={`reel ${isSpinning ? "spinning" : ""}`}>
      {symbol || "❓"}
    </div>
  )
}

export default Reel
