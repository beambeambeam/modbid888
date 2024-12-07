import { ReactNode } from "react"

import Banner from "~/components/banner"

function Layout({ children }: Readonly<{ children: ReactNode }>) {
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
