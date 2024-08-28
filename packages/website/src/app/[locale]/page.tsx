import { TypewriterText } from "@/components/TypewriterText"
import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"

export default async function Home({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const {
    page: { home },
  } = await getLangDictionary(locale)

  return (
    <div className="flex items-center justify-center grow p-6 text-5xl text-center">
      <TypewriterText
        text={`${home.welcomeText.firstLine}\n${home.welcomeText.secondLine}`}
      />
    </div>
  )
}
