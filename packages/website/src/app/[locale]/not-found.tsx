"use client"

import { useLangDictionary } from "@/hooks/useLangDictionary"

export default function NotFound() {
  const langDictionary = useLangDictionary()

  return (
    <div className="container mx-auto flex flex-col justify-center text-center gap-2 p-6">
      <h2 className="text-3xl">{langDictionary.page.notFound.title}</h2>
      <p className="text-xl">{langDictionary.page.notFound.description}</p>
    </div>
  )
}
