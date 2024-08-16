import type { Metadata } from "next"
import { Anonymous_Pro } from "next/font/google"
import "./globals.css"
import { TonConnectProvider } from "@/providers/TonConnectProvider"
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
        className={`${anonymousPro.className} flex flex-col subpixel-antialiased`}
      >
        <TonConnectProvider>
          <Header />
          {children}
          <Footer />
        </TonConnectProvider>
      </body>
    </html>
  )
}
