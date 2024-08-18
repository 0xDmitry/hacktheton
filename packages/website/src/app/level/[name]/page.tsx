import Link from "next/link"
import { ActionButtons } from "@/components/ActionButtons"
import { TactCode } from "@/components/TactCode"
import tactCode from "@/data/levels/introduction/code.tact"
import levelDescription from "@/data/levels/introduction/description.md"

export default function Level({ params }: { params: { name: string } }) {
  return (
    <div className="flex justify-center bg-background py-12 px-6">
      <div className="flex flex-col justify-center max-w-5xl border-2 border-foreground">
        <div className="flex text-xl">
          <Link
            href="/"
            className="py-4 pl-4 pr-16 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
          >
            BACK
          </Link>
          <div className="flex justify-end flex-grow p-4 border-b-2 border-foreground">
            {params.name.replaceAll("-", " ").toUpperCase()}
          </div>
        </div>
        <div className="p-12 text-xl">{levelDescription}</div>
        <div className="flex justify-center p-12">
          <TactCode code={tactCode} />
        </div>
        <ActionButtons />
      </div>
    </div>
  )
}
