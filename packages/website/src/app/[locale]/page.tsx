import Link from "next/link"
import { ArrowForward } from "@/components/assets/ArrowForward"
import { LevelsList } from "@/components/LevelsList"
import { Welcome } from "@/components/Welcome"
import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"

export default function Home({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const langDictionary = getLangDictionary(locale)

  return (
    <div className="container mx-auto flex flex-col justify-center gap-8 my-6 p-6">
      <Welcome locale={locale} />
      <div className="flex justify-center items-center text-xl md:text-2xl gap-10 md:gap-48">
        <Link
          className="flex items-center gap-1 tracking-wide text-slate-400 hover:text-slate-300"
          href={`/${locale}/leaderboard`}
        >
          {langDictionary.leaderboard}
          <ArrowForward />
        </Link>
        <Link
          className="flex items-center gap-1 tracking-wide text-slate-400 hover:text-slate-300"
          href={`/${locale}/rewards`}
        >
          {langDictionary.rewards}
          <ArrowForward />
        </Link>
      </div>
      <LevelsList />
      <div className="flex justify-center items-center text-xl">
        <Link
          className="flex items-center gap-1 tracking-wide text-slate-400 hover:text-slate-300"
          href={`/${locale}/level-application`}
        >
          {langDictionary.suggestLevel}
          <ArrowForward />
        </Link>
      </div>
    </div>
  )
}
