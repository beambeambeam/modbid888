import { ReactNode } from "react"
import { redirect } from "next/navigation"

import { isAllowRole } from "~/lib/roles"

async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  if (await isAllowRole(["admin", "member"])) {
    return redirect("/minigames")
  }
  return <>{children}</>
}
export default Layout
