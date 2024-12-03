import { redirect } from "next/navigation"

import { isAllowRole } from "~/lib/roles"

export default async function MinigameLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!(await isAllowRole(["admin", "member"]))) {
    return redirect("/")
  }
  return <>{children}</>
}
