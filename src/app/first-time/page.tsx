import Image from "next/image"
import Link from "next/link"

import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

function FirstTimePage() {
  return (
    <div className="h-full w-full flex justify-center items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>
            <h1 className="font-alagard font-normal text-3xl">
              Welcome! gambler
            </h1>
          </CardTitle>
          <CardDescription>Welcome to this our game!</CardDescription>
        </CardHeader>
        <CardContent className="text-base flex flex-col gap-2">
          <li>Don&apos;t forget to change your Display Name</li>
          <li>To change it click you Display Name on top right!</li>
          <Image
            src="/static/image/displayname.svg"
            alt="Display Name"
            width={0}
            height={0}
            className="w-full rounded"
          />
          <li>You get 10,000 credit for first time!</li>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href="/minigames">
            <Button className="font-alagard">I get it! Let me play!</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
export default FirstTimePage
