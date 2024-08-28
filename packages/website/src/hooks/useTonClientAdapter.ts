"use client"

import { Api, TonApiClient } from "@ton-api/client"
import { ContractAdapter } from "@ton-api/ton-adapter"
import { useAsyncInitialize } from "./useAsyncInitialize"

export function useTonClientAdapter() {
  return useAsyncInitialize(async () => {
    const httpClient = new TonApiClient({
      baseUrl: "https://testnet.tonapi.io",
      apiKey: process.env.NEXT_PUBLIC_TON_API_KEY!,
    })
    const client = new Api(httpClient)
    return new ContractAdapter(client)
  }, [])
}
