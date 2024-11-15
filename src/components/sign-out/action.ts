"use server"

import { redirect } from "next/navigation"
import { createServerAction } from "zsa"

import { invalidateSession, validateRequest } from "~/auth"

export const signOutAction = createServerAction().handler(async () => {
  const { session } = await validateRequest()
  if (!session) {
    redirect("/sign-in")
  }
  await invalidateSession(session.id)
  redirect("/")
})
