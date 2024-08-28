"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { i18n, Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"

export default function NotFound() {
  const params = useParams()
  const locale = (params.locale || i18n.defaultLocale) as Locale

  const [content, setContent] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    const getCurrentDictionary = async () => {
      const dictionary = await getLangDictionary(locale)
      setContent(dictionary.page.notFound)
    }

    getCurrentDictionary()
  }, [locale])

  return (
    <div className="container mx-auto flex flex-col justify-center text-center gap-2 p-6">
      <h2 className="text-3xl">{content.title}</h2>
      <p className="text-xl">{content.description}</p>
    </div>
  )
}
