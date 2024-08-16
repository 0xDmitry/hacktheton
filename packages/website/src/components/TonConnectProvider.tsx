"use client"

import { TonConnectUIProvider } from "@tonconnect/ui-react"

// TODO: Change to prod url here and in the manifest
const manifestUrl =
  "https://hacktheton-website-git-epic-mvp-0xdmitrys-projects.vercel.app/tonconnect-manifest.json"

export const TonConnectProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    {children}
  </TonConnectUIProvider>
)
