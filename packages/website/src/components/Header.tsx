import Link from "next/link"
import { HackTheTon } from "@/components/assets/HackTheTon"
import { TonConnectButton } from "@/components/TonConnectButton"

export const Header = () => (
  <header className="container mx-auto flex items-center justify-between p-6">
    <Link href="/">
      <div className="flex items-center gap-6 select-none">
        <HackTheTon />
        <div className="text-4xl hidden sm:block">HACK THE TON</div>
      </div>
    </Link>
    <TonConnectButton />
  </header>
)
