import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CircleHelpIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card"
import ShineBorder from "~/components/ui/shine-border"

export type GameCardProps = {
  title: string
  desc: string
  tips?: string
  img: string
  disabled?: boolean
}

function GameCard({ title, desc, tips, img, disabled }: GameCardProps) {
  return (
    <ShineBorder color={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="p-0">
      <Card className="w-[24rem] p-0">
        <CardHeader className="p-0 w-full">
          <Image
            src={img}
            alt={title}
            width={0}
            height={0}
            className="w-full h-full"
          />
        </CardHeader>

        <CardContent className="py-6 px-6 flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <h1 className="font-alagard text-3xl w-full capitalize">{title}</h1>
            {tips && (
              <HoverCard>
                <HoverCardTrigger>
                  <CircleHelpIcon className="w-fit h-fit text-muted-foreground/20 hover:text-muted-foreground transition-colors cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent>{tips}</HoverCardContent>
              </HoverCard>
            )}
          </div>
          <HoverCard>
            <HoverCardTrigger className="text-muted-foreground truncate">
              {desc}
            </HoverCardTrigger>
            <HoverCardContent>{desc}</HoverCardContent>
          </HoverCard>
        </CardContent>

        {disabled ? (
          <CardFooter className="p-0 w-full flex items-center justify-center py-4 bg-yellow-400 text-black font-alagard">
            <p>Under Construction</p>
          </CardFooter>
        ) : (
          <CardFooter>
            <Link href={`/minigames/${title}`}>
              <Button
                variant="expandIcon"
                className="font-alagard capitalize"
                Icon={() => <ArrowRight className="h-4 w-4" />}
                iconPlacement="right"
              >
                Play {title}!
              </Button>
            </Link>
          </CardFooter>
        )}
      </Card>
    </ShineBorder>
  )
}
export default GameCard
