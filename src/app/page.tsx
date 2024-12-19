import Link from "next/link"
import posthog from "posthog-js"

import { Button } from "~/components/ui/button"
import { RainbowButton } from "~/components/ui/rainbow-button"
import { env } from "~/env"
import { isAllowRole } from "~/lib/roles"

export default async function Home() {
  if (env.NODE_ENV != "developemnt") {
    posthog.capture("my event", { property: "value" })
  }

  return (
    <>
      <div className="text-foreground w-full flex items-center h-screen px-32">
        <div className="flex flex-col gap-6 items-center w-full">
          <h1 className="font-alagard text-[9rem] -rotate-2">Modbid888</h1>
          <div className="flex flex-col gap-3">
            <div className="text-2xl flex gap-6 items-center">
              How good is your luck?
              <h2 className="text-5xl text-red-600 font-alagard">Luck?</h2>
              test it here?
            </div>
          </div>
          <div className="flex flex-row gap-4">
            {(await isAllowRole(["admin", "member"])) ? (
              <Link href="/minigames">
                <RainbowButton className="font-alagard text-xl">
                  Play a game!
                </RainbowButton>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <RainbowButton>Let&apos;s go</RainbowButton>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm" variant="ghost">
                    No account? Sign-up!
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
