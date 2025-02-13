"use client"

import { useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Address } from "@ton/core"
import { sha256_sync } from "@ton/crypto"
import { useTonConnectModal, useTonWallet } from "@tonconnect/ui-react"
import { useGameManager } from "@/hooks/useGameManager"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { LevelName, levels } from "@/constants/levels"
import { useLangDictionary } from "@/hooks/useLangDictionary"

export const ActionButtons = ({ levelName }: { levelName: LevelName }) => {
  const langDictionary = useLangDictionary()
  const params = useParams()
  const wallet = useTonWallet()
  const { open } = useTonConnectModal()
  const { sendCreateLevel, sendCheckLevel } = useGameManager()
  const playerStats = usePlayerStats()
  const buffer = sha256_sync(levelName)
  const level = playerStats?.levels?.get(BigInt("0x" + buffer.toString("hex")))

  const isLastLevel = useMemo(() => {
    return levelName === levels[levels.length - 1]
  }, [])

  const nextLevelName = useMemo(() => {
    const currentLevelIndex = levels.indexOf(levelName)
    return levels[currentLevelIndex + 1]
  }, [])

  if (wallet) {
    return (
      <div className="grid grid-flow-col auto-cols-fr text-xl">
        {Address.isAddress(level?.address) && !level?.completed && (
          <button
            className="text-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
            onClick={() => sendCheckLevel(levelName)}
          >
            {langDictionary.page.level.checkSolution}
          </button>
        )}
        {level?.completed && !isLastLevel && (
          <Link
            href={`/${params.locale}/level/${nextLevelName}`}
            className="text-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
          >
            {langDictionary.page.level.nextLevel}
          </Link>
        )}
        <button
          className="text-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
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
      className="text-center text-xl p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
    >
      {langDictionary.connectWallet}
    </button>
  )
}
