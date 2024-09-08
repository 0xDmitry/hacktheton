"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Locale } from "@/i18n.config"
import { Address } from "@ton/core"
import { sha256_sync } from "@ton/crypto"
import { ContractAdapter } from "@ton-api/ton-adapter"
import { levelsConfig, LevelName } from "@/constants/levels"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { useTonClientAdapter } from "@/hooks/useTonClientAdapter"
import { setupConsoleUtils } from "@/utils/console"
import { CustomConsole } from "@/components/CustomConsole"

export const Level = ({
  name,
  code,
}: {
  name: LevelName
  code: React.ReactNode
}) => {
  const params = useParams()
  const locale = params.locale as Locale

  const clientAdapter = useTonClientAdapter()
  const playerStats = usePlayerStats()
  const buffer = sha256_sync(name)
  const level = playerStats?.levels?.get(BigInt("0x" + buffer.toString("hex")))

  const isCompleted = level?.completed
  const levelInstance = level?.address

  useEffect(() => {
    setupConsoleUtils()
    console.log("Helper methods:")
    window.help()
  }, [])

  useEffect(() => {
    async function openContract(
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) {
      window.contract = await levelsConfig[name].openLevelContract(
        levelInstance,
        clientAdapter,
      )
    }

    if (levelInstance && clientAdapter) {
      openContract(levelInstance, clientAdapter)
    } else {
      window.contract = undefined
    }
  }, [clientAdapter, levelInstance, name])

  return (
    <div className="p-6 md:p-12">
      {!isCompleted && (
        <>
          <br />
          {levelsConfig[name].description[locale]}
        </>
      )}
      {(levelsConfig[name].revealCode || isCompleted) && (
        <>
          <br />
          <div className="flex justify-center">{code}</div>
        </>
      )}
      <br />
      <div className="h-[20rem]">
        <CustomConsole />
      </div>
      {isCompleted && (
        <>
          <br />
          {levelsConfig[name].completedDescription[locale]}
        </>
      )}
    </div>
  )
}
