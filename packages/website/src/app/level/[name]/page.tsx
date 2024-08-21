import Link from "next/link"
import { ActionButtons } from "@/components/ActionButtons"
import { TactCode } from "@/components/TactCode"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
// @ts-ignore
import tactCode from "@/data/levels/introduction/code.tact"
// @ts-ignore
import description from "@/data/levels/introduction/description.md"

export default function Level({ params }: { params: { name: string } }) {
  return (
    <div className="flex justify-center w-full md:container md:mx-auto md:py-12 md:px-6">
      <div className="flex flex-col justify-center w-full border-2 border-foreground">
        <div className="flex text-xl">
          <Link
            href="/"
            className="flex items-center gap-5 p-4 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground [&_svg]:hover:fill-foreground transition"
          >
            <LeftArrow />
            <div>BACK</div>
          </Link>
          <TypewriterText
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground"
            text={params.name.replaceAll("-", " ").toUpperCase()}
          />
        </div>
        <div className="p-6 md:p-12 text-lg md:text-xl">{description}</div>
        <div className="flex justify-center p-6 md:p-12">
          <TactCode code={tactCode} />
        </div>
        <ActionButtons />
      </div>
    </div>
  )
}