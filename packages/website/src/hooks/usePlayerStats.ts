"use client"

import { useState } from "react"
import { Address, Dictionary, OpenedContract } from "@ton/core"
import { Level, PlayerStats } from "../../../contracts/wrappers/PlayerStats"
import { useTonClientAdapter } from "./useTonClientAdapter"
import { useAsyncInitialize } from "./useAsyncInitialize"
import { useTonConnect } from "./useTonConnect"
import { usePollingEffect } from "./usePollingEffect"

export function usePlayerStats() {
  const clientAdapter = useTonClientAdapter()
  const { sender } = useTonConnect()

  const [stats, setStats] = useState<{
    levels?: Dictionary<bigint, Level>
  }>()

  const playerStats = useAsyncInitialize(async () => {
    if (!clientAdapter || !sender.address) {
      return
    }
    const gameManagerAddress = Address.parse(
      process.env.NEXT_PUBLIC_GAME_MANAGER_ADDRESS!,
    )
    try {
      const contract = await PlayerStats.fromInit(
        gameManagerAddress,
        sender.address,
      )
      return clientAdapter.open(contract) as OpenedContract<PlayerStats>
    } catch {
      return
    }
  }, [clientAdapter, sender.address])

  usePollingEffect(
    async () => {
      let levels
      try {
        levels = await playerStats?.getLevels()
      } catch {
        levels = undefined
      }
      setStats({
        levels,
      })
    },
    [playerStats],
    { interval: 3000 },
  )

  return stats
}
