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
import { Card, CardFooter, CardHeader } from "~/components/ui/card"
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

function ProfilePage() {
  const { data, isError } = useServerActionQuery(getUserProfile, {
    queryKey: ["test"],
    input: undefined,
  })

  if (isError || !data) {
    return <p>error</p>
  }

  return (
    <Card>
      <CardHeader>
        <Display {...data} />
      </CardHeader>
      <CardFooter className="flex flex-row gap-3">
        <ChangePassword />
        <ChangeDisplayName displayName={data.displayName} />
      </CardFooter>
    </Card>
  )
}

type DisplayProps = {
  id: number
  role: "member" | "admin"
  userId: number
  displayName: string
}

function Display({ displayName, role, userId }: DisplayProps) {
  return (
    <div>
      <p>{displayName}</p>
      <p>{userId}</p>
      <p>{role}</p>
    </div>
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
