import { notFound } from "next/navigation"
import Link from "next/link"
import { Locale } from "@/i18n.config"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { ActionButtons } from "@/components/ActionButtons"
import { LevelName, levelsConfig } from "@/constants/levels"
import { Level } from "@/components/Level"
import { TactCode } from "@/components/TactCode"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { CustomConsole } from "@/components/CustomConsole"

export default function LevelPage({
  params: { name, locale },
}: {
  params: { name: string; locale: Locale }
}) {
  if (!Object.keys(levelsConfig).includes(name as LevelName)) {
    notFound()
  }

  const langDictionary = getLangDictionary(locale)

  return (
    <div className="flex justify-center w-full md:container md:mx-auto md:py-12 md:px-6">
      <div className="flex flex-col justify-center w-full border-2 border-foreground">
        <div className="flex text-xl">
          <Link
            href="/"
            className="flex items-center gap-5 p-4 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground [&_svg]:hover:fill-foreground transition"
          >
            <LeftArrow />
            <div>{langDictionary.back}</div>
          </Link>
          <TypewriterText
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground"
            text={langDictionary.levels[name as LevelName]}
          />
        </div>
        <Level
          name={name as LevelName}
          code={<TactCode code={levelsConfig[name as LevelName].code} />}
        />
        <ActionButtons levelName={name as LevelName} />
        <div className="h-[100px]">
          <CustomConsole />
        </div>
      </div>
    </div>
  )
}
