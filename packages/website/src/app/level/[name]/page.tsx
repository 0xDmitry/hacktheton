import Link from "next/link"
import { ActionButtons } from "@/components/ActionButtons"
import { TactCode } from "@/components/TactCode"
import { LeftArrow } from "@/components/assets/LeftArrow"
// @ts-ignore
import tactCode from "@/data/levels/introduction/code.tact"
// @ts-ignore
import description from "@/data/levels/introduction/description.md"

export default function Level({ params }: { params: { name: string } }) {
  return (
    <div className="flex justify-center bg-background py-12 px-6">
      <div className="flex flex-col justify-center max-w-5xl border-2 border-foreground">
        <div className="flex text-xl">
          <Link
            href="/"
            className="flex items-center gap-5 p-4 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground [&_svg]:hover:fill-foreground transition"
          >
            <LeftArrow />
            <div>Back</div>
          </Link>
          <div className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground">
            {params.name.replaceAll("-", " ").toUpperCase()}
          </div>
        </div>
        <div className="m-12 text-xl">{description}</div>
        <div className="flex justify-center mx-12 mb-16">
          <TactCode code={tactCode} />
        </div>
        <ActionButtons />
      </div>
    </div>
  )
}
