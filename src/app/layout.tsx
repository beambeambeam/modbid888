import type { Metadata } from "next"
import localFont from "next/font/local"

import Provider from "~/components/providers/app-provider"
import { Toaster } from "~/components/ui/toaster"

import "~/styles/globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Modbid888",
  description: "Best place for bid",
  keywords: ["modbid888", "bid", "modbid"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <main>{children}</main>
          <Toaster />
        </body>
      </Provider>
    </html>
  )
}
