"use client"

import { Address, OpenedContract, toNano } from "@ton/core"
import { GameManager } from "../../../contracts/wrappers/GameManager"
import { useTonClientAdapter } from "./useTonClientAdapter"
import { useAsyncInitialize } from "./useAsyncInitialize"
import { useTonConnect } from "./useTonConnect"

export function useGameManager() {
  const clientAdapter = useTonClientAdapter()
  const { sender } = useTonConnect()

  const gameManager = useAsyncInitialize(async () => {
    if (!clientAdapter) return
    const contract = GameManager.fromAddress(
      Address.parse(process.env.NEXT_PUBLIC_GAME_MANAGER_ADDRESS!),
    )
    return clientAdapter.open(contract) as OpenedContract<GameManager>
  }, [clientAdapter])

  return {
    sendCreateLevel: (name: string) => {
      return gameManager?.send(
        sender,
        { value: toNano(0.05) },
        {
          $$type: "CreateLevel",
          name,
        },
      )
    },
    sendCheckLevel: (name: string) => {
      return gameManager?.send(
        sender,
        { value: toNano(0.05) },
        {
          $$type: "CheckLevel",
          name,
        },
      )
    },
  }
}
