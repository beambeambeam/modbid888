import { byRoleAccessRedirect } from "~/lib/roles"

export default async function MinigameLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  byRoleAccessRedirect(["admin", "member"], "/")

  return <>{children}</>
}
