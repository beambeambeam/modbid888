import Link from "next/link"
import posthog from "posthog-js"

import Banner from "~/components/banner"
import { Button } from "~/components/ui/button"
import { isAllowRole } from "~/lib/roles"

export default async function Home() {
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
            {(await isAllowRole(["admin", "member"])) ? (
              <Link href="/minigames">
                <Button
                  variant="outline"
                  size="lg"
                  className="font-alagard text-xl"
                >
                  Play a game!
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button size="sm">Let&apos;s go</Button>
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
