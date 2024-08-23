"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { i18n, Locale } from "@/i18n.config"
import { getDictionary } from "@/lib/dictionary"

export default function NotFound() {
  const params = useParams()
  const lang = (params.lang || i18n.defaultLocale) as Locale

  const [dictionary, setDictionary] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    const getCurrentDictionary = async () => {
      const dictionary = await getDictionary(lang)
      setDictionary(dictionary.page.notFound)
    }

    getCurrentDictionary()
  }, [])

  return (
    <div className="container mx-auto flex flex-col justify-center text-center gap-2 p-6">
      <h2 className="text-3xl">{dictionary.title}</h2>
      <p className="text-xl">{dictionary.description}</p>
    </div>
  )
}
