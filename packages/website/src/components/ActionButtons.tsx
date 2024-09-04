"use client"

import { Address } from "@ton/core"
import { sha256_sync } from "@ton/crypto"
import { useTonConnectModal, useTonWallet } from "@tonconnect/ui-react"
import { useGameManager } from "@/hooks/useGameManager"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { LevelName } from "@/constants/levels"
import { useLangDictionary } from "@/hooks/useLangDictionary"

export const ActionButtons = ({ levelName }: { levelName: LevelName }) => {
  const langDictionary = useLangDictionary()
  const wallet = useTonWallet()
  const { open } = useTonConnectModal()
  const { sendCreateLevel, sendCheckLevel } = useGameManager()
  const playerStats = usePlayerStats()
  const buffer = sha256_sync(levelName)
  const level = playerStats?.levels?.get(BigInt("0x" + buffer.toString("hex")))

  if (wallet) {
    return (
      <div className="grid grid-flow-col auto-cols-fr text-xl">
        {Address.isAddress(level?.address) && !level?.completed && (
          <button
            className="flex flex-grow justify-center items-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
            onClick={() => sendCheckLevel(levelName)}
          >
            {langDictionary.page.level.checkSolution}
          </button>
        )}
        <button
          className="flex flex-grow justify-center items-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
          onClick={() => sendCreateLevel(levelName)}
        >
          {langDictionary.page.level.getNewInstance}
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={open}
      className="flex flex-grow justify-center items-center text-xl p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
    >
      {langDictionary.connectWallet}
    </button>
  )
}
