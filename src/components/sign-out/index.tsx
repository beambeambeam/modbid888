"use client"

import { useServerAction } from "zsa-react"

import { signOutAction } from "~/components/sign-out/action"

export default function Logout() {
  const { execute } = useServerAction(signOutAction)
  return <button onClick={() => execute()}>logout</button>
}
