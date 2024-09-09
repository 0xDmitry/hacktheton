"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"

const manifestUrl = "https://hacktheton.com/tonconnect-manifest.json"

export const TonConnectProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    {children}
  </TonConnectUIProvider>
)
