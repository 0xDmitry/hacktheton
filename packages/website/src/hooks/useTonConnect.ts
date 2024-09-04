"use client"

import { useEffect, useMemo } from "react"
import { useTonConnectUI } from "@tonconnect/ui-react"
import { Address, Sender, SenderArguments } from "@ton/core"

export function useTonConnect(): { sender: Sender } {
  const [tonConnectUI] = useTonConnectUI()

  const address = useMemo(
    () =>
      tonConnectUI?.account?.address
        ? Address.parse(tonConnectUI.account.address)
        : undefined,
    [tonConnectUI?.account?.address],
  )

  const sender = useMemo(
    () => ({
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        })
      },
      address,
    }),
    [address, tonConnectUI],
  )

  useEffect(() => {
    window.player = sender
  }, [sender])

  return {
    sender,
  }
}
