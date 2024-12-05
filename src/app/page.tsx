import posthog from "posthog-js"

import Banner from "~/components/banner"
import { Button } from "~/components/ui/button"

export default function Home() {
  posthog.capture("my event", { property: "value" })

  return (
    <>
      <div className="absolute z-50 w-full">
        <Banner />
      </div>
      <div className="text-foreground w-full flex items-center h-screen px-32">
        <div className="flex flex-col gap-6">
          <h1 className="font-alagard text-6xl">Modbid888</h1>
          <div className="flex flex-col gap-3">
            <div className="flex flex-row gap-3 text-4xl items-center">
              How good is your{" "}
              <h2 className="text-5xl text-red-600 font-alagard">Luck?</h2>
            </div>
            <h2 className="flex flex-row gap-3 text-4xl">Test it here.</h2>
          </div>
          <div className="flex flex-row gap-4">
            <Button size="sm">Let&apos;s go</Button>
            <Button size="sm" variant="ghost">
              No account? Sign-up!
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
