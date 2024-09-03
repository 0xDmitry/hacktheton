"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { HackTheTon } from "@/components/assets/HackTheTon"
import { TonConnectButton } from "@/components/TonConnectButton"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"

export const Header = () => {
  const params = useParams()

  return (
    <header className="container mx-auto flex items-center justify-between p-6">
      <Link href={`/${params.locale}`}>
        <div className="flex items-center gap-6 select-none">
          <HackTheTon />
          <div className="text-4xl hidden sm:block">HACK THE TON</div>
        </div>
      </Link>
      <div className="flex items-center gap-4">
        <TonConnectButton />
        <LocaleSwitcher />
      </div>
    </header>
  )
}
