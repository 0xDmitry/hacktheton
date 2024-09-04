"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import {
  useTonConnectUI,
  TonConnectButton as TonConnectUIButton,
  Locales,
} from "@tonconnect/ui-react"

export const TonConnectButton = () => {
  const params = useParams()

  const [_, setOptions] = useTonConnectUI()

  useEffect(() => {
    setOptions({ language: params.locale as Locales })
  }, [params.locale, setOptions])

  return (
    <TonConnectUIButton className="[&_button]:max-sm:max-w-44 [&_button]:bg-foreground [&_button_*]:text-black [&_button_*]:fill-black" />
  )
}
