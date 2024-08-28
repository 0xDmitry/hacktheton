"use client"

import { Address } from "@ton/core"
import { useTonConnectModal, useTonWallet } from "@tonconnect/ui-react"
import { useGameManager } from "@/hooks/useGameManager"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { LevelName } from "@/constants/levels"

export const ActionButtons = ({ levelName }: { levelName: LevelName }) => {
  const wallet = useTonWallet()
  const { open } = useTonConnectModal()
  const { sendCreateLevel, sendCheckLevel } = useGameManager()
  const playerStats = usePlayerStats()

  if (wallet) {
    return (
      <div className="grid grid-flow-col auto-cols-fr text-xl">
        {(playerStats?.levels
          ?.values()
          .findIndex(
            (level) =>
              level.name === levelName &&
              Address.isAddress(level.address) &&
              !level.completed,
          ) ?? -1) >= 0 && (
          <button
            className="flex flex-grow justify-center items-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
            onClick={() => sendCheckLevel(levelName)}
          >
            CHECK SOLUTION
          </button>
        )}
        <button
          className="flex flex-grow justify-center items-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
          onClick={() => sendCreateLevel(levelName)}
        >
          GET NEW INSTANCE
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={open}
      className="flex flex-grow justify-center items-center text-xl p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
    >
      CONNECT WALLET
    </button>
  )
}
