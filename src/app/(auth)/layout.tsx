import { ReactNode } from "react"
import { redirect } from "next/navigation"

import Banner from "~/components/banner"
import { isAllowRole } from "~/lib/roles"

async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  if (await isAllowRole(["admin", "member"])) {
    return redirect("/minigames")
  }
  return (
    <>
      <div className="absolute z-50 w-full">
        <Banner />
      </div>
      {children}
    </>
  )
}
export default Layout
