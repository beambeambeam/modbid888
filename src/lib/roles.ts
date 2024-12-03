"use server"

import { getRoleByUserId } from "~/data-access/profiles"
import { Role } from "~/types"

import { assertAuthenticated } from "./session"

export const isAllowRole = async (
  allowRole: Role | Role[],
  bypass?: boolean
) => {
  if (bypass) {
    return true
  }

  try {
    const user = await assertAuthenticated()
    const role = await getRoleByUserId(user.id)

    if (!user || !role) {
      return false
    }

    if (Array.isArray(allowRole)) {
      if (allowRole.includes(role)) {
        return true
      }
    } else {
      if (role === allowRole) {
        return true
      }
    }
  } catch {
    return false
  }
}
