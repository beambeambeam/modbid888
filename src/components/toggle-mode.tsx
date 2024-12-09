"use client"

import { SunMoonIcon } from "lucide-react"
import { useTheme } from "next-themes"

function ModeTogger() {
  const { setTheme, theme } = useTheme()
  return (
    <div
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-full flex items-center justify-start gap-2 cursor-pointer"
    >
      <SunMoonIcon className="size-6 text-foreground" />
      to {theme === "light" ? "dark" : "light"}
    </div>
  )
}
export default ModeTogger
