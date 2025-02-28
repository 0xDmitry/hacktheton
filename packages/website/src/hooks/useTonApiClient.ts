"use client"

import { Api, TonApiClient } from "@ton-api/client"
import { useAsyncInitialize } from "./useAsyncInitialize"

export function useTonApiClient() {
  return useAsyncInitialize(async () => {
    const httpClient = new TonApiClient({
      baseUrl: "https://testnet.tonapi.io",
      apiKey: process.env.NEXT_PUBLIC_TON_API_KEY!,
    })
    return new Api(httpClient)
  }, [])
}
