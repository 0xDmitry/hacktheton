import { match as matchLocale } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { deleteCookie, getCookie } from "cookies-next"
import { i18n, Locale } from "@/i18n.config"

function getLocale(request: NextRequest) {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  let locales: string[] = i18n.locales.map((locale) => locale)

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  )
  return matchLocale(languages, locales, i18n.defaultLocale)
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) return

  // If there is no locale, get it from cookie or create based on user preferences
  const cookieLocale = getCookie("lang", {
    res: NextResponse.next(),
    req: request,
  })
  const isCookieLocaleSupported =
    cookieLocale !== undefined && i18n.locales.includes(cookieLocale as Locale)

  const locale = isCookieLocaleSupported ? cookieLocale : getLocale(request)

  // Redirect to localized page
  request.nextUrl.pathname = `/${locale}${pathname}`
  const response = NextResponse.redirect(request.nextUrl)

  // Delete cookie if it is not supported
  if (!isCookieLocaleSupported) {
    deleteCookie("lang", { res: response, req: request })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next|favicon.ico).*)"],
}
