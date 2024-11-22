"use client"

import { ReactNode } from "react"

function Provider({ children }: Readonly<{ children: ReactNode }>) {
  return <div>{children}</div>
}
export default Provider
