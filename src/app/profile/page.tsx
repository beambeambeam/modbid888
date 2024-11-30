"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import getUserProfile, {
  updateDisplayNameAction,
  updatePasswordAction,
} from "~/app/profile/actions"
import { Button } from "~/components/ui/button"
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
    <div>
      <Display {...data} />
      <ChangeDisplayName displayName={data.displayName} />
      <ChangePassword />
    </div>
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
        <Button
          type="submit"
          disabled={form.getValues().newDisplayName == displayName}
        >
          Submit
        </Button>
      </form>
    </Form>
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
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default ProfilePage
