"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import getUserProfile, {
  updateDisplayNameAction,
  updatePasswordAction,
} from "~/app/profile/actions"
import { Button, buttonVariants } from "~/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { useServerActionQuery } from "~/hooks/server-action-hooks"
import { useToast } from "~/hooks/use-toast"
import { cn } from "~/lib/utils"

function ProfilePage() {
  const { data, isError } = useServerActionQuery(getUserProfile, {
    queryKey: ["test"],
    input: undefined,
  })

  if (isError || !data) {
    return <p>error</p>
  }

  return (
    <div className="w-full grid grid-cols-2 h-full">
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full mx-20">
          <CardHeader>
            <Display {...data} />
          </CardHeader>
          <CardFooter className="flex flex-row gap-3">
            <ChangePassword />
            <ChangeDisplayName displayName={data.displayName} />
          </CardFooter>
        </Card>
      </div>
      <div className="w-full h-full flex items-start justify-center flex-col">
        <h1 className="text-4xl font-alagard">Bet logs.</h1>
        <p className="text-muted-foreground text-xl">
          Let&apos;s get in to some statistics
        </p>
      </div>
    </div>
  )
}

type DisplayProps = {
  id: number
  role: "member" | "admin"
  userId: number
  displayName: string
  balance: number
}

function Display({ displayName, role, userId, balance }: DisplayProps) {
  return (
    <>
      <CardTitle className="w-full flex flex-row font-alagard text-3xl items-center justify-between">
        <div className="flex flex-row font-normal">
          <p>{displayName}</p>
          <p>#</p>
          <p>{userId}</p>
        </div>
        <div className={`${cn(balance < -1 ? "text-red-500" : "text-white")}`}>
          {balance}
        </div>
      </CardTitle>
      <CardDescription className="font-alagard text-xl">{role}</CardDescription>
    </>
  )
}

const changeDisplayNameSchema = z.object({
  newDisplayName: z.string().min(1, {
    message: "DisplayName should longer than 3",
  }),
})

function ChangeDisplayName({ displayName }: { displayName: string }) {
  const { execute, isPending } = useServerAction(updateDisplayNameAction)
  const form = useForm<z.infer<typeof changeDisplayNameSchema>>({
    resolver: zodResolver(changeDisplayNameSchema),
    defaultValues: {
      newDisplayName: displayName,
    },
  })

  function onSubmit(data: z.infer<typeof changeDisplayNameSchema>) {
    execute({ newDisplayName: data.newDisplayName })
  }

  if (isPending) {
    return <div>loading...</div>
  }

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Change Display Name
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="newDisplayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.getValues().newDisplayName == displayName}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

const changePasswordSchema = z
  .object({
    newPassword: z.string().min(6),
    oldPassword: z.string().min(1),
    newPasswordAgain: z.string(),
  })
  .refine(
    (data) =>
      data.newPassword === data.newPasswordAgain ||
      data.newPassword === data.oldPassword,
    {
      message: "Passwords don't match",
      path: ["passowrd", "confirmPassword"],
    }
  )

function ChangePassword() {
  const { toast } = useToast()
  const { execute } = useServerAction(updatePasswordAction, {
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Let's Go!",
        description: "Enjoy your session",
      })
    },
  })
  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      newPasswordAgain: "",
      oldPassword: "",
    },
  })

  function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    execute({ newPassword: data.newPassword, oldPassword: data.oldPassword })
  }

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants({ variant: "outline" })}>
        Change Password
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your old password and new password. Click submit when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Old Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPasswordAgain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repeat New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Must be the same on top</FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProfilePage
