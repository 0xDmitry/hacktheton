"use client"

import { useState } from "react"
import { Address, Dictionary, OpenedContract, toNano } from "@ton/core"
import { Player, Leaderboard } from "../../../contracts/wrappers/Leaderboard"
import { useContractAdapter } from "./useContractAdapter"
import { useAsyncInitialize } from "./useAsyncInitialize"
import { useTonConnect } from "./useTonConnect"
import { usePollingEffect } from "./usePollingEffect"

export function useLeaderboard() {
  const contractAdapter = useContractAdapter()
  const { sender } = useTonConnect()

  const leaderboard = useAsyncInitialize(async () => {
    if (!contractAdapter) return
    const contract = Leaderboard.fromAddress(
      Address.parse(process.env.NEXT_PUBLIC_LEADERBOARD_ADDRESS!),
    )
    return contractAdapter.open(contract) as OpenedContract<Leaderboard>
  }, [contractAdapter])

  const [players, setPlayers] = useState<Dictionary<Address, Player>>(
    Dictionary.empty(),
  )

  usePollingEffect(
    async () => {
      try {
        if (leaderboard) {
          setPlayers(await leaderboard.getPlayers())
        } else {
          setPlayers(Dictionary.empty())
        }
      } catch {
        setPlayers(Dictionary.empty())
      }
    },
    [leaderboard],
    { interval: 1000 },
  )

  return {
    sendAddPlayer: (name: string) => {
      return leaderboard?.send(
        sender,
        { value: toNano(0.1) },
        {
          $$type: "AddPlayer",
          name,
        },
      )
    },
    sendUpdatePlayer: (name: string) => {
      return leaderboard?.send(
        sender,
        { value: toNano(0.1) },
        {
          $$type: "UpdatePlayer",
          name,
        },
      )
    },
    players,
  }
}
