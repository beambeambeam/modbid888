"use server"

import { redirect } from "next/navigation"

import { invalidateSession, validateRequest } from "~/auth"
import { authenticatedAction } from "~/lib/safe-action"

export const signOutAction = authenticatedAction
  .createServerAction()
  .handler(async () => {
    const { session } = await validateRequest()
    if (!session) {
      redirect("/sign-in")
    }
    await invalidateSession(session.id)
    redirect("/")
  })
