"use client"

import { setCookie } from "cookies-next"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { i18n, Locale } from "@/i18n.config"

export const LocaleSwitcher = () => {
  const pathName = usePathname()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/"
    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  const setLocaleCookie = (locale: Locale) => {
    setCookie("lang", locale)
  }

  return (
    <ul className="flex gap-x-3">
      {i18n.locales.map((locale) => (
        <li key={locale}>
          <Link
            href={redirectedPathName(locale)}
            onClick={() => setLocaleCookie(locale)}
            className="rounded-md border border-foreground bg-background px-3 py-2"
          >
            {locale}
          </Link>
        </li>
      ))}
    </ul>
  )
}
