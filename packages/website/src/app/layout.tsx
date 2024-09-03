import type { Metadata } from "next"
import { Anonymous_Pro } from "next/font/google"
import localFont from "next/font/local"
import { TonConnectProvider } from "@/providers/TonConnectProvider"
import Script from "next/script"
import "@/app/globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { i18n } from "@/i18n.config"

export const metadata: Metadata = {
  title: "Hack the TON",
  description: "TON Based Wargame",
}

const anonymousPro = Anonymous_Pro({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--anonymous-pro",
})

const courierNew = localFont({
  src: "../fonts/CourierNew.ttf",
  display: "swap",
  variable: "--font-courier-new",
})

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }))
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html>
      <body
        // TODO: Uncomment before release
        // suppressHydrationWarning
        className={`${anonymousPro.variable} ${courierNew.variable} flex flex-col h-dvh subpixel-antialiased`}
      >
        <TonConnectProvider>
          <Header />
          <div className="grow flex bg-background">{children}</div>
          <Footer />
        </TonConnectProvider>
      </body>
      <Script
        defer
        src="https://cloud.umami.is/script.js"
        data-website-id="8563ccf8-341c-4bea-a79b-b542d63644a8"
      />
    </html>
  )
}
