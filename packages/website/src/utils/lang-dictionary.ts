import { Locale } from "@/i18n.config"

const dictionaries = {
  en: () =>
    import("@/lang-dictionaries/en.json").then((module) => module.default),
  ru: () =>
    import("@/lang-dictionaries/ru.json").then((module) => module.default),
}

export const getLangDictionary = async (locale: Locale) =>
  dictionaries[locale]()
