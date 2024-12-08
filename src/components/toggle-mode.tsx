"use client"

import { SunMoonIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

function ModeTogger() {
  const { setTheme, theme } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-0"
    >
      <SunMoonIcon className="size-6 text-foreground" />
    </Button>
  )
}
export default ModeTogger
