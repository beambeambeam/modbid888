import posthog from "posthog-js"

import Logout from "~/components/sign-out"

export default function Home() {
  posthog.capture("my event", { property: "value" })

  return (
    <div>
      <Logout />
    </div>
  )
}
