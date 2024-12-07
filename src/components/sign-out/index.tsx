"use client"

import { useServerAction } from "zsa-react"

import { signOutAction } from "~/components/sign-out/action"
import { Spinner } from "~/components/spinner"
import { Button } from "~/components/ui/button"

export default function Logout() {
  const { execute, isPending } = useServerAction(signOutAction)
  return (
    <Button
      onClick={() => execute()}
      variant="outline"
      className="font-alagard"
    >
      {isPending ? <Spinner /> : <div>Let me out!</div>}
    </Button>
  )
}
