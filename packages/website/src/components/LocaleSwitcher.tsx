"use client"

import { useState, useEffect, useRef } from "react"
import { setCookie, getCookie } from "cookies-next"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { i18n, Locale } from "@/i18n.config"
import { ArrowDown } from "@/components/assets/ArrowDown"

export const LocaleSwitcher = () => {
  const pathName = usePathname()
  const params = useParams()

  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/"
    const segments = pathName.split("/")
    segments[1] = locale
    return segments.join("/")
  }

  const [isOpen, setIsOpen] = useState(false)

  const [currentValue, setCurrentValue] = useState<Locale>(
    (params.locale as Locale) || i18n.defaultLocale,
  )

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeDropdown = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.body.addEventListener("click", closeDropdown)
    return () => document.body.removeEventListener("click", closeDropdown)
  }, [])

  const handleClick = (locale: Locale) => {
    if (getCookie("lang") !== locale) {
      setCookie("lang", locale)
    }

    setCurrentValue(locale)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="flex justify-center items-center gap-1 w-14 h-8 border border-foreground bg-background hover:bg-gray-600 transition"
      >
        <ArrowDown />
        {currentValue.toUpperCase()}
      </button>
      {isOpen ? (
        <div
          ref={dropdownRef}
          className="flex flex-col w-14 absolute top-10 border border-foreground divide-y divide-foreground transition"
        >
          {i18n.locales.map((locale) => (
            <Link
              key={locale}
              href={redirectedPathName(locale)}
              onClick={() => handleClick(locale)}
              className="flex items-center justify-center h-8 bg-background hover:bg-gray-600"
            >
              {locale.toUpperCase()}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}
