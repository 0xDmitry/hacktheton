import Link from "next/link"
import { HackTheTon } from "@/components/assets/HackTheTon"

export const Header = () => (
  <header className="container mx-auto flex items-center justify-between p-8">
    <Link href="/">
      <div className="flex items-center gap-4 cursor-pointer">
        <HackTheTon />
        <div className="text-3xl select-none">HACK THE TON</div>
      </div>
    </Link>
    {/* <div>Connect wallet TBD</div> */}
  </header>
)
