"use client"

import { ReactNode } from "react"

import { CSPostHogProvider } from "~/components/provider/posthog-provider"

function Provider({ children }: Readonly<{ children: ReactNode }>) {
  return <CSPostHogProvider>{children}</CSPostHogProvider>
}
export default Provider
