"use client"

import { useParams } from "next/navigation"
import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"

export function useLangDictionary() {
  const params = useParams()
  const locale = params.locale as Locale
  return getLangDictionary(locale)
}
