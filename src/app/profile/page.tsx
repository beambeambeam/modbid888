"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { getUserProfile, updateDisplayNameAction } from "~/app/profile/actions"
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
    window.location.reload()
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

export default ProfilePage
