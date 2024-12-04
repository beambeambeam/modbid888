"use client"

import { ReactNode } from "react"

import { CSPostHogProvider } from "~/components/providers/posthog-provider"
import ReactQueryProvider from "~/components/providers/react-query"

function Provider({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <CSPostHogProvider>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </CSPostHogProvider>
  )
}
export default Provider
