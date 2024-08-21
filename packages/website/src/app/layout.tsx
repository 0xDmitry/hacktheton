import type { Metadata } from "next"
import { Anonymous_Pro } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export const metadata: Metadata = {
  title: "Hack the TON",
  description: "TON Based Wargame",
}

const anonymousPro = Anonymous_Pro({ weight: "400", subsets: ["latin"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${anonymousPro.className} flex flex-col justify-between h-dvh subpixel-antialiased`}
      >
        <Header />
        <div className="grow flex bg-background">{children}</div>
        <Footer />
      </body>
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="8563ccf8-341c-4bea-a79b-b542d63644a8"
      />
    </html>
  )
}
