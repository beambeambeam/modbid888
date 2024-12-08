import Link from "next/link"
import { HoverCardContent } from "@radix-ui/react-hover-card"

import Logout from "../sign-out"
import ModeTogger from "../toggle-mode"
import { Card } from "../ui/card"
import { HoverCard, HoverCardTrigger } from "../ui/hover-card"
import { Separator } from "../ui/separator"
import { getBalanceAction, getProfileAction } from "./action"

async function Navbar() {
  const [data] = await getProfileAction()
  const [balance] = await getBalanceAction()

  return (
    <div className="h-fit">
      <div className="h-16 flex items-center w-full justify-between px-11">
        <Link href="/minigames">
          <h1 className="font-alagard text-3xl">Modbid888</h1>
        </Link>
        <div className="flex flex-row gap-4 items-center">
          <HoverCard>
            <HoverCardTrigger href="/profile" className="hover:underline">
              <div className="w-fit flex flex-row font-alagard text-lg items-center cursor-pointer">
                <p>{data?.displayName}</p>
                <p>#</p>
                <p>{data?.id}</p>
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <Card>
                <p className="font-alagard text-xl p-2">balance : {balance}</p>
              </Card>
            </HoverCardContent>
          </HoverCard>
          <Logout />
          <ModeTogger />
        </div>
      </div>
      <Separator />
    </div>
  )
}

export default Navbar
