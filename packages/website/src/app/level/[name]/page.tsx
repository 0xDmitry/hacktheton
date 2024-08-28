import { notFound } from "next/navigation"
import Link from "next/link"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { ActionButtons } from "@/components/ActionButtons"
import { LevelName, levelsConfig } from "@/constants/levels"
import { Level } from "@/components/Level"
import { TactCode } from "@/components/TactCode"

export default function LevelPage({ params }: { params: { name: string } }) {
  if (!Object.keys(levelsConfig).includes(params.name as LevelName)) {
    notFound()
  }

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
        <Level
          name={params.name as LevelName}
          code={<TactCode code={levelsConfig[params.name as LevelName].code} />}
        />
        <ActionButtons levelName={params.name as LevelName} />
      </div>
    </div>
  )
}
