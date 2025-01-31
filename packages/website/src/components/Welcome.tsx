import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"

export const Welcome = ({ locale }: { locale: Locale }) => {
  const {
    page: { home },
  } = getLangDictionary(locale)

  return (
    <div className="flex justify-center">
      <div className="max-w-7xl text-lg text-center">
        {home.welcome.firstPart}
        <a
          className="text-slate-400 hover:text-slate-300"
          href="https://ethernaut.openzeppelin.com/"
          target="_blank"
        >
          The Ethernaut
        </a>
        {home.welcome.secondPart}
        <br />
        {home.welcome.thirdPart}
      </div>
    </div>
  )
}
