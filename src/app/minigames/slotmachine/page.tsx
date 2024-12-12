import React from "react"

import SlotMachine from "./SlotMachine"

import "./page.css"

const SlotPage: React.FC = () => {
  return (
    <div className="SlotPage">
      <h1 className="rainbow-title">🍊 Fruity and Friend</h1>
      <SlotMachine />
    </div>
  )
}

export default SlotPage
