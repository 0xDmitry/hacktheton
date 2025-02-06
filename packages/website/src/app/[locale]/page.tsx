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
  const {
    page: { home },
  } = getLangDictionary(locale)

  return (
    <div className="container mx-auto flex flex-col justify-center gap-12 my-6 p-6">
      <Welcome locale={locale} />
      <div className="flex justify-center items-center">
        <Link
          className="flex justify-center items-center gap-1 text-2xl tracking-wide text-slate-400 hover:text-slate-300"
          href={`/${locale}/leaderboard`}
        >
          {home.leaderboard}
          <ArrowForward />
        </Link>
      </div>
      <LevelsList />
    </div>
  )
}
