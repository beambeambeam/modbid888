"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, Eye, EyeOff, X } from "lucide-react"
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
    path: ["password", "confirmPassword"],
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

  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const toggleVisibility = () => setIsVisible((prevState) => !prevState)

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{6,}/, text: "At least 6 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ]

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }))
  }

  const strength = checkStrength(password)

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length
  }, [strength])

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border"
    if (score <= 1) return "bg-red-500"
    if (score <= 2) return "bg-orange-500"
    if (score === 3) return "bg-amber-500"
    return "bg-emerald-500"
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak password"
    if (score === 3) return "Medium password"
    return "Strong password"
  }

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
                        <div className="flex flex-col gap-2">
                          <div className="relative">
                            <Input
                              {...field}
                              className="pe-9"
                              placeholder="Enter your password"
                              type={isVisible ? "text" : "password"}
                              value={password}
                              onChange={(e) => {
                                field.onChange(e)
                                setPassword(e.target.value)
                              }}
                              aria-invalid={strengthScore < 4}
                              aria-describedby="password-strength"
                            />
                            <button
                              className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                              type="button"
                              onClick={toggleVisibility}
                              aria-label={
                                isVisible ? "Hide password" : "Show password"
                              }
                              aria-pressed={isVisible}
                              aria-controls="password"
                            >
                              {isVisible ? (
                                <EyeOff
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              ) : (
                                <Eye
                                  size={16}
                                  strokeWidth={2}
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                          </div>
                          <div
                            className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                            role="progressbar"
                            aria-valuenow={strengthScore}
                            aria-valuemin={0}
                            aria-valuemax={4}
                            aria-label="Password strength"
                          >
                            <div
                              className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                              style={{ width: `${(strengthScore / 4) * 100}%` }}
                            ></div>
                          </div>
                          <p
                            id="password-strength"
                            className="mb-2 text-sm font-medium text-foreground"
                          >
                            {getStrengthText(strengthScore)}. Must contain:
                          </p>
                          <ul
                            className="space-y-1.5"
                            aria-label="Password requirements"
                          >
                            {strength.map((req, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                {req.met ? (
                                  <Check
                                    size={16}
                                    className="text-emerald-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <X
                                    size={16}
                                    className="text-muted-foreground/80"
                                    aria-hidden="true"
                                  />
                                )}
                                <span
                                  className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                                >
                                  {req.text}
                                  <span className="sr-only">
                                    {req.met
                                      ? " - Requirement met"
                                      : " - Requirement not met"}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
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
                          placeholder="Repeat your password"
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
                <Link href="/sign-in">
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
