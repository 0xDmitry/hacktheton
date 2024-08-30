import { Locale } from "@/i18n.config"
import en from "@/lang-dictionaries/en.json"
import ru from "@/lang-dictionaries/ru.json"

const dictionaries = {
  en,
  ru,
}

export const getLangDictionary = (locale: Locale) => dictionaries[locale]
