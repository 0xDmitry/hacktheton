import Link from "next/link"
import { HackTheTon } from "@/components/assets/HackTheTon"

export const Header = () => (
  <header className="container mx-auto flex items-center justify-center sm:justify-between p-6">
    <Link href="/">
      <div className="flex items-center gap-6 select-none">
        <HackTheTon />
        <div className="text-4xl">HACK THE TON</div>
      </div>
    </Link>
    {/* <div>Connect Wallet</div> */}
  </header>
)
