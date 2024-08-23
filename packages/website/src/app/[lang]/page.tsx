import { TypewriterText } from "@/components/TypewriterText"
import { Locale } from "@/i18n.config"
import { getDictionary } from "@/lib/dictionary"

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const {
    page: { home },
  } = await getDictionary(lang)

  return (
    <div className="flex items-center justify-center grow p-6 text-5xl text-center">
      <TypewriterText
        text={`${home.plugText.firstLine}\n${home.plugText.secondLine}`}
      />
    </div>
  )
}
