"use client"

import { useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useServerAction } from "zsa-react"

import { signUpAction } from "~/app/(auth)/sign-up/actions"
import { Spinner } from "~/components/spinner"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { useToast } from "~/hooks/use-toast"

const registrationSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password is required to sign-up",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password is required to sign-up",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["passowrd", "confirmPassword"],
  })

export default function SignUp() {
  const { toast } = useToast()
  const { execute, isPending } = useServerAction(signUpAction, {
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
      redirect("/minigames/first-time")
    },
  })

  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = (data: z.infer<typeof registrationSchema>) => {
    execute(data)
  }

  const [seePassword, setSeePassword] = useState<"text" | "password">(
    "password"
  )

  return (
    <div className="w-full grid-cols-1 grid xl:grid-cols-2 h-screen">
      <span className="w-full bg-[url('/static/image/sign-up.svg')] bg-cover bg-no-repeat bg-left xl:block hidden" />
      <div className="w-full h-full flex items-center justify-center">
        <Card className="w-full mx-14">
          <CardHeader>
            <CardTitle className="font-alagard text-4xl">Sign-up</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="gap-5 flex flex-col">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full"
                          placeholder="Enter your email"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          <Input
                            {...field}
                            className="w-full"
                            placeholder="Enter your password"
                            type={seePassword}
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              setSeePassword((prev) =>
                                prev === "password" ? "text" : "password"
                              )
                            }
                          >
                            {seePassword === "password" ? (
                              <EyeOffIcon />
                            ) : (
                              <EyeIcon />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full"
                          placeholder="Reapeat your password"
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex flex-row justify-between w-full items-center">
                <Button
                  className="font-alagard"
                  type="submit"
                  disabled={isPending || !form.formState.isValid}
                >
                  {isPending ? (
                    <Spinner className="text-background" />
                  ) : (
                    <p>Sign me up!</p>
                  )}
                </Button>
                <Link href="/sign-in  ">
                  <p className="text-sm text-muted-foreground cursor-pointer hover:underline">
                    already have account? click here!
                  </p>
                </Link>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  )
}
