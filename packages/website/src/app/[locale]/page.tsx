import { LevelsList } from "@/components/LevelsList"
import { TypewriterText } from "@/components/TypewriterText"
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
      <LevelsList />
      <TypewriterText className="text-4xl text-center" text={home.moreLevels} />
    </div>
  )
}
