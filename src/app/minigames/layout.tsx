import { redirect } from "next/navigation"

import Navbar from "~/components/navigate/navbar"
import { env } from "~/env"
import { isAllowRole } from "~/lib/roles"

export default async function MinigameLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (
    !(await isAllowRole(["admin", "member"], env.NODE_ENV === "development"))
  ) {
    return redirect("/")
  }

  return (
    <div className="h-screen w-full flex flex-col">
      <Navbar />
      {children}
    </div>
  )
}
