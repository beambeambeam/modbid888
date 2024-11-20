import { redirect } from "next/navigation"

import { getRoleByUserId } from "~/data-access/profiles"
import { assertAuthenticated } from "~/lib/session"
import { Role } from "~/use-cases/types"

export const byRoleAccess = async (allowRole: Role | Role[]) => {
  try {
    const user = await assertAuthenticated()
    const role = await getRoleByUserId(user.id)

    if (!user || !role) {
      return false
    }

    if (Array.isArray(allowRole)) {
      if (!allowRole.includes(role)) {
        return false
      }
    } else {
      if (role !== allowRole) {
        return false
      }
    }
  } catch {
    return false
  }

  return true
}

export const byRoleAccessRedirect = async (
  allowRole: Role | Role[],
  redirectPath: string
) => {
  if (!(await byRoleAccess(allowRole))) {
    redirect(redirectPath)
  }
}
